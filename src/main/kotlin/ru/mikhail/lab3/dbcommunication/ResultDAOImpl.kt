package ru.mikhail.lab3.dbcommunication

import ru.mikhail.lab3.dbobjects.Result

class ResultDAOImpl : ResultDAO {
    override fun findById(id: Int): Result? {
        HibernateSessionFactory.getSessionFactory().openSession().use { session -> return session.get(Result::class.java, id) }
    }

    override fun save(result: Result) {
        val session = HibernateSessionFactory.getSessionFactory().openSession()
        val tx = session.beginTransaction()
        session.persist(result)
        tx.commit()
        session.close()
    }

    override fun update(result: Result) {
        val session = HibernateSessionFactory.getSessionFactory().openSession()
        val tx = session.beginTransaction()
        session.merge(result)
        tx.commit()
        session.close()
    }

    override fun delete(result: Result) {
        val session = HibernateSessionFactory.getSessionFactory().openSession()
        val tx = session.beginTransaction()
        session.remove(result)
        tx.commit()
        session.close()
    }

    override fun findAll(): List<Result> {
        val session = HibernateSessionFactory.getSessionFactory().openSession()
        return session.createQuery("from Result", Result::class.java).list()
    }


}