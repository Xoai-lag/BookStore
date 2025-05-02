'use strict'
const express = require('express'); 
const ProductController = require('../../controllers/product.controller')
const {  preAuthentication, authenticationV1 } = require('../../auth/authUtils');
const router = express.Router();  // Tạo router mớiS
const asyncHandler = require('../../helpers/asyncHandler');
const { restrictToAdmin } = require('../../auth/restrictToAdmin');

router.use(preAuthentication)
router.use(authenticationV1)
router.use(restrictToAdmin)

router.post('',asyncHandler(ProductController.createProduct))

module.exports = router