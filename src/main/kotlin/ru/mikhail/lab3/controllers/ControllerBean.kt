package ru.mikhail.lab3.controllers

import jakarta.annotation.ManagedBean
import jakarta.enterprise.context.SessionScoped
import jakarta.inject.Inject
import jakarta.inject.Named
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotNull
import ru.mikhail.lab3.dto.RequestData
import ru.mikhail.lab3.dto.ResponseData
import ru.mikhail.lab3.DataMapper
import ru.mikhail.lab3.services.ResultService
import java.io.Serializable
import kotlin.random.Random

@Named("controllerBean")
@SessionScoped
@ManagedBean
open class ControllerBean : IControllerBean, Serializable { // Реализуем интерфейс
    @NotNull
    @field:Max(2)
    @field:Min(-2)
    override var x: Float = 0f

    @NotNull
    @field:Max(3)
    @field:Min(-5)
    override var y: Float = 0f

    @NotNull
    @field:Max(3)
    @field:Min(1)
    override var r: Float = 0f

    override var logsQuantity: Int = Random.Default.nextInt()
    override var bodyColor: String = Random.Default.nextInt().toString()

    @NotNull
    override var entity: String = ""


    @Inject
    private lateinit var resultService: ResultService

    @Inject
    private lateinit var dataMapper: DataMapper


    override fun completeRequest() {

        resultService.completeRequest(RequestData(x, y, r, logsQuantity, bodyColor, entity))
    }

    override fun getResultList(): List<ResponseData> {
        return dataMapper.getDataList(resultService.findAllResults())

    }
}
