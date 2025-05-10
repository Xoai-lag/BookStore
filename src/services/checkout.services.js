'use strict'

const { BadRequestError } = require("../core/error.response")
const { findCartById } = require("../models/repositories/cart.repo")
const { checkProductByServer } = require("../models/repositories/product.repo")
const { convertToObjectIdMongodb } = require("../utils")
const { getDiscountAmount } = require("./discount.services")

class CheckoutService {
    //login and without login
    /*
        carId,
        userId,
        shop_order:{
            discount:[{
                discountId,
                codeId:
            }]
            item_products:[{
                productId,
                quantity,
                price
            },
            {
                productId,
                quantity,
                price
            }]

        }
    */
    // check out trước khi hoàn tất đơn hàng 
    static async checkoutReview({
        cartId, userId, shop_order = []
    }) {
        const foundCart = await findCartById(cartId)

        if (!foundCart) throw new BadRequestError('Cart does not exists!')

        const checkout_order = {
            totalPrice: 0,
            freeship: 0,
            totalDiscount: 0,
            totalCheckout: 0
        }


        // tính tổng tiền 

        const { shop_discount = [], item_products = [] } = shop_order

        // check product available 
        const checkProductServer = await checkProductByServer(item_products)

        if (!checkProductServer[0]) throw new BadRequestError('order wrong!!!')

        // tổng tiền đơn hàng chưa tính giảm giá 

        const checkoutPrice = checkProductServer.reduce((acc, product) => {
            return acc + (product.quantity * product.price)
        }, 0)
        // tổng tiền trước khi xữ lí 
        checkout_order.totalPrice += checkoutPrice

        //xữ lí giảm giá nếu có 
        if (shop_discount.length > 0) {
            for (const discountItem of shop_discount) {
                const { totalPrice = 0, discount: amount = 0 } = await getDiscountAmount({
                    codeId: discountItem.codeId,
                    userId:userId,
                    products: checkProductServer,
                });
                checkout_order.totalDiscount += amount;  // Tích lũy tổng tiền giảm giá từ các mã
                
            }
        }

        checkout_order.totalCheckout = Math.max(0, checkout_order.totalPrice  - checkout_order.totalDiscount)

        return {
            shop_order,
            checkout_order
        }
    }
}

module.exports = CheckoutService