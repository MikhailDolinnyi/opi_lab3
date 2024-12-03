package ru.mikhail.lab3.controllers

import ru.mikhail.lab3.dbobjects.Result

interface IDotCheckerBean {
    fun <T:Result> checkAndCalculatePoint(entity: String?): T
}
