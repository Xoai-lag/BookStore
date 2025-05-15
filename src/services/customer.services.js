'use strict'

const CustomerModel = require("../models/Customer.Model")
const { findOne } = require("../models/Customer.Model")

const findByEmail = async({Email,select={
    Email:1,password:1,UserName:1,phone:1,address:1,joindate:1,roles:1
}})=>{
    return await CustomerModel.findOne({Email:Email}).select(select).select('+Password').lean()
}

const findByUserId = async(userId)=>{
    return await CustomerModel.findOne({_id:userId}).lean()
}
module.exports={
    findByEmail,
    findByUserId
}