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
import com.wealthdailytracker.data.database.entity.LiabilityEntity
import com.wealthdailytracker.presentation.viewmodel.WealthViewModel
import com.wealthdailytracker.ui.components.formatDate

val liabilityTypes = listOf("Personal debt", "Loan", "Credit card", "Installment", "Family obligation", "Other")

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddEditLiabilityScreen(
    viewModel: WealthViewModel,
    liabilityId: Long = -1L,
    onBack: () -> Unit
) {
    var name by remember { mutableStateOf("") }
    var type by remember { mutableStateOf(liabilityTypes[0]) }
    var totalAmount by remember { mutableStateOf("") }
    var remainingAmount by remember { mutableStateOf("") }
    var monthlyInstallment by remember { mutableStateOf("") }
    var selectedDueDate by remember { mutableStateOf<Long?>(null) }
    var showDatePicker by remember { mutableStateOf(false) }
    var notes by remember { mutableStateOf("") }
    var typeExpanded by remember { mutableStateOf(false) }
    var nameError by remember { mutableStateOf(false) }
    var totalError by remember { mutableStateOf(false) }
    var remainingError by remember { mutableStateOf(false) }

    val isEditing = liabilityId > 0

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(if (isEditing) "Edit Liability" else "Add Liability", fontWeight = FontWeight.Bold) },
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
                label = { Text("Liability Name") },
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
                    label = { Text("Liability Type") },
                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(typeExpanded) },
                    modifier = Modifier.fillMaxWidth().menuAnchor()
                )
                ExposedDropdownMenu(expanded = typeExpanded, onDismissRequest = { typeExpanded = false }) {
                    liabilityTypes.forEach { opt ->
                        DropdownMenuItem(text = { Text(opt) }, onClick = { type = opt; typeExpanded = false })
                    }
                }
            }

            OutlinedTextField(
                value = totalAmount,
                onValueChange = { totalAmount = it; totalError = false },
                label = { Text("Total Amount (EGP)") },
                leadingIcon = { Icon(Icons.Filled.AttachMoney, null) },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                isError = totalError,
                supportingText = if (totalError) ({ Text("Enter total amount") }) else null,
                modifier = Modifier.fillMaxWidth()
            )

            OutlinedTextField(
                value = remainingAmount,
                onValueChange = { remainingAmount = it; remainingError = false },
                label = { Text("Remaining Amount (EGP)") },
                leadingIcon = { Icon(Icons.Filled.AttachMoney, null) },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                isError = remainingError,
                supportingText = if (remainingError) ({ Text("Enter remaining amount") }) else null,
                modifier = Modifier.fillMaxWidth()
            )

            OutlinedTextField(
                value = monthlyInstallment,
                onValueChange = { monthlyInstallment = it },
                label = { Text("Monthly Installment (EGP) - Optional") },
                leadingIcon = { Icon(Icons.Filled.CalendarMonth, null) },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                modifier = Modifier.fillMaxWidth()
            )

            OutlinedTextField(
                value = selectedDueDate?.let { formatDate(it) } ?: "No due date",
                onValueChange = {},
                readOnly = true,
                label = { Text("Due Date (Optional)") },
                leadingIcon = { Icon(Icons.Filled.CalendarToday, null) },
                trailingIcon = {
                    Row {
                        Icon(Icons.Filled.Edit, null, modifier = Modifier.clickable { showDatePicker = true })
                        if (selectedDueDate != null) {
                            Spacer(Modifier.width(4.dp))
                            Icon(Icons.Filled.Clear, null, modifier = Modifier.clickable { selectedDueDate = null })
                        }
                    }
                },
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
                    val parsedTotal = totalAmount.toDoubleOrNull()
                    val parsedRemaining = remainingAmount.toDoubleOrNull()
                    if (name.isBlank()) { nameError = true; return@Button }
                    if (parsedTotal == null || parsedTotal < 0) { totalError = true; return@Button }
                    if (parsedRemaining == null || parsedRemaining < 0) { remainingError = true; return@Button }
                    val liability = LiabilityEntity(
                        id = if (isEditing) liabilityId else 0,
                        name = name.trim(),
                        type = type,
                        totalAmount = parsedTotal,
                        remainingAmount = parsedRemaining,
                        monthlyInstallment = monthlyInstallment.toDoubleOrNull(),
                        dueDate = selectedDueDate,
                        notes = notes.trim(),
                        updatedAt = System.currentTimeMillis()
                    )
                    if (isEditing) viewModel.updateLiability(liability) else viewModel.addLiability(liability)
                    onBack()
                },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFD9534F))
            ) {
                Icon(Icons.Filled.Save, null, modifier = Modifier.padding(end = 8.dp))
                Text(if (isEditing) "Update Liability" else "Save Liability")
            }
        }
    }

    if (showDatePicker) {
        val dpState = rememberDatePickerState(initialSelectedDateMillis = selectedDueDate ?: System.currentTimeMillis())
        DatePickerDialog(
            onDismissRequest = { showDatePicker = false },
            confirmButton = {
                TextButton(onClick = { selectedDueDate = dpState.selectedDateMillis; showDatePicker = false }) { Text("OK") }
            },
            dismissButton = { TextButton(onClick = { showDatePicker = false }) { Text("Cancel") } }
        ) { DatePicker(state = dpState) }
    }
}
