package ru.mikhail.lab3.services

import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.inject.Named
import jakarta.transaction.Transactional
import ru.mikhail.lab3.DotChecker.checkDot
import ru.mikhail.lab3.HibernateSessionFactory
import ru.mikhail.lab3.dto.RequestData
import ru.mikhail.lab3.dbobjects.Result
import ru.mikhail.lab3.dbobjects.ResultAnt
import ru.mikhail.lab3.dbobjects.ResultSpider
import ru.mikhail.lab3.repositories.ResultDAO
import java.sql.Timestamp
import java.time.LocalDateTime

@Named("resultServiceBean")
@ApplicationScoped
open class ResultService{

    companion object {
        private const val MIN_EXECUTION_TIME_NS = 1L
    }

    @Inject
    private lateinit var resultDAO: ResultDAO

    @Transactional
    open fun findResult(id: Int): Result? {
        val session = HibernateSessionFactory.getSessionFactory().openSession()
        val result = resultDAO.findById(id, session)
        session.close()
        return result
    }

    open fun <T : Result> saveResult(result: T) {
        val session = HibernateSessionFactory.getSessionFactory().openSession()
        val tx = session.beginTransaction()
        resultDAO.save(result, session, tx)
        session.close()
    }

    open fun updateResult(result: Result) {
        val session = HibernateSessionFactory.getSessionFactory().openSession()
        val tx = session.beginTransaction()
        resultDAO.update(result, session, tx)
        session.close()
    }

    open fun deleteResult(result: Result) {
        val session = HibernateSessionFactory.getSessionFactory().openSession()
        val tx = session.beginTransaction()
        resultDAO.delete(result, session, tx)
        session.close()
    }

    open fun findAllResults(): List<Result> {
        val session = HibernateSessionFactory.getSessionFactory().openSession()
        val result = resultDAO.findAll(session)
        session.close()
        return result
    }

    open fun completeRequest(requestData: RequestData) {
        val result: Result = checkAndCalculatePoint(requestData)
        saveResult(result)

    }

    open fun checkAndCalculatePoint(requestData: RequestData): Result {
        val startTime = System.nanoTime()
        val result = checkDot(requestData.x, requestData.y, requestData.r)
        val endTime = System.nanoTime()
        val executionTime = maxOf(endTime - startTime, MIN_EXECUTION_TIME_NS)
        val now = Timestamp.valueOf(LocalDateTime.now())

        return when (requestData.entity) {
            "ResultSpider" -> ResultSpider(
                requestData.x, requestData.y, requestData.r, result, executionTime, now, requestData.logsQuantity
            )

            "ResultAnt" -> ResultAnt(
                requestData.x, requestData.y, requestData.r, result, executionTime, now, requestData.bodyColor
            )

            else -> throw IllegalArgumentException("Unsupported entity type: ${requestData.entity}")
        }
    }


}