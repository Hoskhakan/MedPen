package com.wealthdailytracker

import android.content.Context
import com.wealthdailytracker.data.database.WealthDatabase
import com.wealthdailytracker.data.repository.*

/**
 * Simple manual DI container. Holds all repositories as singletons.
 * ViewModels receive repositories via factory lambdas.
 */
class AppContainer(context: Context) {
    private val database = WealthDatabase.getInstance(context)

    val incomeRepository = IncomeRepository(database.incomeDao())
    val expenseRepository = ExpenseRepository(database.expenseDao())
    val assetRepository = AssetRepository(database.assetDao())
    val liabilityRepository = LiabilityRepository(database.liabilityDao())
    val goalRepository = GoalRepository(database.goalDao())
}
