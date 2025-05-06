'use strict'

const { preAuthentication, authenticationV1 } = require('../../auth/authUtils')
const { restrictToAdmin } = require('../../auth/restrictToAdmin')
const DiscountController = require('../../controllers/discount.controller')
const express = require('express')
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler')

router.use(preAuthentication)
router.use(authenticationV1)
router.use(restrictToAdmin)

//create 
router.post('', asyncHandler(DiscountController.createDiscountCode))
router.post('/update/:discountId', asyncHandler(DiscountController.updateDiscountCode))


//getAllDiscount

router.get('/getAllDiscountCodes', asyncHandler(DiscountController.getAllDiscountsByShop))
router.get('/getDiscountCodesWithProduct/:code', asyncHandler(DiscountController.getAllDiscountCodesWithProduct))

module.exports = router