'use strict'

const express = require('express')
const router = express.Router()
const InventoryController = require('../../controllers/inventory.controller')
const asyncHandler= require('../../helpers/asyncHandler')
const { preAuthentication, authenticationV1 } = require('../../auth/authUtils')
const { restrictToAdmin } = require('../../auth/restrictToAdmin')
const inventoryController = require('../../controllers/inventory.controller')


router.use(preAuthentication)
router.use(authenticationV1)
router.use(restrictToAdmin)

router.post('',asyncHandler(inventoryController.addStockToInventory))

module.exports =router