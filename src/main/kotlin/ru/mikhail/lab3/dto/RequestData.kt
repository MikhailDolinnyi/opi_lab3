package ru.mikhail.lab3.dto

data class RequestData(
    val x: Float,
    val y: Float,
    val r: Float,
    val logsQuantity: Int,
    val bodyColor: String,
    val entity: String
)