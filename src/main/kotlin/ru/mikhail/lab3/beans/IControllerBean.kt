package ru.mikhail.lab3.beans

import ru.mikhail.lab3.dbobjects.Result

interface IControllerBean {
    var x: Float
    var y: Float
    var r: Float
    fun completeRequest()
    fun getResultList(): List<Result>
}
