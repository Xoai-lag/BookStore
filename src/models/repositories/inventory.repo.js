'use strict'

const inventory = require('../Inventory.Model')
const {Types}= require('mongoose')
const { convertToObjectIdMongodb }= require('../../utils/index')

const insertInventory = async({
    productId,stock,location='unKnow'
})=>{
    return await inventory.create({
        inven_productId:productId,
        inven_stock:stock,
        inven_location:location
    })
}


const reservationInventory = async({
    productId,quantity, cartId
})=>{

    const query = {
        inven_productId:productId,
        inven_stock:{$gte:quantity} // $gte lớn hơn hoặc bằng 
    }, updateSet ={
        $inc :{
            inven_stock:-quantity
        },
        $push:{
                inven_reservations:{
                    quantity,
                    cartId,
                    createOn:new Date()
                }
        }
    }, options ={
        upsert:true, new:true
    }
    return await inventory.updateOne(query,updateSet,options)
}
module.exports ={
    insertInventory,
    reservationInventory
}