package com.wealthdailytracker.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.wealthdailytracker.data.database.entity.AssetEntity
import com.wealthdailytracker.data.database.entity.LiabilityEntity
import com.wealthdailytracker.data.repository.AssetRepository
import com.wealthdailytracker.data.repository.LiabilityRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.util.concurrent.TimeUnit

data class WealthUiState(
    val assets: List<AssetEntity> = emptyList(),
    val liabilities: List<LiabilityEntity> = emptyList(),
    val totalAssets: Double = 0.0,
    val totalLiabilities: Double = 0.0,
    val netWorth: Double = 0.0,
    val upcomingPayments: List<LiabilityEntity> = emptyList()
)

class WealthViewModel(
    private val assetRepo: AssetRepository,
    private val liabilityRepo: LiabilityRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(WealthUiState())
    val uiState: StateFlow<WealthUiState> = _uiState.asStateFlow()

    init {
        loadWealth()
    }

    private fun loadWealth() {
        val now = System.currentTimeMillis()
        val thirtyDaysLater = now + TimeUnit.DAYS.toMillis(30)

        viewModelScope.launch {
            // Combine assets and asset total first
            val assetsFlow: Flow<Pair<List<AssetEntity>, Double>> = combine(
                assetRepo.getAllAssets(),
                assetRepo.getTotalAssets()
            ) { assets, total -> assets to total }

            // Combine liabilities, liability total, and upcoming payments
            val liabilitiesFlow: Flow<Triple<List<LiabilityEntity>, Double, List<LiabilityEntity>>> = combine(
                liabilityRepo.getAllLiabilities(),
                liabilityRepo.getTotalLiabilities(),
                liabilityRepo.getUpcomingDuePayments(now, thirtyDaysLater)
            ) { liabilities, total, upcoming -> Triple(liabilities, total, upcoming) }

            combine(assetsFlow, liabilitiesFlow) { (assets, totalAssets), (liabilities, totalLiabilities, upcoming) ->
                WealthUiState(
                    assets = assets,
                    liabilities = liabilities,
                    totalAssets = totalAssets,
                    totalLiabilities = totalLiabilities,
                    netWorth = totalAssets - totalLiabilities,
                    upcomingPayments = upcoming
                )
            }.collect { state -> _uiState.value = state }
        }
    }

    fun addAsset(asset: AssetEntity) = viewModelScope.launch { assetRepo.insert(asset) }
    fun updateAsset(asset: AssetEntity) = viewModelScope.launch { assetRepo.update(asset) }
    fun deleteAsset(asset: AssetEntity) = viewModelScope.launch { assetRepo.delete(asset) }

    fun addLiability(liability: LiabilityEntity) = viewModelScope.launch { liabilityRepo.insert(liability) }
    fun updateLiability(liability: LiabilityEntity) = viewModelScope.launch { liabilityRepo.update(liability) }
    fun deleteLiability(liability: LiabilityEntity) = viewModelScope.launch { liabilityRepo.delete(liability) }

    companion object {
        fun factory(
            assetRepo: AssetRepository,
            liabilityRepo: LiabilityRepository
        ): ViewModelProvider.Factory = object : ViewModelProvider.Factory {
            @Suppress("UNCHECKED_CAST")
            override fun <T : ViewModel> create(modelClass: Class<T>): T =
                WealthViewModel(assetRepo, liabilityRepo) as T
        }
    }
}
