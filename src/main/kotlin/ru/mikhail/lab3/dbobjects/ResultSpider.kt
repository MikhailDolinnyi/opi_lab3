package ru.mikhail.lab3.dbobjects

import jakarta.persistence.*
import java.sql.Timestamp

@Entity
@Table(name = "result_spider")
open class ResultSpider(x: Float,
    y:Float,
    r:Float,
    result: Boolean,
    executionTime: Long,
    nowTime: Timestamp,

    @Column(name = "logs_quantity")
    open var logsQuantity:Int

): Result(x=x,y=y,r=r,result=result,executionTime=executionTime,nowTime=nowTime)


