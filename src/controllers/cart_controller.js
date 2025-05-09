'use strict'


const { Created, SuccessResponse } = require("../core/success.response")
const cartService = require("../services/cart.services")


class CartController {
    addToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create New Cart Success!',
            metadata: await cartService.addToCart(req.body),
        }).send(res)
    }

    update = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update Cart Success!',
            metadata: await cartService.addToCartV2(req.body),
        }).send(res)
    }

    delete = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete Cart Success!',
            metadata: await cartService.deleteUserCart(req.body),
        }).send(res)
    }


    listToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'List Cart Success!',
            metadata: await cartService.getListUserCart(req.query),
        }).send(res)
    }
}

module.exports = new CartController()