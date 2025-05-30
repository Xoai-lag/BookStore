'use strict'


const { Created, SuccessResponse } = require("../core/success.response")
const CheckoutService = require("../services/checkout.services")

class CheckoutController{
    checkoutReview = async(req,res,next)=>{
        new SuccessResponse({
            message:'Get Checkout Success!',
            metadata: await CheckoutService.checkoutReview(req.body)
        }).send(res)
    }

    orderByUser = async(req,res,next)=>{
        new SuccessResponse({
            message:'Order Cart Success!',
            metadata: await CheckoutService.orderByUser(req.body)
        }).send(res)
    }

    getOrdersByUser= async(req,res,next)=>{
        new SuccessResponse({
            message:'Get List Order Of User Success!',
            metadata: await CheckoutService.getOrdersByUser(req.body)
        }).send(res)
    }
    getOneOrdersByUser= async(req,res,next)=>{
        new SuccessResponse({
            message:'Get Order Of User Success!',
            metadata: await CheckoutService.getOneOrderByUser({
                orderId:req.params.orderId,
                userId:req.body.userId})
        }).send(res)
    } 
    cancelOrderByUser = async(req,res,next)=>{
        new SuccessResponse({
            message:'Cancel Order By User Success!',
            metadata: await CheckoutService.cancelOrderByUser({
                orderId:req.params.orderId,
                userId:req.body.userId})
        }).send(res)
    }
    updateStatusOrderByAdmin = async(req,res,next)=>{
        const {orderId, targetStatus}=req.body
        new SuccessResponse({
            message:'Update Status Order Success!',
            metadata: await CheckoutService.updateOrderStatusByAdmin(orderId, targetStatus)
        }).send(res)
    }
}

module.exports = new CheckoutController()