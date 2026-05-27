package com.wealthdailytracker.presentation.screen.income

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
import com.wealthdailytracker.data.database.entity.IncomeEntity
import com.wealthdailytracker.presentation.viewmodel.IncomeViewModel
import java.util.*

val incomeCategoryOptions = listOf(
    "Medical work", "Academic writing", "Statistical analysis",
    "Consultation", "Salary", "Investment return", "Gift", "Other"
)

val paymentMethods = listOf("Cash", "Bank Transfer", "Vodafone Cash", "InstaPay", "Cheque", "Other")

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddEditIncomeScreen(
    viewModel: IncomeViewModel,
    incomeId: Long = -1L,
    onBack: () -> Unit
) {
    var amount by remember { mutableStateOf("") }
    var source by remember { mutableStateOf("") }
    var category by remember { mutableStateOf(incomeCategoryOptions[0]) }
    var paymentMethod by remember { mutableStateOf(paymentMethods[0]) }
    var notes by remember { mutableStateOf("") }
    var selectedDate by remember { mutableStateOf(System.currentTimeMillis()) }
    var showDatePicker by remember { mutableStateOf(false) }
    var categoryExpanded by remember { mutableStateOf(false) }
    var paymentExpanded by remember { mutableStateOf(false) }
    var amountError by remember { mutableStateOf(false) }

    // Load existing income if editing
    val existingIncome = remember { mutableStateOf<IncomeEntity?>(null) }
    LaunchedEffect(incomeId) {
        if (incomeId > 0) {
            // Would load from DB; simplified here
        }
    }

    val isEditing = incomeId > 0

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(if (isEditing) "Edit Income" else "Add Income", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) { Icon(Icons.Filled.ArrowBack, "Back") }
                },
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
            // Amount
            OutlinedTextField(
                value = amount,
                onValueChange = { amount = it; amountError = false },
                label = { Text("Amount (EGP)") },
                leadingIcon = { Icon(Icons.Filled.AttachMoney, null) },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                isError = amountError,
                supportingText = if (amountError) ({ Text("Enter a valid amount") }) else null,
                modifier = Modifier.fillMaxWidth()
            )

            // Source
            OutlinedTextField(
                value = source,
                onValueChange = { source = it },
                label = { Text("Source (e.g. employer name)") },
                leadingIcon = { Icon(Icons.Filled.Person, null) },
                modifier = Modifier.fillMaxWidth()
            )

            // Category dropdown
            ExposedDropdownMenuBox(
                expanded = categoryExpanded,
                onExpandedChange = { categoryExpanded = it }
            ) {
                OutlinedTextField(
                    value = category,
                    onValueChange = {},
                    readOnly = true,
                    label = { Text("Category") },
                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(categoryExpanded) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .menuAnchor()
                )
                ExposedDropdownMenu(
                    expanded = categoryExpanded,
                    onDismissRequest = { categoryExpanded = false }
                ) {
                    incomeCategoryOptions.forEach { opt ->
                        DropdownMenuItem(
                            text = { Text(opt) },
                            onClick = { category = opt; categoryExpanded = false }
                        )
                    }
                }
            }

            // Payment Method dropdown
            ExposedDropdownMenuBox(
                expanded = paymentExpanded,
                onExpandedChange = { paymentExpanded = it }
            ) {
                OutlinedTextField(
                    value = paymentMethod,
                    onValueChange = {},
                    readOnly = true,
                    label = { Text("Payment Method") },
                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(paymentExpanded) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .menuAnchor()
                )
                ExposedDropdownMenu(
                    expanded = paymentExpanded,
                    onDismissRequest = { paymentExpanded = false }
                ) {
                    paymentMethods.forEach { opt ->
                        DropdownMenuItem(
                            text = { Text(opt) },
                            onClick = { paymentMethod = opt; paymentExpanded = false }
                        )
                    }
                }
            }

            // Date field
            OutlinedTextField(
                value = com.wealthdailytracker.ui.components.formatDate(selectedDate),
                onValueChange = {},
                readOnly = true,
                label = { Text("Date") },
                leadingIcon = { Icon(Icons.Filled.CalendarToday, null) },
                trailingIcon = {
                    Icon(Icons.Filled.Edit, null, modifier = Modifier.clickable { showDatePicker = true })
                },
                modifier = Modifier.fillMaxWidth()
            )

            // Notes
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
                    val parsedAmount = amount.toDoubleOrNull()
                    if (parsedAmount == null || parsedAmount <= 0) {
                        amountError = true
                        return@Button
                    }
                    val income = IncomeEntity(
                        id = if (isEditing) incomeId else 0,
                        date = selectedDate,
                        amount = parsedAmount,
                        source = source.trim().ifBlank { category },
                        category = category,
                        paymentMethod = paymentMethod,
                        notes = notes.trim(),
                        updatedAt = System.currentTimeMillis()
                    )
                    if (isEditing) viewModel.updateIncome(income) else viewModel.addIncome(income)
                    onBack()
                },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1FA67A))
            ) {
                Icon(Icons.Filled.Save, null, modifier = Modifier.padding(end = 8.dp))
                Text(if (isEditing) "Update Income" else "Save Income")
            }
        }
    }

    if (showDatePicker) {
        val datePickerState = rememberDatePickerState(initialSelectedDateMillis = selectedDate)
        DatePickerDialog(
            onDismissRequest = { showDatePicker = false },
            confirmButton = {
                TextButton(onClick = {
                    datePickerState.selectedDateMillis?.let { selectedDate = it }
                    showDatePicker = false
                }) { Text("OK") }
            },
            dismissButton = { TextButton(onClick = { showDatePicker = false }) { Text("Cancel") } }
        ) {
            DatePicker(state = datePickerState)
        }
    }
}
