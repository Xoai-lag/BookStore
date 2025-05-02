'use strict'

const { Created } = require("../core/success.response")
const AccessServices = require("../services/access.services")
const {SuccessResponse} = require('../core/success.response')

class AccessController{

    handlerRefreshToken = async(req,res,next)=>{
        new SuccessResponse({
            message: 'Get Tokens Success !',
            metadata: await AccessServices.handlerRefreshTokenV2({
                refreshToken:req.refreshToken,
                user:req.user,
                keyCustomer:req.keyCustomer
            })
        }).send(res)
    }

    logout = async(req,res,next)=>{
        new SuccessResponse({
            message: 'Logout Success',
            metadata: await AccessServices.logout(req.keyCustomer)
        }).send(res)
    }
    login = async(req,res,next)=>{
        new SuccessResponse({
            metadata: await AccessServices.login(req.body)
        }).send(res)
    }

    SignUp =async (req,res,next)=>{
       
        new Created({
            message:'Regiserted OK!',
            metadata:await AccessServices.SignUp(req.body)
        }).send(res)
    }
}

module.exports=new AccessController()