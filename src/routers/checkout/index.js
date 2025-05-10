'use strict'

const { preAuthentication, authenticationV1 } = require('../../auth/authUtils')
const { restrictToAdmin } = require('../../auth/restrictToAdmin')
const CheckoutController = require('../../controllers/checkout.controller')
const express = require('express')
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler')

router.use(preAuthentication)
router.use(authenticationV1)
router.use(restrictToAdmin)

router.post('/review', asyncHandler(CheckoutController.checkoutReview))



module.exports = router