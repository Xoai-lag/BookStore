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
}

module.exports = new CheckoutController()