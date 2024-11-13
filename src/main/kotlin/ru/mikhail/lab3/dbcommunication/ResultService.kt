package ru.mikhail.lab3.dbcommunication

import ru.mikhail.lab3.dbobjects.Result

class ResultService {

    private val resultDAO = ResultDAOImpl()

    fun findResult(id : Int): Result?{
        return resultDAO.findById(id)
    }

    fun saveResult(result: Result){
        resultDAO.save(result)
    }

    fun updateResult(result: Result){
        resultDAO.update(result)
    }

    fun deleteResult(result: Result){
        resultDAO.delete(result)
    }

    fun findAllResults(): List<Result>{
        return resultDAO.findAll()
    }

}