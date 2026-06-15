package com.wealthdailytracker.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(val route: String) {
    // Root screens
    object Splash : Screen("splash")

    // Bottom nav screens
    object Home : Screen("home")
    object Income : Screen("income")
    object Expenses : Screen("expenses")
    object Wealth : Screen("wealth")
    object Reports : Screen("reports")
    object Goals : Screen("goals")
    object Settings : Screen("settings")

    // Detail / form screens
    object AddEditIncome : Screen("add_edit_income?id={id}") {
        fun createRoute(id: Long = -1L) = "add_edit_income?id=$id"
        const val ARG_ID = "id"
    }
    object AddEditExpense : Screen("add_edit_expense?id={id}") {
        fun createRoute(id: Long = -1L) = "add_edit_expense?id=$id"
        const val ARG_ID = "id"
    }
    object AddEditAsset : Screen("add_edit_asset?id={id}") {
        fun createRoute(id: Long = -1L) = "add_edit_asset?id=$id"
        const val ARG_ID = "id"
    }
    object AddEditLiability : Screen("add_edit_liability?id={id}") {
        fun createRoute(id: Long = -1L) = "add_edit_liability?id=$id"
        const val ARG_ID = "id"
    }
    object AddEditGoal : Screen("add_edit_goal?id={id}") {
        fun createRoute(id: Long = -1L) = "add_edit_goal?id=$id"
        const val ARG_ID = "id"
    }
}

data class BottomNavItem(
    val screen: Screen,
    val label: String,
    val icon: ImageVector
)

val bottomNavItems = listOf(
    BottomNavItem(Screen.Home, "Home", Icons.Filled.Home),
    BottomNavItem(Screen.Income, "Income", Icons.Filled.TrendingUp),
    BottomNavItem(Screen.Expenses, "Expenses", Icons.Filled.TrendingDown),
    BottomNavItem(Screen.Wealth, "Wealth", Icons.Filled.AccountBalance),
    BottomNavItem(Screen.Reports, "Reports", Icons.Filled.BarChart),
    BottomNavItem(Screen.Goals, "Goals", Icons.Filled.Flag),
    BottomNavItem(Screen.Settings, "Settings", Icons.Filled.Settings)
)
