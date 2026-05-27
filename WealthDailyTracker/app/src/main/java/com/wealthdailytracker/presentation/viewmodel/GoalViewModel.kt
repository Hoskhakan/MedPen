package com.wealthdailytracker.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.wealthdailytracker.data.database.entity.GoalEntity
import com.wealthdailytracker.data.repository.GoalRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class GoalUiState(
    val goals: List<GoalEntity> = emptyList()
)

class GoalViewModel(private val repository: GoalRepository) : ViewModel() {

    private val _uiState = MutableStateFlow(GoalUiState())
    val uiState: StateFlow<GoalUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            repository.getAllGoals().collect { goals ->
                _uiState.update { it.copy(goals = goals) }
            }
        }
    }

    fun addGoal(goal: GoalEntity) = viewModelScope.launch { repository.insert(goal) }
    fun updateGoal(goal: GoalEntity) = viewModelScope.launch { repository.update(goal) }
    fun deleteGoal(goal: GoalEntity) = viewModelScope.launch { repository.delete(goal) }

    companion object {
        fun factory(repository: GoalRepository): ViewModelProvider.Factory =
            object : ViewModelProvider.Factory {
                @Suppress("UNCHECKED_CAST")
                override fun <T : ViewModel> create(modelClass: Class<T>): T =
                    GoalViewModel(repository) as T
            }
    }
}
