package com.wealthdailytracker.data.repository

import com.wealthdailytracker.data.database.dao.LiabilityDao
import com.wealthdailytracker.data.database.entity.LiabilityEntity
import kotlinx.coroutines.flow.Flow

class LiabilityRepository(private val dao: LiabilityDao) {

    fun getAllLiabilities(): Flow<List<LiabilityEntity>> = dao.getAllLiabilities()

    fun getTotalLiabilities(): Flow<Double> = dao.getTotalLiabilities()

    fun getUpcomingDuePayments(now: Long, thirtyDaysLater: Long): Flow<List<LiabilityEntity>> =
        dao.getUpcomingDuePayments(now, thirtyDaysLater)

    suspend fun insert(liability: LiabilityEntity): Long = dao.insert(liability)

    suspend fun update(liability: LiabilityEntity) = dao.update(liability)

    suspend fun delete(liability: LiabilityEntity) = dao.delete(liability)

    suspend fun getById(id: Long): LiabilityEntity? = dao.getById(id)
}
