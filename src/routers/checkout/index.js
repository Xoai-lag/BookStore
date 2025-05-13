'use strict'

const { preAuthentication, authenticationV1 } = require('../../auth/authUtils')
const { restrictToAdmin } = require('../../auth/restrictToAdmin')
const CheckoutController = require('../../controllers/checkout.controller')
const express = require('express')
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler')
const checkoutController = require('../../controllers/checkout.controller')

router.use(preAuthentication)
router.use(authenticationV1)

router.post('/cancel/:orderId', asyncHandler(CheckoutController.cancelOrderByUser))
router.post('/review', asyncHandler(CheckoutController.checkoutReview))
router.post('/order', asyncHandler(CheckoutController.orderByUser))
router.get('', asyncHandler(CheckoutController.getOrdersByUser))
router.get('/:orderId', asyncHandler(CheckoutController.getOneOrdersByUser))


router.use(restrictToAdmin)

router.post('/updateStatus',asyncHandler(checkoutController.updateStatusOrderByAdmin))



module.exports = router