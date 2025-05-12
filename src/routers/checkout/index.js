'use strict'

const { preAuthentication, authenticationV1 } = require('../../auth/authUtils')
const { restrictToAdmin } = require('../../auth/restrictToAdmin')
const CheckoutController = require('../../controllers/checkout.controller')
const express = require('express')
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler')

router.use(preAuthentication)
router.use(authenticationV1)

router.post('/review', asyncHandler(CheckoutController.checkoutReview))
router.post('/order', asyncHandler(CheckoutController.orderByUser))
router.get('', asyncHandler(CheckoutController.getOrdersByUser))


router.use(restrictToAdmin)



module.exports = router