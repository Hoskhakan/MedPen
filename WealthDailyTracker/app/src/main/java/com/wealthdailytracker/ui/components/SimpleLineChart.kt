package com.wealthdailytracker.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.*
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlin.math.abs

/**
 * A minimal canvas-based line chart for displaying monthly net balance trend.
 * No external library needed.
 */
@Composable
fun SimpleLineChart(
    data: List<Pair<String, Double>>,
    modifier: Modifier = Modifier,
    lineColor: Color = MaterialTheme.colorScheme.primary,
    positiveColor: Color = Color(0xFF1FA67A),
    negativeColor: Color = Color(0xFFD9534F),
    gridColor: Color = Color.LightGray.copy(alpha = 0.4f)
) {
    if (data.isEmpty()) return

    val values = data.map { it.second.toFloat() }
    val labels = data.map { it.first }
    val maxVal = (values.maxOrNull() ?: 1f).coerceAtLeast(1f)
    val minVal = (values.minOrNull() ?: 0f).coerceAtMost(0f)
    val range = (maxVal - minVal).coerceAtLeast(1f)

    Column(modifier = modifier) {
        Canvas(
            modifier = Modifier
                .fillMaxWidth()
                .height(120.dp)
        ) {
            val w = size.width
            val h = size.height
            val padding = 16.dp.toPx()
            val chartW = w - padding * 2
            val chartH = h - padding * 2

            // Draw horizontal grid lines
            for (i in 0..3) {
                val y = padding + (chartH / 3) * i
                drawLine(gridColor, Offset(padding, y), Offset(w - padding, y), strokeWidth = 1f)
            }

            // Draw zero line if range includes both positive and negative
            if (minVal < 0 && maxVal > 0) {
                val zeroY = padding + chartH * (maxVal / range)
                drawLine(
                    Color.Gray.copy(alpha = 0.6f),
                    Offset(padding, zeroY), Offset(w - padding, zeroY),
                    strokeWidth = 1.5f
                )
            }

            // Build path
            val path = Path()
            val points = values.mapIndexed { i, v ->
                val x = padding + (chartW / (values.size - 1).coerceAtLeast(1)) * i
                val y = padding + chartH * ((maxVal - v) / range)
                Offset(x, y)
            }
            if (points.isNotEmpty()) {
                path.moveTo(points[0].x, points[0].y)
                for (i in 1 until points.size) {
                    val ctrl1 = Offset((points[i - 1].x + points[i].x) / 2, points[i - 1].y)
                    val ctrl2 = Offset((points[i - 1].x + points[i].x) / 2, points[i].y)
                    path.cubicTo(ctrl1.x, ctrl1.y, ctrl2.x, ctrl2.y, points[i].x, points[i].y)
                }
            }
            drawPath(path, lineColor, style = Stroke(width = 2.5.dp.toPx(), cap = StrokeCap.Round))

            // Draw dots at data points
            points.forEachIndexed { i, offset ->
                val dotColor = if (values[i] >= 0) positiveColor else negativeColor
                drawCircle(dotColor, 4.dp.toPx(), offset)
                drawCircle(Color.White, 2.dp.toPx(), offset)
            }
        }

        // Labels row
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            labels.forEach { label ->
                Text(label, fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
    }
}

/**
 * Simple bar chart for comparing two data series (income vs expenses).
 */
@Composable
fun SimpleBarChart(
    incomes: List<Double>,
    expenses: List<Double>,
    labels: List<String>,
    modifier: Modifier = Modifier,
    incomeColor: Color = Color(0xFF1FA67A),
    expenseColor: Color = Color(0xFFD9534F)
) {
    if (incomes.isEmpty()) return
    val maxVal = (incomes + expenses).maxOrNull()?.toFloat()?.coerceAtLeast(1f) ?: 1f

    Column(modifier = modifier) {
        Canvas(
            modifier = Modifier
                .fillMaxWidth()
                .height(130.dp)
        ) {
            val w = size.width
            val h = size.height
            val topPad = 8.dp.toPx()
            val botPad = 8.dp.toPx()
            val chartH = h - topPad - botPad
            val n = incomes.size
            val groupW = w / n
            val barW = groupW * 0.3f

            for (i in incomes.indices) {
                val x = groupW * i + groupW / 2

                val incH = chartH * (incomes[i].toFloat() / maxVal)
                drawRect(
                    incomeColor,
                    topLeft = Offset(x - barW - 2, topPad + chartH - incH),
                    size = androidx.compose.ui.geometry.Size(barW, incH)
                )

                val expH = chartH * (expenses[i].toFloat() / maxVal)
                drawRect(
                    expenseColor,
                    topLeft = Offset(x + 2, topPad + chartH - expH),
                    size = androidx.compose.ui.geometry.Size(barW, expH)
                )
            }
        }

        Row(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 4.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            labels.forEach { label ->
                Text(label, fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
    }
}
