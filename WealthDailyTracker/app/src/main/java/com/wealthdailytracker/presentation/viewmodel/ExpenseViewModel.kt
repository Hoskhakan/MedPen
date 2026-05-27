package com.wealthdailytracker.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.wealthdailytracker.data.database.dao.CategoryTotal
import com.wealthdailytracker.data.database.entity.ExpenseEntity
import com.wealthdailytracker.data.repository.ExpenseRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.util.Calendar

data class ExpenseUiState(
    val expenses: List<ExpenseEntity> = emptyList(),
    val categoryTotals: List<CategoryTotal> = emptyList(),
    val totalForPeriod: Double = 0.0,
    val selectedYear: Int = Calendar.getInstance().get(Calendar.YEAR),
    val selectedMonth: Int = Calendar.getInstance().get(Calendar.MONTH) + 1,
    val selectedCategory: String = "All"
)

class ExpenseViewModel(private val repository: ExpenseRepository) : ViewModel() {

    private val _uiState = MutableStateFlow(ExpenseUiState())
    val uiState: StateFlow<ExpenseUiState> = _uiState.asStateFlow()

    init {
        loadExpenses()
    }

    private fun loadExpenses() {
        viewModelScope.launch {
            val state = _uiState.value
            val year = String.format("%04d", state.selectedYear)
            val month = String.format("%02d", state.selectedMonth)

            combine(
                repository.getExpensesForMonth(year, month),
                repository.getCategoryTotalsForMonth(year, month)
            ) { list, catTotals ->
                val filtered = if (state.selectedCategory == "All") list
                else list.filter { it.category == state.selectedCategory }
                Triple(filtered, catTotals, filtered.sumOf { it.amount })
            }.collect { (filtered, catTotals, total) ->
                _uiState.update {
                    it.copy(
                        expenses = filtered,
                        categoryTotals = catTotals,
                        totalForPeriod = total
                    )
                }
            }
        }
    }

    fun setMonthYear(year: Int, month: Int) {
        _uiState.update { it.copy(selectedYear = year, selectedMonth = month) }
        loadExpenses()
    }

    fun setCategory(category: String) {
        _uiState.update { it.copy(selectedCategory = category) }
        loadExpenses()
    }

    fun addExpense(expense: ExpenseEntity) {
        viewModelScope.launch { repository.insert(expense) }
    }

    fun updateExpense(expense: ExpenseEntity) {
        viewModelScope.launch { repository.update(expense) }
    }

    fun deleteExpense(expense: ExpenseEntity) {
        viewModelScope.launch { repository.delete(expense) }
    }

    companion object {
        fun factory(repository: ExpenseRepository): ViewModelProvider.Factory =
            object : ViewModelProvider.Factory {
                @Suppress("UNCHECKED_CAST")
                override fun <T : ViewModel> create(modelClass: Class<T>): T =
                    ExpenseViewModel(repository) as T
            }
    }
}
