'use strict'

const apiKeyModel = require("../models/apiKey.Model")
const crypto = require('crypto')
const findById = async(key) =>{
    // const newkey= await apiKeyModel.create({key:crypto.randomBytes(64).toString('hex'),permissions:['0000']})
    // console.log(newkey)
    const objKey = await apiKeyModel.findOne({key,status:true}).lean()
    return objKey
}

module.exports ={
    findById
}