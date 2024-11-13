package ru.mikhail.lab3.beans

import ru.mikhail.lab3.dbobjects.Result

interface IDotCheckerBean {
    fun checkAndCalculatePoint(): Result
}
