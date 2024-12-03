package ru.mikhail.lab3.dbobjects

import jakarta.persistence.*
import java.sql.Timestamp

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
abstract class Result(

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    open val id: Int? = null,

    open var x: Float,
    open var y: Float,
    open var r: Float,
    open var result: Boolean,

    @Column(name = "execution_time")
    open var executionTime: Long,

    @Column(name = "now_time")
    open var nowTime: Timestamp
)
