package com.wealthdailytracker.presentation.screen.expense

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.wealthdailytracker.presentation.screen.income.CategoryFilterDialog
import com.wealthdailytracker.presentation.screen.income.MonthYearRow
import com.wealthdailytracker.presentation.screen.income.nextMonth
import com.wealthdailytracker.presentation.screen.income.prevMonth
import com.wealthdailytracker.presentation.viewmodel.ExpenseViewModel
import com.wealthdailytracker.ui.components.ExpenseTransactionItem
import com.wealthdailytracker.ui.components.formatAmount

val expenseCategories = listOf(
    "All", "Rent", "Food", "Transportation", "Family", "Children", "Education",
    "Healthcare", "Bills", "Work expenses", "Shopping", "Installments",
    "Entertainment", "Emergency", "Other"
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ExpenseScreen(
    viewModel: ExpenseViewModel,
    onAddExpense: () -> Unit,
    onEditExpense: (Long) -> Unit
) {
    val state by viewModel.uiState.collectAsState()
    var showCategoryFilter by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Expenses", fontWeight = FontWeight.Bold) },
                actions = {
                    IconButton(onClick = { showCategoryFilter = true }) {
                        Icon(Icons.Filled.FilterList, contentDescription = "Filter")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background)
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = onAddExpense,
                containerColor = Color(0xFFD9534F)
            ) {
                Icon(Icons.Filled.Add, contentDescription = "Add Expense", tint = Color.White)
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
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

            // Total card
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 4.dp),
                color = Color(0xFFFFDAD6),
                shape = androidx.compose.foundation.shape.RoundedCornerShape(12.dp)
            ) {
                Row(
                    modifier = Modifier.padding(12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Total Expenses", style = MaterialTheme.typography.bodyMedium)
                    Text(
                        formatAmount(state.totalForPeriod),
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFFD9534F),
                        style = MaterialTheme.typography.titleMedium
                    )
                }
            }

            // Category totals chips (top 3 for visibility)
            if (state.categoryTotals.isNotEmpty()) {
                Row(
                    modifier = Modifier
                        .padding(horizontal = 16.dp, vertical = 4.dp)
                        .fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    state.categoryTotals.take(3).forEach { ct ->
                        SuggestionChip(
                            onClick = { viewModel.setCategory(ct.category) },
                            label = { Text("${ct.category}: ${formatAmount(ct.total)}", style = MaterialTheme.typography.labelSmall) }
                        )
                    }
                }
            }

            if (state.selectedCategory != "All") {
                Row(modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp)) {
                    FilterChip(
                        selected = true,
                        onClick = { viewModel.setCategory("All") },
                        label = { Text(state.selectedCategory) },
                        trailingIcon = { Icon(Icons.Filled.Close, null, modifier = Modifier.size(14.dp)) }
                    )
                }
            }

            if (state.expenses.isEmpty()) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(Icons.Filled.TrendingDown, null, modifier = Modifier.size(64.dp), tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.4f))
                        Spacer(Modifier.height(8.dp))
                        Text("No expense records", color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Text("Tap + to add expense", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
            } else {
                LazyColumn(
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(state.expenses, key = { it.id }) { expense ->
                        ExpenseTransactionItem(
                            date = expense.date,
                            amount = expense.amount,
                            category = expense.category,
                            notes = expense.notes,
                            onEdit = { onEditExpense(expense.id) },
                            onDelete = { viewModel.deleteExpense(expense) }
                        )
                    }
                    item { Spacer(Modifier.height(72.dp)) }
                }
            }
        }

        if (showCategoryFilter) {
            CategoryFilterDialog(
                categories = expenseCategories,
                selected = state.selectedCategory,
                onSelect = { viewModel.setCategory(it); showCategoryFilter = false },
                onDismiss = { showCategoryFilter = false }
            )
        }
    }
}
