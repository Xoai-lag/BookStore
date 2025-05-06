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
                limit: 50,
                page: 1
            })
        }).send(res)
    }
    getAllDiscountCodesWithProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get All DiscountCode Success',
            metadata: await DiscountServices.getAllDiscountCodesWithProduct({
                code: req.params.code,
                limit: 50,
                page: 1
            })
        }).send(res)
    }

}

module.exports = new DiscountController()