package com.wealthdailytracker.presentation.screen.wealth

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import com.wealthdailytracker.data.database.entity.AssetEntity
import com.wealthdailytracker.data.database.entity.LiabilityEntity
import com.wealthdailytracker.presentation.viewmodel.WealthViewModel
import com.wealthdailytracker.ui.components.NetWorthCard
import com.wealthdailytracker.ui.components.formatAmount
import com.wealthdailytracker.ui.components.formatDate

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WealthScreen(
    viewModel: WealthViewModel,
    onAddAsset: () -> Unit,
    onEditAsset: (Long) -> Unit,
    onAddLiability: () -> Unit,
    onEditLiability: (Long) -> Unit
) {
    val state by viewModel.uiState.collectAsState()
    var selectedTab by remember { mutableIntStateOf(0) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Wealth Overview", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background)
            )
        },
        floatingActionButton = {
            when (selectedTab) {
                0 -> FloatingActionButton(onClick = onAddAsset, containerColor = Color(0xFF0B1F3A)) {
                    Icon(Icons.Filled.Add, "Add Asset", tint = Color.White)
                }
                1 -> FloatingActionButton(onClick = onAddLiability, containerColor = Color(0xFFD9534F)) {
                    Icon(Icons.Filled.Add, "Add Liability", tint = Color.White)
                }
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            // Net Worth Summary
            NetWorthCard(
                netWorth = state.netWorth,
                totalAssets = state.totalAssets,
                totalLiabilities = state.totalLiabilities,
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
            )

            // Tabs
            TabRow(selectedTabIndex = selectedTab) {
                Tab(selected = selectedTab == 0, onClick = { selectedTab = 0 }, text = { Text("Assets") })
                Tab(selected = selectedTab == 1, onClick = { selectedTab = 1 }, text = { Text("Liabilities") })
                Tab(selected = selectedTab == 2, onClick = { selectedTab = 2 }, text = { Text("Analysis") })
            }

            when (selectedTab) {
                0 -> AssetsTab(state.assets, onEditAsset, viewModel::deleteAsset)
                1 -> LiabilitiesTab(state.liabilities, state.upcomingPayments, onEditLiability, viewModel::deleteLiability)
                2 -> AnalysisTab(state.totalAssets, state.totalLiabilities, state.netWorth)
            }
        }
    }
}

@Composable
private fun AssetsTab(
    assets: List<AssetEntity>,
    onEdit: (Long) -> Unit,
    onDelete: (AssetEntity) -> Unit
) {
    if (assets.isEmpty()) {
        EmptyState("No assets recorded", "Add your cash, bank accounts, investments, and more")
    } else {
        LazyColumn(
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(assets, key = { it.id }) { asset ->
                AssetCard(asset = asset, onEdit = { onEdit(asset.id) }, onDelete = { onDelete(asset) })
            }
            item { Spacer(Modifier.height(72.dp)) }
        }
    }
}

@Composable
private fun LiabilitiesTab(
    liabilities: List<LiabilityEntity>,
    upcoming: List<LiabilityEntity>,
    onEdit: (Long) -> Unit,
    onDelete: (LiabilityEntity) -> Unit
) {
    if (liabilities.isEmpty()) {
        EmptyState("No liabilities recorded", "Add debts, loans, credit cards, and installments")
    } else {
        LazyColumn(
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            if (upcoming.isNotEmpty()) {
                item {
                    Text(
                        "Due within 30 days",
                        style = MaterialTheme.typography.titleSmall,
                        color = Color(0xFFD9534F),
                        fontWeight = FontWeight.Bold
                    )
                }
                items(upcoming, key = { "upcoming_${it.id}" }) { liability ->
                    LiabilityCard(liability, urgent = true, onEdit = { onEdit(liability.id) }, onDelete = { onDelete(liability) })
                }
                item { Spacer(Modifier.height(4.dp)) }
                item { Text("All Liabilities", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Bold) }
            }
            items(liabilities, key = { it.id }) { liability ->
                LiabilityCard(liability, onEdit = { onEdit(liability.id) }, onDelete = { onDelete(liability) })
            }
            item { Spacer(Modifier.height(72.dp)) }
        }
    }
}

@Composable
private fun AnalysisTab(totalAssets: Double, totalLiabilities: Double, netWorth: Double) {
    val total = totalAssets + totalLiabilities
    val assetRatio = if (total > 0) (totalAssets / total).toFloat() else 0f

    LazyColumn(
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text("Wealth Composition", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                    LinearProgressIndicator(
                        progress = { assetRatio },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(12.dp),
                        color = Color(0xFF1FA67A),
                        trackColor = Color(0xFFD9534F)
                    )
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                            Box(modifier = Modifier.size(10.dp).padding(1.dp), contentAlignment = Alignment.Center) {
                                Surface(color = Color(0xFF1FA67A), shape = RoundedCornerShape(2.dp)) { Spacer(Modifier.size(10.dp)) }
                            }
                            Text("Assets ${(assetRatio * 100).toInt()}%", style = MaterialTheme.typography.bodySmall)
                        }
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                            Box(modifier = Modifier.size(10.dp).padding(1.dp), contentAlignment = Alignment.Center) {
                                Surface(color = Color(0xFFD9534F), shape = RoundedCornerShape(2.dp)) { Spacer(Modifier.size(10.dp)) }
                            }
                            Text("Liabilities ${((1f - assetRatio) * 100).toInt()}%", style = MaterialTheme.typography.bodySmall)
                        }
                    }
                }
            }
        }
        item {
            Card(modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(16.dp)) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text("Summary", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                    WealthRow("Total Assets", formatAmount(totalAssets), Color(0xFF1FA67A))
                    WealthRow("Total Liabilities", formatAmount(totalLiabilities), Color(0xFFD9534F))
                    HorizontalDivider()
                    WealthRow("Net Worth", formatAmount(netWorth), if (netWorth >= 0) Color(0xFF1FA67A) else Color(0xFFD9534F))
                }
            }
        }
    }
}

@Composable
private fun WealthRow(label: String, value: String, valueColor: Color) {
    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
        Text(label, style = MaterialTheme.typography.bodyMedium)
        Text(value, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold, color = valueColor)
    }
}

@Composable
private fun AssetCard(asset: AssetEntity, onEdit: () -> Unit, onDelete: () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(1.dp),
        onClick = onEdit
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Icon(Icons.Filled.AccountBalance, null, tint = Color(0xFF0B1F3A), modifier = Modifier.size(28.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(asset.name, fontWeight = FontWeight.SemiBold, style = MaterialTheme.typography.bodyLarge)
                Text(asset.type, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                if (asset.notes.isNotBlank()) Text(asset.notes, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant, maxLines = 1)
            }
            Column(horizontalAlignment = Alignment.End) {
                Text(formatAmount(asset.currentValue), fontWeight = FontWeight.Bold, color = Color(0xFF1FA67A))
                asset.purchaseValue?.let {
                    val gain = asset.currentValue - it
                    val gainColor = if (gain >= 0) Color(0xFF1FA67A) else Color(0xFFD9534F)
                    val sign = if (gain >= 0) "+" else ""
                Text("$sign${formatAmount(gain)}", style = MaterialTheme.typography.labelSmall, color = gainColor)
                }
                IconButton(onClick = onDelete, modifier = Modifier.size(24.dp)) {
                    Icon(Icons.Filled.DeleteOutline, null, tint = MaterialTheme.colorScheme.error, modifier = Modifier.size(16.dp))
                }
            }
        }
    }
}

@Composable
private fun LiabilityCard(
    liability: LiabilityEntity,
    urgent: Boolean = false,
    onEdit: () -> Unit,
    onDelete: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (urgent) Color(0xFFFFF3CD) else MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(1.dp),
        onClick = onEdit
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Icon(Icons.Filled.CreditCard, null, tint = Color(0xFFD9534F), modifier = Modifier.size(28.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(liability.name, fontWeight = FontWeight.SemiBold, style = MaterialTheme.typography.bodyLarge)
                Text(liability.type, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                liability.dueDate?.let { Text("Due: ${formatDate(it)}", style = MaterialTheme.typography.bodySmall, color = if (urgent) Color(0xFFD9534F) else MaterialTheme.colorScheme.onSurfaceVariant) }
            }
            Column(horizontalAlignment = Alignment.End) {
                Text(formatAmount(liability.remainingAmount), fontWeight = FontWeight.Bold, color = Color(0xFFD9534F))
                liability.monthlyInstallment?.let {
                    Text("${formatAmount(it)}/mo", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
                IconButton(onClick = onDelete, modifier = Modifier.size(24.dp)) {
                    Icon(Icons.Filled.DeleteOutline, null, tint = MaterialTheme.colorScheme.error, modifier = Modifier.size(16.dp))
                }
            }
        }
    }
}

@Composable
private fun EmptyState(title: String, subtitle: String) {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Icon(Icons.Filled.AccountBalance, null, modifier = Modifier.size(64.dp), tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.4f))
            Text(title, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Text(subtitle, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}
