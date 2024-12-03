package ru.mikhail.lab3.repositories

import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Named
import org.hibernate.HibernateException
import org.hibernate.Session
import org.hibernate.Transaction
import ru.mikhail.lab3.dbobjects.Result

@Named("resultDAOBean")
@ApplicationScoped
open class ResultDAO {

    open fun findById(id: Int, session: Session): Result? {
        return try {
            session.get(Result::class.java, id)
        } catch (e: HibernateException) {
            println(e.message)
            null
        }
    }

    open fun <T:Result> save(result: T, session: Session, tx: Transaction) {
        try {
            session.persist(result)
            tx.commit()
        } catch (e: HibernateException) {
            println(e.message)
            tx.rollback()
        }
    }

    open fun update(result: Result, session: Session, tx: Transaction) {
        try {
            session.merge(result)
            tx.commit()
        } catch (e: HibernateException) {
            println(e.message)
            tx.rollback()
        }

    }


    open fun delete(result: Result, session: Session, tx: Transaction) {
        try {
            session.remove(result)
            tx.commit()
        } catch (e: HibernateException) {
            println(e.message)
            tx.rollback()
        }
    }

    open fun findAll(session: Session): List<Result> {
        return try {
            session.createQuery("from Result", Result::class.java).list()
        } catch (e: HibernateException) {
            println(e.message)
            emptyList()
        }
    }


}