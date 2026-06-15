package com.wealthdailytracker.presentation.screen.goals

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
import com.wealthdailytracker.data.database.entity.GoalEntity
import com.wealthdailytracker.presentation.viewmodel.GoalViewModel
import com.wealthdailytracker.ui.components.formatDate
import java.util.*

val goalCategories = listOf("Buy a home", "Buy a car", "Emergency fund", "Children education", "Investment target", "Other")

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddEditGoalScreen(
    viewModel: GoalViewModel,
    goalId: Long = -1L,
    onBack: () -> Unit
) {
    var name by remember { mutableStateOf("") }
    var category by remember { mutableStateOf(goalCategories[0]) }
    var targetAmount by remember { mutableStateOf("") }
    var currentAmount by remember { mutableStateOf("0") }
    var targetDate by remember {
        // Default to 1 year from now
        val c = Calendar.getInstance()
        c.add(Calendar.YEAR, 1)
        mutableStateOf(c.timeInMillis)
    }
    var showDatePicker by remember { mutableStateOf(false) }
    var notes by remember { mutableStateOf("") }
    var categoryExpanded by remember { mutableStateOf(false) }
    var nameError by remember { mutableStateOf(false) }
    var targetError by remember { mutableStateOf(false) }

    val isEditing = goalId > 0

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(if (isEditing) "Edit Goal" else "New Goal", fontWeight = FontWeight.Bold) },
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
                label = { Text("Goal Name") },
                leadingIcon = { Icon(Icons.Filled.Flag, null) },
                isError = nameError,
                supportingText = if (nameError) ({ Text("Name is required") }) else null,
                modifier = Modifier.fillMaxWidth()
            )

            ExposedDropdownMenuBox(expanded = categoryExpanded, onExpandedChange = { categoryExpanded = it }) {
                OutlinedTextField(
                    value = category,
                    onValueChange = {},
                    readOnly = true,
                    label = { Text("Goal Category") },
                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(categoryExpanded) },
                    modifier = Modifier.fillMaxWidth().menuAnchor()
                )
                ExposedDropdownMenu(expanded = categoryExpanded, onDismissRequest = { categoryExpanded = false }) {
                    goalCategories.forEach { opt ->
                        DropdownMenuItem(text = { Text(opt) }, onClick = { category = opt; categoryExpanded = false })
                    }
                }
            }

            OutlinedTextField(
                value = targetAmount,
                onValueChange = { targetAmount = it; targetError = false },
                label = { Text("Target Amount (EGP)") },
                leadingIcon = { Icon(Icons.Filled.AttachMoney, null) },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                isError = targetError,
                supportingText = if (targetError) ({ Text("Enter a valid target amount") }) else null,
                modifier = Modifier.fillMaxWidth()
            )

            OutlinedTextField(
                value = currentAmount,
                onValueChange = { currentAmount = it },
                label = { Text("Already Saved (EGP)") },
                leadingIcon = { Icon(Icons.Filled.Savings, null) },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                modifier = Modifier.fillMaxWidth()
            )

            OutlinedTextField(
                value = formatDate(targetDate),
                onValueChange = {},
                readOnly = true,
                label = { Text("Target Date") },
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
                    val parsedTarget = targetAmount.toDoubleOrNull()
                    if (name.isBlank()) { nameError = true; return@Button }
                    if (parsedTarget == null || parsedTarget <= 0) { targetError = true; return@Button }
                    val goal = GoalEntity(
                        id = if (isEditing) goalId else 0,
                        name = name.trim(),
                        category = category,
                        targetAmount = parsedTarget,
                        currentAmount = currentAmount.toDoubleOrNull() ?: 0.0,
                        targetDate = targetDate,
                        notes = notes.trim(),
                        updatedAt = System.currentTimeMillis()
                    )
                    if (isEditing) viewModel.updateGoal(goal) else viewModel.addGoal(goal)
                    onBack()
                },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0B1F3A))
            ) {
                Icon(Icons.Filled.Save, null, modifier = Modifier.padding(end = 8.dp))
                Text(if (isEditing) "Update Goal" else "Save Goal")
            }
        }
    }

    if (showDatePicker) {
        val dpState = rememberDatePickerState(initialSelectedDateMillis = targetDate)
        DatePickerDialog(
            onDismissRequest = { showDatePicker = false },
            confirmButton = {
                TextButton(onClick = { dpState.selectedDateMillis?.let { targetDate = it }; showDatePicker = false }) { Text("OK") }
            },
            dismissButton = { TextButton(onClick = { showDatePicker = false }) { Text("Cancel") } }
        ) { DatePicker(state = dpState) }
    }
}
