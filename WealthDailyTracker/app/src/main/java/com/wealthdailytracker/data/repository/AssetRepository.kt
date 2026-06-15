package com.wealthdailytracker.data.repository

import com.wealthdailytracker.data.database.dao.AssetDao
import com.wealthdailytracker.data.database.entity.AssetEntity
import kotlinx.coroutines.flow.Flow

class AssetRepository(private val dao: AssetDao) {

    fun getAllAssets(): Flow<List<AssetEntity>> = dao.getAllAssets()

    fun getTotalAssets(): Flow<Double> = dao.getTotalAssets()

    fun getAssetsByType(type: String): Flow<List<AssetEntity>> = dao.getAssetsByType(type)

    suspend fun insert(asset: AssetEntity): Long = dao.insert(asset)

    suspend fun update(asset: AssetEntity) = dao.update(asset)

    suspend fun delete(asset: AssetEntity) = dao.delete(asset)

    suspend fun getById(id: Long): AssetEntity? = dao.getById(id)
}
