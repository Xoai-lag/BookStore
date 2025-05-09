'use strict'

const {cart} = require('../cart.Model')

const createUserCart = async({userId,product})=>{
    const query = {cart_userId:userId,cart_state:'active'}
    const updateOrInsert = {
        $addToSet:{
            cart_products: product
        }
    },options={
        upsert:true,
        new:true
    }
    return await cart.findOneAndUpdate(query,updateOrInsert,options)
}


const updateCartQuantity = async({userId,product})=>{
    
    const {productId, quantity}= product
    
    const query = {
        cart_userId:userId,
        'cart_products.productId':productId,
        cart_state:'active'
    },updateSet ={
        $inc:{
            'cart_products.$.quantity':quantity
        }
    },options={
        upsset:true,
        new:true
    }


    return await cart.findOneAndUpdate(query,updateSet,options)
}


module.exports={
    createUserCart,
    updateCartQuantity
}