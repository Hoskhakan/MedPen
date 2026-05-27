package com.wealthdailytracker.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.wealthdailytracker.data.repository.*
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

data class HomeUiState(
    val todayIncome: Double = 0.0,
    val todayExpenses: Double = 0.0,
    val todayNetBalance: Double = 0.0,
    val monthlyIncome: Double = 0.0,
    val monthlyExpenses: Double = 0.0,
    val monthlySavings: Double = 0.0,
    val totalAssets: Double = 0.0,
    val totalLiabilities: Double = 0.0,
    val netWorth: Double = 0.0,
    // Each entry is (month label e.g. "Jan", net balance)
    val monthlyNetTrend: List<Pair<String, Double>> = emptyList()
)

class HomeViewModel(
    private val incomeRepo: IncomeRepository,
    private val expenseRepo: ExpenseRepository,
    private val assetRepo: AssetRepository,
    private val liabilityRepo: LiabilityRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    init {
        loadDashboard()
    }

    private fun loadDashboard() {
        val cal = Calendar.getInstance()
        val dayStart = getDayStart(cal)
        val dayEnd = getDayEnd(cal)
        val year = String.format("%04d", cal.get(Calendar.YEAR))
        val month = String.format("%02d", cal.get(Calendar.MONTH) + 1)

        viewModelScope.launch {
            // Combine all flows into a single state update
            combine(
                incomeRepo.getTotalForDay(dayStart, dayEnd),
                expenseRepo.getTotalForDay(dayStart, dayEnd),
                incomeRepo.getTotalForMonth(year, month),
                expenseRepo.getTotalForMonth(year, month),
                assetRepo.getTotalAssets(),
                liabilityRepo.getTotalLiabilities()
            ) { values ->
                val todayIncome = values[0]
                val todayExpenses = values[1]
                val monthlyIncome = values[2]
                val monthlyExpenses = values[3]
                val totalAssets = values[4]
                val totalLiabilities = values[5]
                HomeUiState(
                    todayIncome = todayIncome,
                    todayExpenses = todayExpenses,
                    todayNetBalance = todayIncome - todayExpenses,
                    monthlyIncome = monthlyIncome,
                    monthlyExpenses = monthlyExpenses,
                    monthlySavings = monthlyIncome - monthlyExpenses,
                    totalAssets = totalAssets,
                    totalLiabilities = totalLiabilities,
                    netWorth = totalAssets - totalLiabilities
                )
            }.collect { state ->
                _uiState.update { state }
                loadTrend()
            }
        }
    }

    private fun loadTrend() {
        viewModelScope.launch {
            val monthFormat = SimpleDateFormat("yyyy-MM", Locale.US)
            val labelFormat = SimpleDateFormat("MMM", Locale.US)
            val cal = Calendar.getInstance()
            val trend = mutableListOf<Pair<String, Double>>()

            // Build last 6 months of net balance
            for (i in 5 downTo 0) {
                val c = Calendar.getInstance()
                c.add(Calendar.MONTH, -i)
                val ym = monthFormat.format(c.time)
                val label = labelFormat.format(c.time)
                val inc = incomeRepo.getTotalForYearMonth(ym)
                val exp = expenseRepo.getTotalForYearMonth(ym)
                trend.add(label to (inc - exp))
            }
            _uiState.update { it.copy(monthlyNetTrend = trend) }
        }
    }

    private fun getDayStart(cal: Calendar): Long {
        val c = cal.clone() as Calendar
        c.set(Calendar.HOUR_OF_DAY, 0)
        c.set(Calendar.MINUTE, 0)
        c.set(Calendar.SECOND, 0)
        c.set(Calendar.MILLISECOND, 0)
        return c.timeInMillis
    }

    private fun getDayEnd(cal: Calendar): Long {
        val c = cal.clone() as Calendar
        c.set(Calendar.HOUR_OF_DAY, 23)
        c.set(Calendar.MINUTE, 59)
        c.set(Calendar.SECOND, 59)
        c.set(Calendar.MILLISECOND, 999)
        return c.timeInMillis
    }

    companion object {
        fun factory(
            incomeRepo: IncomeRepository,
            expenseRepo: ExpenseRepository,
            assetRepo: AssetRepository,
            liabilityRepo: LiabilityRepository
        ): ViewModelProvider.Factory = object : ViewModelProvider.Factory {
            @Suppress("UNCHECKED_CAST")
            override fun <T : ViewModel> create(modelClass: Class<T>): T =
                HomeViewModel(incomeRepo, expenseRepo, assetRepo, liabilityRepo) as T
        }
    }
}
