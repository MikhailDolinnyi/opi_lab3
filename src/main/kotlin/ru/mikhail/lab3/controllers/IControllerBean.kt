package ru.mikhail.lab3.controllers

import ru.mikhail.lab3.ResponseData
import kotlin.random.Random

interface IControllerBean {
    var x: Float
    var y: Float
    var r: Float
    var logsQuantity: Int
    var bodyColor: String
    var entity: String
    fun completeRequest()
    fun getResultList(): List<ResponseData>
}
