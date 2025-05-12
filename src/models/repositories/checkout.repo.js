'use strict'

const { options } = require('../../routers/checkout')
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

const findOrderById = async ({orderId,userId})=>{
    return await order.findOne({
        _id:orderId,
        order_userId:userId
    }).lean()
}

const updateOrder = async ({query,updateSet,options})=>{
    return await order.updateOne(query,updateSet,options)
}

module.exports={
    getAllOrderByUser,
    getOneOrderByUser,
    findOrderById,
    updateOrder
}