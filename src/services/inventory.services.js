'use strict'

const { BadRequestError } = require('../core/error.response')
const inventory =require('../models/Inventory.Model')
const { getProductById } = require('../models/repositories/product.repo')


class InventoryService{

    static async addStockToInventory({
        stock,
        productId,
        location='TP.HCM',
    }){
        const product = await getProductById(productId)
        if(!product) 
            throw new BadRequestError('The Product Does Not Exists!')

        const query={
            inven_productId:productId,
        }, updateSet={
            $inc:{
                inven_stock:stock
            },
            $set:{
                inven_location:location
            }
        }, options={
            upsert:true,
            new:true
        }
        return await inventory.findOneAndUpdate(query,updateSet,options)
    }

}


module.exports=InventoryService