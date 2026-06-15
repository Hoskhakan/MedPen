package com.wealthdailytracker.data.repository

import com.wealthdailytracker.data.database.dao.CategoryTotal
import com.wealthdailytracker.data.database.dao.ExpenseDao
import com.wealthdailytracker.data.database.entity.ExpenseEntity
import kotlinx.coroutines.flow.Flow

class ExpenseRepository(private val dao: ExpenseDao) {

    fun getAllExpenses(): Flow<List<ExpenseEntity>> = dao.getAllExpenses()

    fun getExpensesForDay(dayStart: Long, dayEnd: Long): Flow<List<ExpenseEntity>> =
        dao.getExpensesForDay(dayStart, dayEnd)

    fun getExpensesForMonth(year: String, month: String): Flow<List<ExpenseEntity>> =
        dao.getExpensesForMonth(year, month)

    fun getTotalForDay(dayStart: Long, dayEnd: Long): Flow<Double> =
        dao.getTotalForDay(dayStart, dayEnd)

    fun getTotalForMonth(year: String, month: String): Flow<Double> =
        dao.getTotalForMonth(year, month)

    fun getExpensesByCategory(category: String): Flow<List<ExpenseEntity>> =
        dao.getExpensesByCategory(category)

    fun getCategoryTotalsForMonth(year: String, month: String): Flow<List<CategoryTotal>> =
        dao.getCategoryTotalsForMonth(year, month)

    suspend fun getTotalForYearMonth(yearMonth: String): Double =
        dao.getTotalForYearMonth(yearMonth)

    suspend fun insert(expense: ExpenseEntity): Long = dao.insert(expense)

    suspend fun update(expense: ExpenseEntity) = dao.update(expense)

    suspend fun delete(expense: ExpenseEntity) = dao.delete(expense)

    suspend fun getById(id: Long): ExpenseEntity? = dao.getById(id)
}
