package com.wealthdailytracker.data.repository

import com.wealthdailytracker.data.database.dao.IncomeDao
import com.wealthdailytracker.data.database.entity.IncomeEntity
import kotlinx.coroutines.flow.Flow

class IncomeRepository(private val dao: IncomeDao) {

    fun getAllIncome(): Flow<List<IncomeEntity>> = dao.getAllIncome()

    fun getIncomeForDay(dayStart: Long, dayEnd: Long): Flow<List<IncomeEntity>> =
        dao.getIncomeForDay(dayStart, dayEnd)

    fun getIncomeForMonth(year: String, month: String): Flow<List<IncomeEntity>> =
        dao.getIncomeForMonth(year, month)

    fun getTotalForDay(dayStart: Long, dayEnd: Long): Flow<Double> =
        dao.getTotalForDay(dayStart, dayEnd)

    fun getTotalForMonth(year: String, month: String): Flow<Double> =
        dao.getTotalForMonth(year, month)

    fun getIncomeByCategory(category: String): Flow<List<IncomeEntity>> =
        dao.getIncomeByCategory(category)

    suspend fun getTotalForYearMonth(yearMonth: String): Double =
        dao.getTotalForYearMonth(yearMonth)

    suspend fun insert(income: IncomeEntity): Long = dao.insert(income)

    suspend fun update(income: IncomeEntity) = dao.update(income)

    suspend fun delete(income: IncomeEntity) = dao.delete(income)

    suspend fun getById(id: Long): IncomeEntity? = dao.getById(id)
}
