'use strict'

const inventory = require('../Inventory.Model')
const {Types}= require('mongoose')

const insertInventory = async({
    productId,stock,location='unKnow'
})=>{
    return await inventory.create({
        inven_productId:productId,
        inven_stock:stock,
        inven_location:location
    })
}

module.exports ={
    insertInventory
}