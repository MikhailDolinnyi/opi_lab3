package ru.mikhail.lab3.services

import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Named
import ru.mikhail.lab3.ResponseData
import ru.mikhail.lab3.dbobjects.Result

@Named("dataService")
@ApplicationScoped
open class DataService {

    open fun getDataList(result: List<Result>): List<ResponseData>{
        return result.map{ item ->
            ResponseData(item.x, item.y, item.r, item.result, item.executionTime, item.nowTime)
        }
    }
}