package com.wealthdailytracker.data.repository

import com.wealthdailytracker.data.database.dao.GoalDao
import com.wealthdailytracker.data.database.entity.GoalEntity
import kotlinx.coroutines.flow.Flow

class GoalRepository(private val dao: GoalDao) {

    fun getAllGoals(): Flow<List<GoalEntity>> = dao.getAllGoals()

    suspend fun insert(goal: GoalEntity): Long = dao.insert(goal)

    suspend fun update(goal: GoalEntity) = dao.update(goal)

    suspend fun delete(goal: GoalEntity) = dao.delete(goal)

    suspend fun getById(id: Long): GoalEntity? = dao.getById(id)
}
