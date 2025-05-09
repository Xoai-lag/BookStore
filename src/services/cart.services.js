'use strict'

const { NotFoundError } = require("../core/error.response")
const {cart} = require("../models/cart.Model")
const {createUserCart, updateCartQuantity}= require('../models/repositories/cart.repo')
const { getProductById } = require("../models/repositories/product.repo")
const { convertToObjectIdMongodb } = require("../utils")

/*

    key features: cart service
        -add product to cart[user]
        -reduce product quantity by one[user]
        -increase product quantity by one[user]
        -get cart[user]
        -delete cart[user]
        -delete cart item[user]

 */

class cartService{
    
    static async addToCart({
        userId, product={}
    }){
        const userCart= await cart.findOne({
            cart_userId:userId
        })

        // nếu chưa có giỏ hàng 
        if(!userCart) {
            return await createUserCart({userId,product})
        }



        // nếu có giỏ hàng nhưng chưa có sản phẩm 
        if(!userCart.cart_products.length){
            userCart.cart_products = [product]
            return await userCart.save()
        }

        const foundProduct = userCart.cart_products.find(id=>id.productId.toString()=== product.productId.toString())

        if(!foundProduct){
            userCart.cart_products.push(product)
            return await userCart.save()
        }

        // nếu giỏ hàng đã tồn tại rồi và sản phẩm đã có trong giỏ hàng rồi 
        return await updateCartQuantity({userId,product})

    }


    //update cart

    /*
        shop_order_ids:[
            {
                item_products:[{
                    quantity,
                    price,
                    old_quantity,
                    productId
                }],
                ...version
            }
        ]
    */
    static async addToCartV2({userId,shop_order}){

        const {item_products}= shop_order

        const {productId,quantity,old_quantity} = item_products[0]

        console.log(productId,quantity,old_quantity,shop_order)

        const foundProduct = await getProductById(productId)
        if(!foundProduct) throw new NotFoundError(`Product Not Exists`)

        if(quantity ===0 ){
            return await this.deleteUserCart({userId,productId})
        }

        return await updateCartQuantity({
            userId,
            product:{
                productId,
                quantity: quantity - old_quantity
            }
        })
    }

    static async deleteUserCart({userId,productId}){
        const query={
            cart_userId:userId,
            cart_state:'active'
        },
        updateSet ={
            $pull:{
                cart_products:{
                    productId
                }
            }
        }

        const deleteCart = await cart.updateOne(query, updateSet)

        return deleteCart

    }

    static async getListUserCart({userId}){
        return await cart.findOne({
            cart_userId:+userId
        }).lean()
    }
}

module.exports=cartService