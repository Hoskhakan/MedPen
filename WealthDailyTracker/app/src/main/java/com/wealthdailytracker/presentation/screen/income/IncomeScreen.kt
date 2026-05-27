package com.wealthdailytracker.presentation.screen.income

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
import com.wealthdailytracker.presentation.viewmodel.IncomeViewModel
import com.wealthdailytracker.ui.components.IncomeTransactionItem
import com.wealthdailytracker.ui.components.formatAmount
import java.util.Calendar

val incomeCategories = listOf(
    "All", "Medical work", "Academic writing", "Statistical analysis",
    "Consultation", "Salary", "Investment return", "Gift", "Other"
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun IncomeScreen(
    viewModel: IncomeViewModel,
    onAddIncome: () -> Unit,
    onEditIncome: (Long) -> Unit
) {
    val state by viewModel.uiState.collectAsState()
    var showCategoryFilter by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Income", fontWeight = FontWeight.Bold) },
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
                onClick = onAddIncome,
                containerColor = Color(0xFF1FA67A)
            ) {
                Icon(Icons.Filled.Add, contentDescription = "Add Income", tint = Color.White)
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            // Month/Year picker row
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
                color = Color(0xFFCCF2E6),
                shape = androidx.compose.foundation.shape.RoundedCornerShape(12.dp)
            ) {
                Row(
                    modifier = Modifier.padding(12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Total Income", style = MaterialTheme.typography.bodyMedium)
                    Text(
                        formatAmount(state.totalForPeriod),
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF1FA67A),
                        style = MaterialTheme.typography.titleMedium
                    )
                }
            }

            // Category filter chip
            if (state.selectedCategory != "All") {
                Row(modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp)) {
                    FilterChip(
                        selected = true,
                        onClick = { viewModel.setCategory("All") },
                        label = { Text(state.selectedCategory) },
                        trailingIcon = { Icon(Icons.Filled.Close, contentDescription = null, modifier = Modifier.size(14.dp)) }
                    )
                }
            }

            if (state.incomes.isEmpty()) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(Icons.Filled.TrendingUp, contentDescription = null, modifier = Modifier.size(64.dp), tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.4f))
                        Spacer(Modifier.height(8.dp))
                        Text("No income records", color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Text("Tap + to add income", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
            } else {
                LazyColumn(
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(state.incomes, key = { it.id }) { income ->
                        IncomeTransactionItem(
                            date = income.date,
                            amount = income.amount,
                            category = income.category,
                            source = income.source,
                            notes = income.notes,
                            onEdit = { onEditIncome(income.id) },
                            onDelete = { viewModel.deleteIncome(income) }
                        )
                    }
                    item { Spacer(Modifier.height(72.dp)) }
                }
            }
        }

        // Category filter dropdown
        if (showCategoryFilter) {
            CategoryFilterDialog(
                categories = incomeCategories,
                selected = state.selectedCategory,
                onSelect = { viewModel.setCategory(it); showCategoryFilter = false },
                onDismiss = { showCategoryFilter = false }
            )
        }
    }
}

@Composable
fun MonthYearRow(
    year: Int,
    month: Int,
    onPrevious: () -> Unit,
    onNext: () -> Unit
) {
    val monthNames = listOf("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 8.dp, vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        IconButton(onClick = onPrevious) {
            Icon(Icons.Filled.ChevronLeft, contentDescription = "Previous month")
        }
        Text(
            "${monthNames[month - 1]} $year",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.SemiBold
        )
        IconButton(onClick = onNext) {
            Icon(Icons.Filled.ChevronRight, contentDescription = "Next month")
        }
    }
}

@Composable
fun CategoryFilterDialog(
    categories: List<String>,
    selected: String,
    onSelect: (String) -> Unit,
    onDismiss: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Filter by Category") },
        text = {
            Column {
                categories.forEach { cat ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(selected = cat == selected, onClick = { onSelect(cat) })
                        Text(cat, modifier = Modifier.padding(start = 8.dp))
                    }
                }
            }
        },
        confirmButton = { TextButton(onClick = onDismiss) { Text("Close") } }
    )
}

fun prevMonth(year: Int, month: Int): Pair<Int, Int> =
    if (month == 1) year - 1 to 12 else year to month - 1

fun nextMonth(year: Int, month: Int): Pair<Int, Int> =
    if (month == 12) year + 1 to 1 else year to month + 1
