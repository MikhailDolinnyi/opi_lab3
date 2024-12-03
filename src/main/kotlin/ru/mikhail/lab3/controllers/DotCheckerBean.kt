package ru.mikhail.lab3.controllers

import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.inject.Named
import ru.mikhail.lab3.DotChecker.checkDot
import ru.mikhail.lab3.dbobjects.Result
import ru.mikhail.lab3.dbobjects.ResultAnt
import ru.mikhail.lab3.dbobjects.ResultSpider
import java.sql.Timestamp
import java.time.LocalDateTime

@Named("dotCheckerBean")
@ApplicationScoped
open class DotCheckerBean : IDotCheckerBean { // Реализуем интерфейс

    companion object {
        private const val MIN_EXECUTION_TIME_NS = 1L
    }

    @Inject
    private lateinit var controllerBean: IControllerBean // Инжектируем интерфейс

    override fun checkAndCalculatePoint(entity: String?): Any {
        val startTime = System.nanoTime()
        val result = checkDot(controllerBean.x, controllerBean.y, controllerBean.r)
        val endTime = System.nanoTime()
        val executionTime = maxOf(endTime - startTime, MIN_EXECUTION_TIME_NS)
        val now = Timestamp.valueOf(LocalDateTime.now())

        return if(entity == "ResultSpider"){
            ResultSpider(controllerBean.x, controllerBean.y, controllerBean.r, result, executionTime, now, controllerBean.logsQuantity)
        }else{
            ResultAnt(controllerBean.x, controllerBean.y, controllerBean.r, result, executionTime, now, controllerBean.bodyColor)
        }

    }
}
