package com.wealthdailytracker.presentation.screen.wealth

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.wealthdailytracker.data.database.entity.AssetEntity
import com.wealthdailytracker.presentation.viewmodel.WealthViewModel
import com.wealthdailytracker.ui.components.formatDate

val assetTypes = listOf("Cash", "Bank account", "Investment fund", "Gold", "Real estate", "Car", "Business receivable", "Other")

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddEditAssetScreen(
    viewModel: WealthViewModel,
    assetId: Long = -1L,
    onBack: () -> Unit
) {
    var name by remember { mutableStateOf("") }
    var type by remember { mutableStateOf(assetTypes[0]) }
    var currentValue by remember { mutableStateOf("") }
    var purchaseValue by remember { mutableStateOf("") }
    var selectedDate by remember { mutableStateOf(System.currentTimeMillis()) }
    var showDatePicker by remember { mutableStateOf(false) }
    var notes by remember { mutableStateOf("") }
    var typeExpanded by remember { mutableStateOf(false) }
    var valueError by remember { mutableStateOf(false) }
    var nameError by remember { mutableStateOf(false) }

    val isEditing = assetId > 0

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(if (isEditing) "Edit Asset" else "Add Asset", fontWeight = FontWeight.Bold) },
                navigationIcon = { IconButton(onClick = onBack) { Icon(Icons.Filled.ArrowBack, "Back") } },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background)
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            OutlinedTextField(
                value = name,
                onValueChange = { name = it; nameError = false },
                label = { Text("Asset Name") },
                leadingIcon = { Icon(Icons.Filled.Label, null) },
                isError = nameError,
                supportingText = if (nameError) ({ Text("Name is required") }) else null,
                modifier = Modifier.fillMaxWidth()
            )

            ExposedDropdownMenuBox(expanded = typeExpanded, onExpandedChange = { typeExpanded = it }) {
                OutlinedTextField(
                    value = type,
                    onValueChange = {},
                    readOnly = true,
                    label = { Text("Asset Type") },
                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(typeExpanded) },
                    modifier = Modifier.fillMaxWidth().menuAnchor()
                )
                ExposedDropdownMenu(expanded = typeExpanded, onDismissRequest = { typeExpanded = false }) {
                    assetTypes.forEach { opt ->
                        DropdownMenuItem(text = { Text(opt) }, onClick = { type = opt; typeExpanded = false })
                    }
                }
            }

            OutlinedTextField(
                value = currentValue,
                onValueChange = { currentValue = it; valueError = false },
                label = { Text("Current Value (EGP)") },
                leadingIcon = { Icon(Icons.Filled.AttachMoney, null) },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                isError = valueError,
                supportingText = if (valueError) ({ Text("Enter a valid value") }) else null,
                modifier = Modifier.fillMaxWidth()
            )

            OutlinedTextField(
                value = purchaseValue,
                onValueChange = { purchaseValue = it },
                label = { Text("Purchase Value (EGP) - Optional") },
                leadingIcon = { Icon(Icons.Filled.AttachMoney, null) },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                modifier = Modifier.fillMaxWidth()
            )

            OutlinedTextField(
                value = formatDate(selectedDate),
                onValueChange = {},
                readOnly = true,
                label = { Text("Date Added") },
                leadingIcon = { Icon(Icons.Filled.CalendarToday, null) },
                trailingIcon = { Icon(Icons.Filled.Edit, null, modifier = Modifier.clickable { showDatePicker = true }) },
                modifier = Modifier.fillMaxWidth()
            )

            OutlinedTextField(
                value = notes,
                onValueChange = { notes = it },
                label = { Text("Notes (optional)") },
                leadingIcon = { Icon(Icons.Filled.Notes, null) },
                minLines = 2,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(Modifier.height(8.dp))

            Button(
                onClick = {
                    val parsedValue = currentValue.toDoubleOrNull()
                    if (name.isBlank()) { nameError = true; return@Button }
                    if (parsedValue == null || parsedValue < 0) { valueError = true; return@Button }
                    val asset = AssetEntity(
                        id = if (isEditing) assetId else 0,
                        name = name.trim(),
                        type = type,
                        currentValue = parsedValue,
                        purchaseValue = purchaseValue.toDoubleOrNull(),
                        dateAdded = selectedDate,
                        notes = notes.trim(),
                        updatedAt = System.currentTimeMillis()
                    )
                    if (isEditing) viewModel.updateAsset(asset) else viewModel.addAsset(asset)
                    onBack()
                },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0B1F3A))
            ) {
                Icon(Icons.Filled.Save, null, modifier = Modifier.padding(end = 8.dp))
                Text(if (isEditing) "Update Asset" else "Save Asset")
            }
        }
    }

    if (showDatePicker) {
        val dpState = rememberDatePickerState(initialSelectedDateMillis = selectedDate)
        DatePickerDialog(
            onDismissRequest = { showDatePicker = false },
            confirmButton = {
                TextButton(onClick = { dpState.selectedDateMillis?.let { selectedDate = it }; showDatePicker = false }) { Text("OK") }
            },
            dismissButton = { TextButton(onClick = { showDatePicker = false }) { Text("Cancel") } }
        ) { DatePicker(state = dpState) }
    }
}
