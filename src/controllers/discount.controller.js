'use strict'

const DiscountServices = require('../services/discount.services')
const { SuccessResponse } = require('../core/success.response')


class DiscountController {

    createDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new DiscountCode Success',
            metadata: await DiscountServices.createDiscountCode(req.body)
        }).send(res)
    }

    updateDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update DiscountCode Success',
            metadata: await DiscountServices.updateDiscount({
                discountId: req.params.discountId,
                body: req.body
            })
        }).send(res)
    }

    getAllDiscountsByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get All DiscountCode Success',
            metadata: await DiscountServices.getAllDiscountCodesByShop({
                ...req.query
            })
        }).send(res)
    }
    getAllDiscountCodesWithProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get All DiscountCode Success',
            metadata: await DiscountServices.getAllDiscountCodesWithProduct({
              ...req.query
            })
        }).send(res)
    }

    getDiscountAmount = async(req,res,next)=>{
        new SuccessResponse({
            message: 'Get DiscountCode Amount Success',
            metadata: await DiscountServices.getDiscountAmount({
                ...req.body
            })
        }).send(res)
    }

}

module.exports = new DiscountController()