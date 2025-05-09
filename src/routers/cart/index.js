'use strict'

const { preAuthentication, authenticationV1 } = require('../../auth/authUtils')
const { restrictToAdmin } = require('../../auth/restrictToAdmin')
const CartController = require('../../controllers/cart_controller')
const express = require('express')
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler')


router.post('',asyncHandler(CartController.addToCart))
router.delete('',asyncHandler(CartController.delete))
router.post('/update',asyncHandler(CartController.update))
router.get('',asyncHandler(CartController.listToCart))

module.exports = router