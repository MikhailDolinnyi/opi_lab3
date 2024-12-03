package ru.mikhail.lab3.services

import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.inject.Named
import jakarta.transaction.Transactional
import ru.mikhail.lab3.HibernateSessionFactory
import ru.mikhail.lab3.dbobjects.Result
import ru.mikhail.lab3.repositories.ResultDAO

@Named("resultServiceBean")
@ApplicationScoped
open class ResultService{

    @Inject
    private lateinit var resultDAO: ResultDAO

    @Transactional
    open fun findResult(id: Int): Result? {
        val session = HibernateSessionFactory.getSessionFactory().openSession()
        val result = resultDAO.findById(id, session)
        session.close()
        return result
    }

    open fun <T:Result> saveResult(result: T) {
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

}