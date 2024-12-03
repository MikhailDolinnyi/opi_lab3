package ru.mikhail.lab3.dbobjects

import jakarta.persistence.*
import java.sql.Timestamp

@Entity
@Table(name = "result_ant")
open class ResultAnt(
    x: Float,
    y: Float,
    r: Float,
    result: Boolean,
    executionTime: Long,
    nowTime: Timestamp,

    @Column(name = "body_color")
    open var bodyColor: String

) : Result(x = x, y = y, r = r, result = result, executionTime = executionTime, nowTime = nowTime)


