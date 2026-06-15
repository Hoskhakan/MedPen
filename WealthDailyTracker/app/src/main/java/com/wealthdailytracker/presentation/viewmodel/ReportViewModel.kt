package com.wealthdailytracker.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.wealthdailytracker.data.database.dao.CategoryTotal
import com.wealthdailytracker.data.repository.ExpenseRepository
import com.wealthdailytracker.data.repository.IncomeRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.util.Calendar

data class ReportUiState(
    val selectedYear: Int = Calendar.getInstance().get(Calendar.YEAR),
    val selectedMonth: Int = Calendar.getInstance().get(Calendar.MONTH) + 1,
    val totalIncome: Double = 0.0,
    val totalExpenses: Double = 0.0,
    val netSavings: Double = 0.0,
    val savingsRate: Double = 0.0,
    val incomeTransactionCount: Int = 0,
    val expenseTransactionCount: Int = 0,
    val categoryTotals: List<CategoryTotal> = emptyList(),
    // Last 6 months for bar chart
    val monthlyIncomes: List<Double> = emptyList(),
    val monthlyExpenses: List<Double> = emptyList(),
    val monthLabels: List<String> = emptyList()
)

class ReportViewModel(
    private val incomeRepo: IncomeRepository,
    private val expenseRepo: ExpenseRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(ReportUiState())
    val uiState: StateFlow<ReportUiState> = _uiState.asStateFlow()

    init {
        loadReport()
    }

    fun setMonthYear(year: Int, month: Int) {
        _uiState.update { it.copy(selectedYear = year, selectedMonth = month) }
        loadReport()
    }

    private fun loadReport() {
        viewModelScope.launch {
            val state = _uiState.value
            val year = String.format("%04d", state.selectedYear)
            val month = String.format("%02d", state.selectedMonth)

            combine(
                incomeRepo.getIncomeForMonth(year, month),
                expenseRepo.getExpensesForMonth(year, month),
                expenseRepo.getCategoryTotalsForMonth(year, month)
            ) { incomes, expenses, catTotals ->
                val totalInc = incomes.sumOf { it.amount }
                val totalExp = expenses.sumOf { it.amount }
                val savings = totalInc - totalExp
                val rate = if (totalInc > 0) (savings / totalInc) * 100 else 0.0
                Quad(totalInc, totalExp, savings, rate, incomes.size, expenses.size, catTotals)
            }.collect { (totalInc, totalExp, savings, rate, incCount, expCount, catTotals) ->
                _uiState.update {
                    it.copy(
                        totalIncome = totalInc,
                        totalExpenses = totalExp,
                        netSavings = savings,
                        savingsRate = rate,
                        incomeTransactionCount = incCount,
                        expenseTransactionCount = expCount,
                        categoryTotals = catTotals
                    )
                }
                loadTrendData()
            }
        }
    }

    private fun loadTrendData() {
        viewModelScope.launch {
            val monthFormat = java.text.SimpleDateFormat("yyyy-MM", java.util.Locale.US)
            val labelFormat = java.text.SimpleDateFormat("MMM", java.util.Locale.US)
            val incomes = mutableListOf<Double>()
            val expenses = mutableListOf<Double>()
            val labels = mutableListOf<String>()
            for (i in 5 downTo 0) {
                val c = Calendar.getInstance()
                c.add(Calendar.MONTH, -i)
                val ym = monthFormat.format(c.time)
                labels.add(labelFormat.format(c.time))
                incomes.add(incomeRepo.getTotalForYearMonth(ym))
                expenses.add(expenseRepo.getTotalForYearMonth(ym))
            }
            _uiState.update {
                it.copy(monthlyIncomes = incomes, monthlyExpenses = expenses, monthLabels = labels)
            }
        }
    }

    companion object {
        fun factory(
            incomeRepo: IncomeRepository,
            expenseRepo: ExpenseRepository
        ): ViewModelProvider.Factory = object : ViewModelProvider.Factory {
            @Suppress("UNCHECKED_CAST")
            override fun <T : ViewModel> create(modelClass: Class<T>): T =
                ReportViewModel(incomeRepo, expenseRepo) as T
        }
    }
}

// Helper to destructure 7 values from combine
private data class Quad(
    val a: Double, val b: Double, val c: Double, val d: Double,
    val e: Int, val f: Int, val g: List<CategoryTotal>
)

private operator fun Quad.component1() = a
private operator fun Quad.component2() = b
private operator fun Quad.component3() = c
private operator fun Quad.component4() = d
private operator fun Quad.component5() = e
private operator fun Quad.component6() = f
private operator fun Quad.component7() = g
