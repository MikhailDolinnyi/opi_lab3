package ru.mikhail.lab3.dbcommunication

import ru.mikhail.lab3.dbobjects.Result

interface ResultDAO {
    fun findById(id : Int): Result?
    fun save(result: Result)
    fun update(result: Result)
    fun delete(result: Result)
    fun findAll():List<Result>
}