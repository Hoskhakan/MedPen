package com.wealthdailytracker.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext

private val LightColorScheme = lightColorScheme(
    primary = Green,
    onPrimary = White,
    primaryContainer = GreenContainer,
    onPrimaryContainer = NavyDark,
    secondary = NavyDark,
    onSecondary = White,
    secondaryContainer = NavyMedium,
    onSecondaryContainer = White,
    background = BackgroundLight,
    onBackground = TextPrimary,
    surface = White,
    onSurface = TextPrimary,
    surfaceVariant = BackgroundLight,
    onSurfaceVariant = TextSecondary,
    error = ErrorRed,
    onError = White,
    errorContainer = ErrorRedLight,
    onErrorContainer = ErrorRed,
    outline = DividerColor
)

private val DarkColorScheme = darkColorScheme(
    primary = Green,
    onPrimary = NavyDark,
    primaryContainer = NavyMedium,
    onPrimaryContainer = GreenLight,
    secondary = GreenLight,
    onSecondary = NavyDark,
    background = Color(0xFF0D1117),
    onBackground = White,
    surface = Color(0xFF161B22),
    onSurface = White,
    surfaceVariant = Color(0xFF21262D),
    onSurfaceVariant = Color(0xFFADB5BD),
    error = ErrorRed,
    onError = White,
    errorContainer = Color(0xFF4A0E0E),
    onErrorContainer = ErrorRedLight
)

@Composable
fun WealthDailyTrackerTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = false,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
