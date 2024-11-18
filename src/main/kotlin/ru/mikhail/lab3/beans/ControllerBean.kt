package ru.mikhail.lab3.beans

import jakarta.annotation.ManagedBean
import jakarta.enterprise.context.SessionScoped
import jakarta.inject.Inject
import jakarta.inject.Named
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotNull
import ru.mikhail.lab3.dbcommunication.ResultService
import ru.mikhail.lab3.dbobjects.Result
import java.io.Serializable

@Named("controllerBean")
@SessionScoped
@ManagedBean
open class ControllerBean : IControllerBean, Serializable { // Реализуем интерфейс

    override var x: Float = 0f
    @NotNull @field:Max(2) @field:Min(-2)
    override var y: Float = 0f
    @NotNull @field:Max(3) @field:Min(-5)
    override var r: Float = 0f
    @NotNull @field:Max(3) @field:Min(1)

    private val resultService = ResultService()

    @Inject
    private lateinit var _dotCheckerBean: IDotCheckerBean // Инжектируем интерфейс

    override fun completeRequest() {
        resultService.saveResult(_dotCheckerBean.checkAndCalculatePoint())
    }

    override fun getResultList(): List<Result> {
        return resultService.findAllResults()
    }
}
