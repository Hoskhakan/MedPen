package com.wealthdailytracker.data.database

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.wealthdailytracker.data.database.dao.*
import com.wealthdailytracker.data.database.entity.*

@Database(
    entities = [
        IncomeEntity::class,
        ExpenseEntity::class,
        AssetEntity::class,
        LiabilityEntity::class,
        GoalEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class WealthDatabase : RoomDatabase() {

    abstract fun incomeDao(): IncomeDao
    abstract fun expenseDao(): ExpenseDao
    abstract fun assetDao(): AssetDao
    abstract fun liabilityDao(): LiabilityDao
    abstract fun goalDao(): GoalDao

    companion object {
        @Volatile
        private var INSTANCE: WealthDatabase? = null

        fun getInstance(context: Context): WealthDatabase {
            return INSTANCE ?: synchronized(this) {
                Room.databaseBuilder(
                    context.applicationContext,
                    WealthDatabase::class.java,
                    "wealth_database"
                ).build().also { INSTANCE = it }
            }
        }
    }
}
