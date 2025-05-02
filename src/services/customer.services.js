'use strict'

const CustomerModel = require("../models/Customer.Model")
const { findOne } = require("../models/Customer.Model")

const findByEmail = async({email,select={
    email:1,password:1,username:1,phone:1,address:1,joindate:1,roles:1
}})=>{
    return await CustomerModel.findOne({Email:email}).select(select).select('+Password').lean()
}

const findByUserId = async(userId)=>{
    return await CustomerModel.findOne({_id:userId}).lean()
}
module.exports={
    findByEmail,
    findByUserId
}