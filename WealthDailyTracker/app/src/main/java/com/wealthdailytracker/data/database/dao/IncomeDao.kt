package com.wealthdailytracker.data.database.dao

import androidx.room.*
import com.wealthdailytracker.data.database.entity.IncomeEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface IncomeDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(income: IncomeEntity): Long

    @Update
    suspend fun update(income: IncomeEntity)

    @Delete
    suspend fun delete(income: IncomeEntity)

    @Query("SELECT * FROM income ORDER BY date DESC, createdAt DESC")
    fun getAllIncome(): Flow<List<IncomeEntity>>

    @Query("SELECT * FROM income WHERE id = :id")
    suspend fun getById(id: Long): IncomeEntity?

    // Records for a specific day (start/end of day epoch ms)
    @Query("SELECT * FROM income WHERE date >= :dayStart AND date <= :dayEnd ORDER BY createdAt DESC")
    fun getIncomeForDay(dayStart: Long, dayEnd: Long): Flow<List<IncomeEntity>>

    // Records for a month, e.g. year=2025, month=1..12
    @Query("""
        SELECT * FROM income
        WHERE strftime('%Y', datetime(date/1000, 'unixepoch')) = :year
        AND strftime('%m', datetime(date/1000, 'unixepoch')) = :month
        ORDER BY date DESC
    """)
    fun getIncomeForMonth(year: String, month: String): Flow<List<IncomeEntity>>

    @Query("""
        SELECT COALESCE(SUM(amount), 0) FROM income
        WHERE date >= :dayStart AND date <= :dayEnd
    """)
    fun getTotalForDay(dayStart: Long, dayEnd: Long): Flow<Double>

    @Query("""
        SELECT COALESCE(SUM(amount), 0) FROM income
        WHERE strftime('%Y', datetime(date/1000, 'unixepoch')) = :year
        AND strftime('%m', datetime(date/1000, 'unixepoch')) = :month
    """)
    fun getTotalForMonth(year: String, month: String): Flow<Double>

    @Query("""
        SELECT COALESCE(SUM(amount), 0) FROM income
        WHERE strftime('%Y', datetime(date/1000, 'unixepoch')) = :year
    """)
    fun getTotalForYear(year: String): Flow<Double>

    @Query("SELECT * FROM income WHERE category = :category ORDER BY date DESC")
    fun getIncomeByCategory(category: String): Flow<List<IncomeEntity>>

    // Monthly totals for the last N months – used by charts
    @Query("""
        SELECT COALESCE(SUM(amount), 0) FROM income
        WHERE strftime('%Y-%m', datetime(date/1000, 'unixepoch')) = :yearMonth
    """)
    suspend fun getTotalForYearMonth(yearMonth: String): Double
}
