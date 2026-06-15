package com.wealthdailytracker.data.database.dao

import androidx.room.*
import com.wealthdailytracker.data.database.entity.LiabilityEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface LiabilityDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(liability: LiabilityEntity): Long

    @Update
    suspend fun update(liability: LiabilityEntity)

    @Delete
    suspend fun delete(liability: LiabilityEntity)

    @Query("SELECT * FROM liability ORDER BY dueDate ASC NULLS LAST, name ASC")
    fun getAllLiabilities(): Flow<List<LiabilityEntity>>

    @Query("SELECT * FROM liability WHERE id = :id")
    suspend fun getById(id: Long): LiabilityEntity?

    @Query("SELECT COALESCE(SUM(remainingAmount), 0) FROM liability")
    fun getTotalLiabilities(): Flow<Double>

    // Liabilities due within the next 30 days
    @Query("""
        SELECT * FROM liability
        WHERE dueDate IS NOT NULL
        AND dueDate >= :now
        AND dueDate <= :thirtyDaysLater
        ORDER BY dueDate ASC
    """)
    fun getUpcomingDuePayments(now: Long, thirtyDaysLater: Long): Flow<List<LiabilityEntity>>
}
