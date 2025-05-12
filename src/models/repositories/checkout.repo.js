'use strict'

const { getSelectData } = require('../../utils')
const order = require('../Order.Model')

const getAllOrderByUser = async({sort,filter,select})=>{

    const sortBy = sort==='ctime'? { _id: -1 } : { _id: 1 }
    return await order.find(filter).
    sort(sortBy).
    select(getSelectData(select)).
    lean()
}

const getOneOrderByUser = async({filter,select})=>{
    return await order.findOne(filter).
    select(getSelectData(select)).
    lean()
}


module.exports={
    getAllOrderByUser,
    getOneOrderByUser
}