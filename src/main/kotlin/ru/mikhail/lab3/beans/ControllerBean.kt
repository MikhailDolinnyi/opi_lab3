package ru.mikhail.lab3.beans

import jakarta.enterprise.context.SessionScoped
import jakarta.inject.Inject
import jakarta.inject.Named
import ru.mikhail.lab3.dbcommunication.ResultService
import ru.mikhail.lab3.dbobjects.Result
import java.io.Serializable

@Named("controllerBean")
@SessionScoped
open class ControllerBean : IControllerBean, Serializable { // Реализуем интерфейс

    override var x: Float = 0f
    override var y: Float = 0f
    override var r: Float = 0f

    private val resultServiceKt = ResultService()

    @Inject
    private lateinit var _dotCheckerBean: IDotCheckerBean // Инжектируем интерфейс

    override fun completeRequest() {
        resultServiceKt.saveResult(_dotCheckerBean.checkAndCalculatePoint())
    }

    override fun getResultList(): List<Result> {
        return resultServiceKt.findAllResults()
    }
}
