package com.wealthdailytracker.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.navArgument
import com.wealthdailytracker.AppContainer
import com.wealthdailytracker.presentation.screen.SplashScreen
import com.wealthdailytracker.presentation.screen.expense.AddEditExpenseScreen
import com.wealthdailytracker.presentation.screen.expense.ExpenseScreen
import com.wealthdailytracker.presentation.screen.goals.AddEditGoalScreen
import com.wealthdailytracker.presentation.screen.goals.GoalScreen
import com.wealthdailytracker.presentation.screen.home.HomeScreen
import com.wealthdailytracker.presentation.screen.income.AddEditIncomeScreen
import com.wealthdailytracker.presentation.screen.income.IncomeScreen
import com.wealthdailytracker.presentation.screen.reports.ReportScreen
import com.wealthdailytracker.presentation.screen.settings.SettingsScreen
import com.wealthdailytracker.presentation.screen.wealth.AddEditAssetScreen
import com.wealthdailytracker.presentation.screen.wealth.AddEditLiabilityScreen
import com.wealthdailytracker.presentation.screen.wealth.WealthScreen
import com.wealthdailytracker.presentation.viewmodel.*

@Composable
fun WealthNavGraph(
    navController: NavHostController,
    container: AppContainer,
    isDarkMode: Boolean,
    onDarkModeToggle: (Boolean) -> Unit,
    modifier: androidx.compose.ui.Modifier = androidx.compose.ui.Modifier
) {
    val homeVm: HomeViewModel = viewModel(
        factory = HomeViewModel.factory(container.incomeRepository, container.expenseRepository, container.assetRepository, container.liabilityRepository)
    )
    val incomeVm: IncomeViewModel = viewModel(factory = IncomeViewModel.factory(container.incomeRepository))
    val expenseVm: ExpenseViewModel = viewModel(factory = ExpenseViewModel.factory(container.expenseRepository))
    val wealthVm: WealthViewModel = viewModel(factory = WealthViewModel.factory(container.assetRepository, container.liabilityRepository))
    val goalVm: GoalViewModel = viewModel(factory = GoalViewModel.factory(container.goalRepository))
    val reportVm: ReportViewModel = viewModel(factory = ReportViewModel.factory(container.incomeRepository, container.expenseRepository))

    NavHost(navController = navController, startDestination = Screen.Splash.route, modifier = modifier) {

        composable(Screen.Splash.route) {
            SplashScreen(onNavigateToHome = {
                navController.navigate(Screen.Home.route) {
                    popUpTo(Screen.Splash.route) { inclusive = true }
                }
            })
        }

        composable(Screen.Home.route) {
            HomeScreen(
                viewModel = homeVm,
                onAddIncome = { navController.navigate(Screen.AddEditIncome.createRoute()) },
                onAddExpense = { navController.navigate(Screen.AddEditExpense.createRoute()) },
                onAddAsset = { navController.navigate(Screen.AddEditAsset.createRoute()) }
            )
        }

        composable(Screen.Income.route) {
            IncomeScreen(
                viewModel = incomeVm,
                onAddIncome = { navController.navigate(Screen.AddEditIncome.createRoute()) },
                onEditIncome = { id -> navController.navigate(Screen.AddEditIncome.createRoute(id)) }
            )
        }

        composable(
            route = Screen.AddEditIncome.route,
            arguments = listOf(navArgument(Screen.AddEditIncome.ARG_ID) {
                type = NavType.LongType; defaultValue = -1L
            })
        ) { backStackEntry ->
            val id = backStackEntry.arguments?.getLong(Screen.AddEditIncome.ARG_ID) ?: -1L
            AddEditIncomeScreen(viewModel = incomeVm, incomeId = id, onBack = { navController.popBackStack() })
        }

        composable(Screen.Expenses.route) {
            ExpenseScreen(
                viewModel = expenseVm,
                onAddExpense = { navController.navigate(Screen.AddEditExpense.createRoute()) },
                onEditExpense = { id -> navController.navigate(Screen.AddEditExpense.createRoute(id)) }
            )
        }

        composable(
            route = Screen.AddEditExpense.route,
            arguments = listOf(navArgument(Screen.AddEditExpense.ARG_ID) {
                type = NavType.LongType; defaultValue = -1L
            })
        ) { backStackEntry ->
            val id = backStackEntry.arguments?.getLong(Screen.AddEditExpense.ARG_ID) ?: -1L
            AddEditExpenseScreen(viewModel = expenseVm, expenseId = id, onBack = { navController.popBackStack() })
        }

        composable(Screen.Wealth.route) {
            WealthScreen(
                viewModel = wealthVm,
                onAddAsset = { navController.navigate(Screen.AddEditAsset.createRoute()) },
                onEditAsset = { id -> navController.navigate(Screen.AddEditAsset.createRoute(id)) },
                onAddLiability = { navController.navigate(Screen.AddEditLiability.createRoute()) },
                onEditLiability = { id -> navController.navigate(Screen.AddEditLiability.createRoute(id)) }
            )
        }

        composable(
            route = Screen.AddEditAsset.route,
            arguments = listOf(navArgument(Screen.AddEditAsset.ARG_ID) {
                type = NavType.LongType; defaultValue = -1L
            })
        ) { backStackEntry ->
            val id = backStackEntry.arguments?.getLong(Screen.AddEditAsset.ARG_ID) ?: -1L
            AddEditAssetScreen(viewModel = wealthVm, assetId = id, onBack = { navController.popBackStack() })
        }

        composable(
            route = Screen.AddEditLiability.route,
            arguments = listOf(navArgument(Screen.AddEditLiability.ARG_ID) {
                type = NavType.LongType; defaultValue = -1L
            })
        ) { backStackEntry ->
            val id = backStackEntry.arguments?.getLong(Screen.AddEditLiability.ARG_ID) ?: -1L
            AddEditLiabilityScreen(viewModel = wealthVm, liabilityId = id, onBack = { navController.popBackStack() })
        }

        composable(Screen.Reports.route) {
            ReportScreen(viewModel = reportVm)
        }

        composable(Screen.Goals.route) {
            GoalScreen(
                viewModel = goalVm,
                onAddGoal = { navController.navigate(Screen.AddEditGoal.createRoute()) },
                onEditGoal = { id -> navController.navigate(Screen.AddEditGoal.createRoute(id)) }
            )
        }

        composable(
            route = Screen.AddEditGoal.route,
            arguments = listOf(navArgument(Screen.AddEditGoal.ARG_ID) {
                type = NavType.LongType; defaultValue = -1L
            })
        ) { backStackEntry ->
            val id = backStackEntry.arguments?.getLong(Screen.AddEditGoal.ARG_ID) ?: -1L
            AddEditGoalScreen(viewModel = goalVm, goalId = id, onBack = { navController.popBackStack() })
        }

        composable(Screen.Settings.route) {
            SettingsScreen(isDarkMode = isDarkMode, onDarkModeToggle = onDarkModeToggle)
        }
    }
}

// Determine whether bottom nav should be visible on current route
fun shouldShowBottomBar(currentRoute: String?): Boolean {
    val bottomRoutes = setOf(
        Screen.Home.route, Screen.Income.route, Screen.Expenses.route,
        Screen.Wealth.route, Screen.Reports.route, Screen.Goals.route, Screen.Settings.route
    )
    return currentRoute in bottomRoutes
}

fun NavHostController.navigateSingleTop(route: String) {
    navigate(route) {
        popUpTo(graph.findStartDestination().id) { saveState = true }
        launchSingleTop = true
        restoreState = true
    }
}
