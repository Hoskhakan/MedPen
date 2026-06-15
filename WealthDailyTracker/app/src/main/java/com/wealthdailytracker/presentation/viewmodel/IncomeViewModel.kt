package com.wealthdailytracker.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.wealthdailytracker.data.database.entity.IncomeEntity
import com.wealthdailytracker.data.repository.IncomeRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.util.Calendar

data class IncomeUiState(
    val incomes: List<IncomeEntity> = emptyList(),
    val totalForPeriod: Double = 0.0,
    val selectedYear: Int = Calendar.getInstance().get(Calendar.YEAR),
    val selectedMonth: Int = Calendar.getInstance().get(Calendar.MONTH) + 1,
    val selectedCategory: String = "All"
)

class IncomeViewModel(private val repository: IncomeRepository) : ViewModel() {

    private val _uiState = MutableStateFlow(IncomeUiState())
    val uiState: StateFlow<IncomeUiState> = _uiState.asStateFlow()

    init {
        loadIncome()
    }

    private fun loadIncome() {
        viewModelScope.launch {
            val state = _uiState.value
            val year = String.format("%04d", state.selectedYear)
            val month = String.format("%02d", state.selectedMonth)
            repository.getIncomeForMonth(year, month).collect { list ->
                val filtered = if (state.selectedCategory == "All") list
                else list.filter { it.category == state.selectedCategory }
                _uiState.update { it.copy(incomes = filtered, totalForPeriod = filtered.sumOf { e -> e.amount }) }
            }
        }
    }

    fun setMonthYear(year: Int, month: Int) {
        _uiState.update { it.copy(selectedYear = year, selectedMonth = month) }
        loadIncome()
    }

    fun setCategory(category: String) {
        _uiState.update { it.copy(selectedCategory = category) }
        loadIncome()
    }

    fun addIncome(income: IncomeEntity) {
        viewModelScope.launch { repository.insert(income) }
    }

    fun updateIncome(income: IncomeEntity) {
        viewModelScope.launch { repository.update(income) }
    }

    fun deleteIncome(income: IncomeEntity) {
        viewModelScope.launch { repository.delete(income) }
    }

    companion object {
        fun factory(repository: IncomeRepository): ViewModelProvider.Factory =
            object : ViewModelProvider.Factory {
                @Suppress("UNCHECKED_CAST")
                override fun <T : ViewModel> create(modelClass: Class<T>): T =
                    IncomeViewModel(repository) as T
            }
    }
}
