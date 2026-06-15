package com.wealthdailytracker.presentation.screen.settings

import androidx.compose.foundation.clickable
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
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    isDarkMode: Boolean,
    onDarkModeToggle: (Boolean) -> Unit
) {
    var showResetDialog by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Settings", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background)
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding),
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            // --- Preferences ---
            item { SettingsSectionHeader("Preferences") }
            item {
                SettingsCard {
                    SettingsToggleRow(
                        icon = Icons.Filled.DarkMode,
                        title = "Dark Mode",
                        subtitle = "Switch to dark theme",
                        checked = isDarkMode,
                        onCheckedChange = onDarkModeToggle
                    )
                    HorizontalDivider(modifier = Modifier.padding(horizontal = 16.dp))
                    SettingsInfoRow(
                        icon = Icons.Filled.CurrencyExchange,
                        title = "Currency",
                        subtitle = "Egyptian Pound (EGP)",
                        trailingText = "EGP"
                    )
                }
            }

            // --- Data Management ---
            item { SettingsSectionHeader("Data Management") }
            item {
                SettingsCard {
                    SettingsActionRow(
                        icon = Icons.Filled.Backup,
                        title = "Backup Data",
                        subtitle = "Coming soon — Google Drive backup",
                        iconTint = Color(0xFF0B1F3A)
                    )
                    HorizontalDivider(modifier = Modifier.padding(horizontal = 16.dp))
                    SettingsActionRow(
                        icon = Icons.Filled.FileDownload,
                        title = "Export to CSV / Excel",
                        subtitle = "Coming soon — export all records",
                        iconTint = Color(0xFF0B1F3A)
                    )
                    HorizontalDivider(modifier = Modifier.padding(horizontal = 16.dp))
                    SettingsActionRow(
                        icon = Icons.Filled.DeleteForever,
                        title = "Reset All Data",
                        subtitle = "Permanently delete all records",
                        iconTint = Color(0xFFD9534F),
                        titleColor = Color(0xFFD9534F),
                        onClick = { showResetDialog = true }
                    )
                }
            }

            // --- About ---
            item { SettingsSectionHeader("About") }
            item {
                SettingsCard {
                    SettingsInfoRow(
                        icon = Icons.Filled.Info,
                        title = "App Version",
                        subtitle = "Wealth Daily Tracker",
                        trailingText = "v1.0"
                    )
                    HorizontalDivider(modifier = Modifier.padding(horizontal = 16.dp))
                    SettingsInfoRow(
                        icon = Icons.Filled.Code,
                        title = "Tech Stack",
                        subtitle = "Kotlin · Jetpack Compose · Room · MVVM",
                        trailingText = ""
                    )
                }
            }

            // --- Upcoming Features ---
            item { SettingsSectionHeader("Coming Soon") }
            item {
                SettingsCard {
                    listOf(
                        "Excel / CSV Export" to Icons.Filled.TableChart,
                        "Google Drive Backup" to Icons.Filled.CloudUpload,
                        "Biometric / PIN Lock" to Icons.Filled.Fingerprint,
                        "Multi-Currency Support" to Icons.Filled.CurrencyExchange,
                        "Gold Price Tracking" to Icons.Filled.ShowChart,
                        "Receipt Photo Attachment" to Icons.Filled.CameraAlt,
                        "Recurring Expenses" to Icons.Filled.Repeat
                    ).forEachIndexed { i, (label, icon) ->
                        if (i > 0) HorizontalDivider(modifier = Modifier.padding(horizontal = 16.dp))
                        SettingsActionRow(
                            icon = icon,
                            title = label,
                            subtitle = "Planned for a future release",
                            iconTint = MaterialTheme.colorScheme.primary
                        )
                    }
                }
            }

            item { Spacer(Modifier.height(32.dp)) }
        }
    }

    if (showResetDialog) {
        AlertDialog(
            onDismissRequest = { showResetDialog = false },
            icon = { Icon(Icons.Filled.Warning, null, tint = Color(0xFFD9534F)) },
            title = { Text("Reset All Data?") },
            text = { Text("This will permanently delete all income, expense, asset, liability, and goal records. This action cannot be undone.") },
            confirmButton = {
                Button(
                    onClick = { showResetDialog = false /* TODO: wire reset */ },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFD9534F))
                ) { Text("Delete Everything") }
            },
            dismissButton = {
                OutlinedButton(onClick = { showResetDialog = false }) { Text("Cancel") }
            }
        )
    }
}

@Composable
private fun SettingsSectionHeader(title: String) {
    Text(
        text = title,
        style = MaterialTheme.typography.labelLarge,
        color = MaterialTheme.colorScheme.primary,
        fontWeight = FontWeight.SemiBold,
        modifier = Modifier.padding(vertical = 4.dp)
    )
}

@Composable
private fun SettingsCard(content: @Composable ColumnScope.() -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(1.dp)
    ) {
        Column(content = content)
    }
}

@Composable
private fun SettingsToggleRow(
    icon: ImageVector,
    title: String,
    subtitle: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Icon(icon, null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(22.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(title, fontWeight = FontWeight.Medium)
            Text(subtitle, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
        Switch(checked = checked, onCheckedChange = onCheckedChange)
    }
}

@Composable
private fun SettingsInfoRow(
    icon: ImageVector,
    title: String,
    subtitle: String,
    trailingText: String
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Icon(icon, null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(22.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(title, fontWeight = FontWeight.Medium)
            Text(subtitle, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
        if (trailingText.isNotBlank()) {
            Text(trailingText, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

@Composable
private fun SettingsActionRow(
    icon: ImageVector,
    title: String,
    subtitle: String,
    iconTint: Color = MaterialTheme.colorScheme.primary,
    titleColor: Color = MaterialTheme.colorScheme.onSurface,
    onClick: (() -> Unit)? = null
) {
    Row(
        modifier = if (onClick != null) Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .padding(16.dp)
        else Modifier
            .fillMaxWidth()
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Icon(icon, null, tint = iconTint, modifier = Modifier.size(22.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(title, fontWeight = FontWeight.Medium, color = titleColor)
            Text(subtitle, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
        if (onClick != null) {
            Icon(Icons.Filled.ChevronRight, null, tint = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

