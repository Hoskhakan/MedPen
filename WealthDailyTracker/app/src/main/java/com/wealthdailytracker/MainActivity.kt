package com.wealthdailytracker

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.wealthdailytracker.navigation.*
import com.wealthdailytracker.ui.theme.WealthDailyTrackerTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val container = (application as WealthApplication).container

        setContent {
            var isDarkMode by remember { mutableStateOf(false) }

            WealthDailyTrackerTheme(darkTheme = isDarkMode) {
                val navController = rememberNavController()
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentRoute = navBackStackEntry?.destination?.route

                Scaffold(
                    bottomBar = {
                        if (shouldShowBottomBar(currentRoute)) {
                            WealthBottomNavBar(
                                currentRoute = currentRoute,
                                onNavItemClick = { screen ->
                                    navController.navigateSingleTop(screen.route)
                                }
                            )
                        }
                    }
                ) { innerPadding ->
                    WealthNavGraph(
                        navController = navController,
                        container = container,
                        isDarkMode = isDarkMode,
                        onDarkModeToggle = { isDarkMode = it },
                        modifier = Modifier.padding(innerPadding)
                    )
                }
            }
        }
    }
}

@Composable
fun WealthBottomNavBar(
    currentRoute: String?,
    onNavItemClick: (Screen) -> Unit
) {
    NavigationBar {
        bottomNavItems.forEach { item ->
            NavigationBarItem(
                selected = currentRoute == item.screen.route,
                onClick = { onNavItemClick(item.screen) },
                icon = { Icon(item.icon, contentDescription = item.label) },
                label = { Text(item.label) }
            )
        }
    }
}
