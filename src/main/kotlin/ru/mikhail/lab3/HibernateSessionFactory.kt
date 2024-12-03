package ru.mikhail.lab3

import jakarta.inject.Named
import jakarta.inject.Singleton
import org.hibernate.SessionFactory
import org.hibernate.boot.registry.StandardServiceRegistryBuilder
import org.hibernate.cfg.Configuration
import ru.mikhail.lab3.dbobjects.Result
import ru.mikhail.lab3.dbobjects.ResultAnt
import ru.mikhail.lab3.dbobjects.ResultSpider

@Named("hibernateSessionFactoryBean")
@Singleton
object HibernateSessionFactory{

    private var sessionFactory: SessionFactory? = null

    fun getSessionFactory(): SessionFactory {
        if (sessionFactory == null) {
            try {
                val configuration = Configuration().configure()
                configuration.addAnnotatedClass(Result::class.java)
                configuration.addAnnotatedClass(ResultAnt::class.java)
                configuration.addAnnotatedClass(ResultSpider::class.java)
                val builder = StandardServiceRegistryBuilder().applySettings(configuration.properties)
                sessionFactory = configuration.buildSessionFactory(builder.build())

            } catch (e: Exception) {
                println("Exception: $e")
            }

        }

        return sessionFactory!!
    }

}