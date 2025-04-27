'use strict'

const HEADER={
    API_KEY : 'x-api-key',
    AUTHORIZATION:'authorization'
}

const { BadRequestError } = require('../core/error.response')
const { findById }=require('../services/apiKey.services')
const apiKey = async(req,res,next)=>{
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        if(!key){
            throw new BadRequestError('Error: Forbidden Error!')
        }

        //check objKey
        const objKey =await findById(key)
        if(!objKey){
            throw new BadRequestError('Error: Forbidden Error!')
        }
        req.objKey = objKey
        return next()
    } catch (error) {
        return next(error)
    }
}

const permission = (permission)=>{
    return (req,res,next)=>{
        if(!req.objKey.permissions){
            throw new BadRequestError('Error: Permission Dinied!')
        }
        console.log('permissions::',req.objKey.permissions)
        const validPermission = req.objKey.permissions.includes(permission)
        if(!validPermission){
            throw new BadRequestError('Error: Permission Dinied!')
        }
        return next()
    }
}

module.exports={
    apiKey,
    permission,
}