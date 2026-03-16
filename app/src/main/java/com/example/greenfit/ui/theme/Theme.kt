package com.example.greenfit.ui.theme

import android.app.Activity
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

private val DarkColorScheme = darkColorScheme(
    primary = PrimaryGreen,
    secondary = Slate100,
    tertiary = Slate300,
    background = BackgroundDark,
    surface = BackgroundDark,
    onPrimary = BackgroundDark,
    onSecondary = BackgroundDark,
    onTertiary = BackgroundDark,
    onBackground = Slate100,
    onSurface = Slate100,
)

private val LightColorScheme = lightColorScheme(
    primary = PrimaryGreen,
    secondary = Slate900,
    tertiary = Slate700,
    background = BackgroundLight,
    surface = BackgroundLight,
    onPrimary = BackgroundDark, // Text on primary button is dark
    onSecondary = BackgroundLight,
    onTertiary = BackgroundLight,
    onBackground = Slate900,
    onSurface = Slate900,
)

@Composable
fun GreenFitTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    // Dynamic color is available on Android 12+
    dynamicColor: Boolean = false, // Changed default to false to prioritize custom design
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
