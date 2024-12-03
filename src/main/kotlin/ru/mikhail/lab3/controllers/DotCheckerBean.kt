package ru.mikhail.lab3.controllers

import jakarta.enterprise.context.ApplicationScoped
import jakarta.enterprise.context.SessionScoped
import jakarta.inject.Inject
import jakarta.inject.Named
import ru.mikhail.lab3.DotChecker.checkDot
import ru.mikhail.lab3.dbobjects.Result
import ru.mikhail.lab3.dbobjects.ResultAnt
import ru.mikhail.lab3.dbobjects.ResultSpider
import java.io.Serializable
import java.sql.Timestamp
import java.time.LocalDateTime

@Named("dotCheckerBean")
@SessionScoped
open class DotCheckerBean : IDotCheckerBean, Serializable { // Реализуем интерфейс

    companion object {
        private const val MIN_EXECUTION_TIME_NS = 1L
    }

    @Inject
    private lateinit var controllerBean: IControllerBean // Инжектируем интерфейс

    override fun <T : Result> checkAndCalculatePoint(entity: String?): T {
        requireNotNull(entity) { "Entity must not be null" }

        val startTime = System.nanoTime()
        val result = checkDot(controllerBean.x, controllerBean.y, controllerBean.r)
        val endTime = System.nanoTime()
        val executionTime = maxOf(endTime - startTime, MIN_EXECUTION_TIME_NS)
        val now = Timestamp.valueOf(LocalDateTime.now())

        return when (entity) {
            "ResultSpider" -> ResultSpider(
                controllerBean.x, controllerBean.y, controllerBean.r, result, executionTime, now, controllerBean.logsQuantity
            ) as T
            "ResultAnt" -> ResultAnt(
                controllerBean.x, controllerBean.y, controllerBean.r, result, executionTime, now, controllerBean.bodyColor
            ) as T
            else -> throw IllegalArgumentException("Unsupported entity type: $entity")
        }
    }
}
