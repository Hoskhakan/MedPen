package com.wealthdailytracker.presentation.screen.home

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.wealthdailytracker.presentation.viewmodel.HomeViewModel
import com.wealthdailytracker.ui.components.NetWorthCard
import com.wealthdailytracker.ui.components.SimpleLineChart
import com.wealthdailytracker.ui.components.SummaryCard
import com.wealthdailytracker.ui.components.formatAmount
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    viewModel: HomeViewModel,
    onAddIncome: () -> Unit,
    onAddExpense: () -> Unit,
    onAddAsset: () -> Unit
) {
    val state by viewModel.uiState.collectAsState()
    val today = SimpleDateFormat("EEEE, d MMMM yyyy", Locale.US).format(Date())

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("Wealth Daily Tracker", fontWeight = FontWeight.Bold)
                        Text(today, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background
                )
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
            // --- Net Worth Hero Card ---
            item {
                NetWorthCard(
                    netWorth = state.netWorth,
                    totalAssets = state.totalAssets,
                    totalLiabilities = state.totalLiabilities
                )
            }

            // --- Today Summary ---
            item {
                Text("Today", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            }
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    SummaryCard(
                        title = "Income",
                        amount = state.todayIncome,
                        icon = Icons.Filled.TrendingUp,
                        iconTint = Color(0xFF1FA67A),
                        amountColor = Color(0xFF1FA67A),
                        modifier = Modifier.weight(1f)
                    )
                    SummaryCard(
                        title = "Expenses",
                        amount = state.todayExpenses,
                        icon = Icons.Filled.TrendingDown,
                        iconTint = Color(0xFFD9534F),
                        amountColor = Color(0xFFD9534F),
                        modifier = Modifier.weight(1f)
                    )
                }
            }
            item {
                val netColor = if (state.todayNetBalance >= 0) Color(0xFF1FA67A) else Color(0xFFD9534F)
                SummaryCard(
                    title = "Today's Net Balance",
                    amount = state.todayNetBalance,
                    icon = Icons.Filled.AccountBalanceWallet,
                    iconTint = netColor,
                    amountColor = netColor,
                    modifier = Modifier.fillMaxWidth()
                )
            }

            // --- Monthly Summary ---
            item {
                Text("This Month", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            }
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    SummaryCard(
                        title = "Income",
                        amount = state.monthlyIncome,
                        icon = Icons.Filled.TrendingUp,
                        iconTint = Color(0xFF1FA67A),
                        amountColor = Color(0xFF1FA67A),
                        modifier = Modifier.weight(1f)
                    )
                    SummaryCard(
                        title = "Expenses",
                        amount = state.monthlyExpenses,
                        icon = Icons.Filled.TrendingDown,
                        iconTint = Color(0xFFD9534F),
                        amountColor = Color(0xFFD9534F),
                        modifier = Modifier.weight(1f)
                    )
                }
            }
            item {
                val savingsColor = if (state.monthlySavings >= 0) Color(0xFF1FA67A) else Color(0xFFD9534F)
                SummaryCard(
                    title = "Monthly Savings",
                    amount = state.monthlySavings,
                    icon = Icons.Filled.Savings,
                    iconTint = savingsColor,
                    amountColor = savingsColor,
                    modifier = Modifier.fillMaxWidth()
                )
            }

            // --- Net Worth Trend Chart ---
            if (state.monthlyNetTrend.isNotEmpty()) {
                item {
                    Text("6-Month Net Balance Trend", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                }
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            SimpleLineChart(
                                data = state.monthlyNetTrend,
                                modifier = Modifier.fillMaxWidth()
                            )
                        }
                    }
                }
            }

            // --- Quick Action Buttons ---
            item {
                Text("Quick Add", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            }
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    QuickActionButton("Income", Icons.Filled.Add, Color(0xFF1FA67A), Modifier.weight(1f), onAddIncome)
                    QuickActionButton("Expense", Icons.Filled.Remove, Color(0xFFD9534F), Modifier.weight(1f), onAddExpense)
                    QuickActionButton("Asset", Icons.Filled.AccountBalance, Color(0xFF0B1F3A), Modifier.weight(1f), onAddAsset)
                }
            }

            item { Spacer(Modifier.height(16.dp)) }
        }
    }
}

@Composable
private fun QuickActionButton(
    label: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    containerColor: Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    FilledTonalButton(
        onClick = onClick,
        modifier = modifier,
        shape = RoundedCornerShape(12.dp),
        colors = ButtonDefaults.filledTonalButtonColors(containerColor = containerColor.copy(alpha = 0.12f))
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Icon(icon, contentDescription = label, tint = containerColor, modifier = Modifier.size(22.dp))
            Text(label, style = MaterialTheme.typography.labelSmall, color = containerColor)
        }
    }
}
