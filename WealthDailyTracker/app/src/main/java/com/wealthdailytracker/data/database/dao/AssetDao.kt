package com.wealthdailytracker.data.database.dao

import androidx.room.*
import com.wealthdailytracker.data.database.entity.AssetEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface AssetDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(asset: AssetEntity): Long

    @Update
    suspend fun update(asset: AssetEntity)

    @Delete
    suspend fun delete(asset: AssetEntity)

    @Query("SELECT * FROM asset ORDER BY type ASC, name ASC")
    fun getAllAssets(): Flow<List<AssetEntity>>

    @Query("SELECT * FROM asset WHERE id = :id")
    suspend fun getById(id: Long): AssetEntity?

    @Query("SELECT COALESCE(SUM(currentValue), 0) FROM asset")
    fun getTotalAssets(): Flow<Double>

    @Query("SELECT * FROM asset WHERE type = :type ORDER BY name ASC")
    fun getAssetsByType(type: String): Flow<List<AssetEntity>>
}
