package com.wealthdailytracker.presentation.screen.reports

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.wealthdailytracker.presentation.screen.income.MonthYearRow
import com.wealthdailytracker.presentation.screen.income.nextMonth
import com.wealthdailytracker.presentation.screen.income.prevMonth
import com.wealthdailytracker.presentation.viewmodel.ReportViewModel
import com.wealthdailytracker.ui.components.SimpleBarChart
import com.wealthdailytracker.ui.components.formatAmount

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ReportScreen(viewModel: ReportViewModel) {
    val state by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Monthly Report", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background)
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding),
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                MonthYearRow(
                    year = state.selectedYear,
                    month = state.selectedMonth,
                    onPrevious = {
                        val (y, m) = prevMonth(state.selectedYear, state.selectedMonth)
                        viewModel.setMonthYear(y, m)
                    },
                    onNext = {
                        val (y, m) = nextMonth(state.selectedYear, state.selectedMonth)
                        viewModel.setMonthYear(y, m)
                    }
                )
            }

            // Summary cards
            item {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    ReportMetricCard("Income", formatAmount(state.totalIncome), Color(0xFF1FA67A), Modifier.weight(1f))
                    ReportMetricCard("Expenses", formatAmount(state.totalExpenses), Color(0xFFD9534F), Modifier.weight(1f))
                }
            }
            item {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    val savingsColor = if (state.netSavings >= 0) Color(0xFF1FA67A) else Color(0xFFD9534F)
                    ReportMetricCard("Net Savings", formatAmount(state.netSavings), savingsColor, Modifier.weight(1f))
                    ReportMetricCard(
                        "Savings Rate",
                        "${String.format("%.1f", state.savingsRate)}%",
                        if (state.savingsRate >= 0) Color(0xFF1FA67A) else Color(0xFFD9534F),
                        Modifier.weight(1f)
                    )
                }
            }
            item {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    ReportMetricCard("Income Txns", "${state.incomeTransactionCount}", Color(0xFF0B1F3A), Modifier.weight(1f))
                    ReportMetricCard("Expense Txns", "${state.expenseTransactionCount}", Color(0xFF0B1F3A), Modifier.weight(1f))
                }
            }

            // Savings rate indicator
            if (state.totalIncome > 0) {
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                    ) {
                        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            Text("Savings Rate", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                            val progress = (state.savingsRate / 100f).toFloat().coerceIn(0f, 1f)
                            LinearProgressIndicator(
                                progress = { progress },
                                modifier = Modifier.fillMaxWidth().height(10.dp),
                                color = if (state.savingsRate >= 20) Color(0xFF1FA67A) else Color(0xFFF59E0B),
                                trackColor = MaterialTheme.colorScheme.surfaceVariant
                            )
                            Text(
                                "${String.format("%.1f", state.savingsRate)}% of income saved",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            }

            // Income vs Expenses bar chart
            if (state.monthlyIncomes.isNotEmpty()) {
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                    ) {
                        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            Text("6-Month Overview", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                                LegendDot(Color(0xFF1FA67A), "Income")
                                LegendDot(Color(0xFFD9534F), "Expenses")
                            }
                            SimpleBarChart(
                                incomes = state.monthlyIncomes,
                                expenses = state.monthlyExpenses,
                                labels = state.monthLabels,
                                modifier = Modifier.fillMaxWidth()
                            )
                        }
                    }
                }
            }

            // Category breakdown
            if (state.categoryTotals.isNotEmpty()) {
                item {
                    Text("Expense Breakdown", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                }
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                    ) {
                        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                            state.categoryTotals.forEach { ct ->
                                val pct = if (state.totalExpenses > 0) (ct.total / state.totalExpenses).toFloat() else 0f
                                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                        Text(ct.category, style = MaterialTheme.typography.bodyMedium)
                                        Text(formatAmount(ct.total), style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold, color = Color(0xFFD9534F))
                                    }
                                    LinearProgressIndicator(
                                        progress = { pct },
                                        modifier = Modifier.fillMaxWidth().height(6.dp),
                                        color = Color(0xFFD9534F),
                                        trackColor = MaterialTheme.colorScheme.surfaceVariant
                                    )
                                    Text("${String.format("%.1f", pct * 100)}%", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                }
                            }
                        }
                    }
                }
            }

            item { Spacer(Modifier.height(16.dp)) }
        }
    }
}

@Composable
private fun ReportMetricCard(label: String, value: String, valueColor: Color, modifier: Modifier) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(1.dp)
    ) {
        Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Text(label, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Text(value, fontWeight = FontWeight.Bold, color = valueColor, style = MaterialTheme.typography.bodyLarge)
        }
    }
}

@Composable
private fun LegendDot(color: Color, label: String) {
    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
        Box(modifier = Modifier.size(10.dp).background(color, shape = RoundedCornerShape(2.dp)))
        Text(label, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}
