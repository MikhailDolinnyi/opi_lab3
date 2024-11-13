package ru.mikhail.lab3

object DotChecker {

    fun checkDot(x: Float, y: Float, r: Float): Boolean {
        return checkFirstQuarter(x, y, r) || checkSecondQuarter() ||
                checkThirdQuarter(x, y, r) || checkFourthQuarter(x, y, r)
    }

    private fun checkFirstQuarter(x: Float, y: Float, r: Float): Boolean {
        return if (x >= 0 && y >= 0) {
            // Треугольник со сторонами R/2
            y <= (-x + r / 2)
        } else {
            false
        }
    }

    private fun checkSecondQuarter(): Boolean {
        return false
    }

    private fun checkThirdQuarter(x: Float, y: Float, r: Float): Boolean {
        return if (x <= 0 && y <= 0) {
            // Квадрат
            x >= -r && y >= -r
        } else {
            false
        }
    }

    private fun checkFourthQuarter(x: Float, y: Float, r: Float): Boolean {
        return if (x >= 0 && y <= 0) {
            // Условие: x^2 + y^2 <= R^2
            x * x + y * y <= r * r
        } else {
            false
        }
    }
}
