'use strict'

const { BadRequestError, NotFoundError } = require("../core/error.response")
const { findCartById } = require("../models/repositories/cart.repo")
const { checkProductByServer } = require("../models/repositories/product.repo")
const { convertToObjectIdMongodb } = require("../utils")
const { getDiscountAmount } = require("./discount.services")
const { acquireLock, releaseLock } = require("./redis.services")
const order = require('../models/Order.Model')
const { deleteUserCart } = require("./cart.services")
const mongoose = require('mongoose')
const { getAllOrderByUser, getOneOrderByUser, findOrderById, updateOrder } = require("../models/repositories/checkout.repo")
const { findByUserId } = require("./customer.services")
const orderStatusQueue = require('../queues/orderStatus.queue');
const OrderModel = require("../models/Order.Model")

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


        for (const product of item_products) {
            if (!product.productId || !mongoose.Types.ObjectId.isValid(product.productId)) {
                throw new BadRequestError(`productId không hợp lệ: ${product.productId}`);
            }
        }

        // check product available 
        const checkProductServer = await checkProductByServer(item_products)

        if (!checkProductServer || checkProductServer.length === 0) throw new BadRequestError('order wrong!!!')


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
                    userId: userId,
                    products: checkProductServer,
                });
                checkout_order.totalDiscount += amount;  // Tích lũy tổng tiền giảm giá từ các mã

            }
        }

        checkout_order.totalCheckout = Math.max(0, checkout_order.totalPrice - checkout_order.totalDiscount)

        return {
            shop_order,
            checkout_order,
            checkProductServer
        }
    }


    static async orderByUser({
        shop_order, cartId, userId, user_address = {}, user_payment = {}
    }) {
        const { checkout_order, checkProductServer } = await CheckoutService.checkoutReview({
            cartId, userId, shop_order
        })
        // check inventory
        const acquireProduct = []
        const method = 'reservation'
        for (let i = 0; i < checkProductServer.length; i++) {

            const { productId, quantity } = checkProductServer[i]

            const keyLock = await acquireLock({
                productId: productId,
                cartId: cartId,
                quantity: quantity,
                method: method
            })

            acquireProduct.push(keyLock ? true : false)

            if (keyLock) {
                await releaseLock(keyLock)
            }
        }

        // check nếu có 1 sản phẩm hết hàng trong kho 
        if (acquireProduct.includes(false)) {
            throw new BadRequestError('Some Products In Your Cart Are Out Of Stock!')
        }

        const newOrder = await order.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: checkProductServer,
            order_status: 'confirmed'
        })

        // nếu insert thành công thì remove products trong cart

        if (newOrder) {
            // remove products in my cart 
            for (let i = 0; i < checkProductServer.length; i++) {
                const { productId } = checkProductServer[i]

                const delProductInCart = await deleteUserCart({ userId, productId })
                if (!delProductInCart)
                    throw new BadRequestError('Delete A Product In Cart Error!')
            }
            // Thêm đơn hàng vào hàng đợi sau 10 giây sẽ chuyển trạng thái sang shipped 
            await orderStatusQueue.add({
                orderId: newOrder._id.toString(),
                targetStatus: 'shipped'
            }, {
                delay: 10000
            });
        }
        return newOrder
    }


    /*
        query order [user]
    */
    static async getOrdersByUser({
        userId, sort = 'ctime'
    }) {
        const userIdObject = convertToObjectIdMongodb(userId)
        const filter = {
            order_userId: userIdObject
        }
        return await getAllOrderByUser({
            filter, sort,
            select: ['order_checkout', 'order_products', 'order_status']
        })
    }
    /*
        query order using id  [user]
    */
    static async getOneOrderByUser({
        userId, orderId
    }) {
        const userIdObject = convertToObjectIdMongodb(userId)
        const orderIdObject = convertToObjectIdMongodb(orderId)
        const filter = {
            order_userId: userIdObject,
            _id: orderIdObject
        }
        return await getOneOrderByUser({
            filter,
            select: ['order_checkout', 'order_products', 'order_status', 'order_shipping', 'order_payment', 'order_trackingNumber']
        })
    }
    /*
        cancel order [user]
    */
    static async cancelOrderByUser({
        userId, orderId
    }) {

        if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
            throw new BadRequestError('orderId không hợp lệ');
        }
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            throw new BadRequestError('userId không hợp lệ');
        }
        const orderIdObject = convertToObjectIdMongodb(orderId)
        const userIdObject = convertToObjectIdMongodb(userId)



        const foundOrder = await findOrderById({
            orderId: orderIdObject,
            userId: userIdObject
        })

        if (!foundOrder)
            throw new NotFoundError('Order Not Found!')

        const { order_status, order_products } = foundOrder

        if (!['pending', 'confirmed'].includes(order_status)) {
            throw new BadRequestError('This Order Can Not Be Cancelled!')
        }

        const acquireProduct = []
        const method = 'increasestock'
        for (let i = 0; i < order_products.length; i++) {
            const { productId, quantity } = order_products[i]

            const keyLock = await acquireLock({
                method: method,
                productId: productId,
                quantity: quantity,
                orderId: orderId
            })

            acquireProduct.push(keyLock ? true : false)
            if (keyLock) {
                await releaseLock(keyLock)
            }
        }
        if (acquireProduct.includes(false)) {
            throw new BadRequestError('Failed to restore stock for some products!')
        }

        const query = {
            _id: orderIdObject,
            order_userId: userIdObject
        }, updateSet = {
            $set: { order_status: 'cancelled' },
            $currentDate: { updatedAt: true }
        }, options = { new: true }

        return await updateOrder({ query, updateSet, options })
    }
    /*
        update order [admin]
    */

    static async updateOrderStatusByAdmin(orderId, targetStatus) {

        const orderIdObject = await convertToObjectIdMongodb(orderId)
        
        const currentOrder = await OrderModel.findById(orderId).lean()

        if (!currentOrder) throw new NotFoundError('Order Not Found!');

        // lấy trang thái của đơn hàng hiện tại 
        const currentStatus = currentOrder.order_status;

        const allowedTransitions = {
            pending: ['confirmed', 'cancelled'],
            confirmed: ['shipped', 'cancelled'],
            shipped: ['delivered'],
            delivered: [],
            cancelled: []
        };

        if (!allowedTransitions[currentStatus]?.includes(targetStatus)) {
            throw new BadRequestError(`Không thể chuyển trạng thái từ ${currentStatus} sang ${targetStatus}`);
        }

        const query = {
            _id: orderIdObject,
            order_status: currentStatus
        }, updateSet = {
            $set: { order_status: targetStatus },
            $currentDate: { updatedAt: true }
        }, options = { new: true };

        const result = await updateOrder({ query, updateSet, options });

        if (!result?.modifiedCount) {
            throw new BadRequestError('Cập nhật trạng thái thất bại');
        }

        return result;
    }
}

module.exports = CheckoutService