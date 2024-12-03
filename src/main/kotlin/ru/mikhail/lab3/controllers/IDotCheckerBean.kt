package ru.mikhail.lab3.controllers

import ru.mikhail.lab3.dbobjects.Result

interface IDotCheckerBean {
    fun checkAndCalculatePoint(entity: String?): Any
}
