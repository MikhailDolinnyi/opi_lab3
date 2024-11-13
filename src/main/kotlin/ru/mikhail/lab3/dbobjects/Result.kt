package ru.mikhail.lab3.dbobjects

import jakarta.persistence.*
import java.sql.Timestamp

@Entity
@Table(name = "results")
class Result(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int? = null,

    var x: Float = 0f,
    var y: Float = 0f,
    var r: Float = 0f,
    var result: Boolean = false,

    @Column(name = "execution_time")
    var executionTime: Long = 0,

    @Column(name = "now_time")
    var nowTime: Timestamp? = null
) {
    // Конструктор для создания экземпляра без id
    constructor(x: Float, y: Float, r: Float, result: Boolean, executionTime: Long, nowTime: Timestamp?) : this(
        id = null,
        x = x,
        y = y,
        r = r,
        result = result,
        executionTime = executionTime,
        nowTime = nowTime
    )

    // Hibernate требует публичный конструктор без аргументов
    constructor() : this(0f, 0f, 0f, false, 0, null)

    override fun toString(): String {
        return "Result(id=$id, x=$x, y=$y, r=$r, result=$result, executionTime=$executionTime, nowTime=$nowTime)"
    }
}
