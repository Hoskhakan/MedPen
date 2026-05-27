package com.wealthdailytracker.data.database.dao

import androidx.room.*
import com.wealthdailytracker.data.database.entity.ExpenseEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface ExpenseDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(expense: ExpenseEntity): Long

    @Update
    suspend fun update(expense: ExpenseEntity)

    @Delete
    suspend fun delete(expense: ExpenseEntity)

    @Query("SELECT * FROM expense ORDER BY date DESC, createdAt DESC")
    fun getAllExpenses(): Flow<List<ExpenseEntity>>

    @Query("SELECT * FROM expense WHERE id = :id")
    suspend fun getById(id: Long): ExpenseEntity?

    @Query("SELECT * FROM expense WHERE date >= :dayStart AND date <= :dayEnd ORDER BY createdAt DESC")
    fun getExpensesForDay(dayStart: Long, dayEnd: Long): Flow<List<ExpenseEntity>>

    @Query("""
        SELECT * FROM expense
        WHERE strftime('%Y', datetime(date/1000, 'unixepoch')) = :year
        AND strftime('%m', datetime(date/1000, 'unixepoch')) = :month
        ORDER BY date DESC
    """)
    fun getExpensesForMonth(year: String, month: String): Flow<List<ExpenseEntity>>

    @Query("""
        SELECT COALESCE(SUM(amount), 0) FROM expense
        WHERE date >= :dayStart AND date <= :dayEnd
    """)
    fun getTotalForDay(dayStart: Long, dayEnd: Long): Flow<Double>

    @Query("""
        SELECT COALESCE(SUM(amount), 0) FROM expense
        WHERE strftime('%Y', datetime(date/1000, 'unixepoch')) = :year
        AND strftime('%m', datetime(date/1000, 'unixepoch')) = :month
    """)
    fun getTotalForMonth(year: String, month: String): Flow<Double>

    @Query("""
        SELECT COALESCE(SUM(amount), 0) FROM expense
        WHERE strftime('%Y', datetime(date/1000, 'unixepoch')) = :year
    """)
    fun getTotalForYear(year: String): Flow<Double>

    @Query("SELECT * FROM expense WHERE category = :category ORDER BY date DESC")
    fun getExpensesByCategory(category: String): Flow<List<ExpenseEntity>>

    // Category totals for a month – used in reports/charts
    @Query("""
        SELECT category, COALESCE(SUM(amount), 0) as total
        FROM expense
        WHERE strftime('%Y', datetime(date/1000, 'unixepoch')) = :year
        AND strftime('%m', datetime(date/1000, 'unixepoch')) = :month
        GROUP BY category
        ORDER BY total DESC
    """)
    fun getCategoryTotalsForMonth(year: String, month: String): Flow<List<CategoryTotal>>

    @Query("""
        SELECT COALESCE(SUM(amount), 0) FROM expense
        WHERE strftime('%Y-%m', datetime(date/1000, 'unixepoch')) = :yearMonth
    """)
    suspend fun getTotalForYearMonth(yearMonth: String): Double
}

data class CategoryTotal(val category: String, val total: Double)
