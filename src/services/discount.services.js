'use strict'
const { BadRequestError, NotFoundError } = require('../core/error.response')

const discount = require('../models/discount.Model')
const { findAllProducts } = require('../models/repositories/product.repo')
const { updateDiscountCode } = require('../models/repositories/discount.repo')
const { findAllDiscountCodesUnSelect, findAllDiscountCodesSelect, checkDiscountExists } = require('../models/repositories/discount.repo')
const { default: mongoose } = require('mongoose')
const { removeUndefinedObject } = require('../utils/index')
const { filter } = require('lodash')


/*
    1.generator discount code [admin/shop] 
    2.Get discount amount [user]
    3.get all discount codes [user / shop]
    4. verify discount code [user]
    5.delete discount code [shop/admin]
    6.cancel discount code [user]
*/
class DiscountServices {
    static async createDiscountCode(body) {

        const {
            code, start_date, end_date,
            is_active, min_order_value,
            product_ids, applies_to, name,
            description, type, value, max_uses,
            uses_count, max_uses_per_user, users_used
        } = body

        if (new Date(start_date) > new Date(end_date)) throw new BadRequestError('Start date must be before end date!')


        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: code
            }
        })


        if (foundDiscount && foundDiscount.discount_is_active) throw new BadRequestError('Discount exists!')

        const convertedProductIds = applies_to === 'all' ? [] : product_ids.map(id => new mongoose.Types.ObjectId(id));

        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_code: code,
            discount_value: value,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_uses_count: uses_count,
            discount_users_used: users_used,
            discount_max_uses_per_user: max_uses_per_user,
            discount_min_order_value: min_order_value || 0,
            discount_applies_to: applies_to,
            discount_is_active: is_active,
            discount_product_ids: convertedProductIds,
            discount_max_uses: max_uses
        })
        return newDiscount
    }

    static async updateDiscount({ discountId, body }) {
        const bodyUpdate = removeUndefinedObject(body)
        const updatedDiscount = await updateDiscountCode({ discountId, bodyUpdate })
        if (!updatedDiscount) throw new NotFoundError('Discount Not Found!')
        return updatedDiscount
    }


    //get all discount codes available with products

    static async getAllDiscountCodesWithProduct({
        code, userId, limit, page
    }) {
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: code
            }
        })

        if (!foundDiscount || !foundDiscount.discount_is_active) throw new NotFoundError('Discount not exists!')


        const { discount_applies_to, discount_product_ids } = foundDiscount

        let products
        if (discount_applies_to === 'all') {
            products = await findAllProducts({
                filter: {
                    isPublish: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name', 'product_price']
            })
        }

        if (discount_applies_to === 'specific') {
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublish: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name', 'product_price']
            })
        }
        return products
    }


    //get all discount codes of shop
    static async getAllDiscountCodesByShop({
        limit, page
    }) {
        const discounts = await findAllDiscountCodesUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_is_active: true,
            },
            unSelect: ['__v'],
            model: discount
        })
        return discounts
    }

    //apply Discount Code

    static async getDiscountAmount({ codeId, userId, products }) {
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: codeId
            }
        })


        if (!foundDiscount) throw new NotFoundError(`Discount doesn't exists!`)


        const {
            discount_is_active,
            discount_max_uses,
            discount_min_order_value,
            discount_users_used,
            discount_max_uses_per_user,
            discount_start_date,
            discount_end_date,
            discount_type,
            discount_value
        } = foundDiscount

        if (!discount_is_active)
            throw new NotFoundError(`Discount expired!`)

        if (discount_max_uses <= 0)
            throw new NotFoundError('Discount are out!')

        if (new Date() < new Date(discount_start_date) || new Date > new Date(discount_end_date)) {
            throw new NotFoundError('Discount ecode has expired!')
        }


        let totalOrder = 0
        if (discount_min_order_value > 0) {
            //get total
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)
            if (totalOrder < discount_min_order_value) {
                throw new NotFoundError(`discount requires a minium order value of ${discount_min_order_value}`)
            }
        }


        if (discount_max_uses_per_user > 0) {

            const userObjectId = new mongoose.Types.ObjectId(userId);

            const userRecord = discount_users_used.find(entry => entry.userId.equals(userObjectId));

            const userUsageCount = userRecord ? userRecord.timesUsed : 0;


            if (userUsageCount >= discount_max_uses_per_user) {
                throw new BadRequestError(`You have already used this discount the maximum number of times (${discount_max_uses_per_user})`)
            }

            if (!userRecord) {
                const addUser = await discount.findByIdAndUpdate(
                    foundDiscount._id, {
                    $addToSet: { discount_users_used: { userId: userObjectId, timesUsed: 0 } }
                }, {
                    new: true
                }
                )
                if (!addUser) throw new NotFoundError('Add User Into User Used Error!')
            }

            const updateDiscountCode = await discount.findByIdAndUpdate(
                foundDiscount._id, {
                $inc: {
                    'discount_users_used.$[elem].timesUsed': 1,
                    discount_uses_count: 1,
                    discount_max_uses: -1
                }
            }, {
                arrayFilters: [{ 'elem.userId': userObjectId }],
                new: true,
            })
            if (!updateDiscountCode) throw new NotFoundError('Update Discount Error!')

        }

        if (typeof discount_value !== 'number' || discount_value < 0) {
            throw new BadRequestError('Invalid discount value');
        }

        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }
    }

    static async deleteDiscount({ discountId }) {
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                _id: discountId
            }
        })
        if (!foundDiscount) throw new NotFoundError('Discount Not Exists!')

        const {
            discount_is_active,
            discount_end_date,
        } = foundDiscount

        if (new Date() < new Date(discount_end_date) && discount_is_active)
            throw new BadRequestError('Canot Delete an active or unexpired discount!')

        return await discount.findByIdAndDelete(discountId)
    }

    static async cancelDiscountCode({
        codeId, userId
    }) {

        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: codeId,
            }
        })
        if (!foundDiscount) throw new NotFoundError(`discount doesn't exists`)


        const userObjectId = new mongoose.Types.ObjectId(userId)

        const userUsage = discount_users_used.find(entry => entry.userId.equals(userObjectId))

        if (!userUsage)
            throw new NotFoundError('User has not used this discount code!')

        const timesUsed = userUsage.timesUsed || 0

        if (timesUsed <= 0)
            throw new BadRequestError('Invalid discount usage data!')

        let updatedDiscount;
        if (timesUsed > 1) {
            updatedDiscount = await discount.findByIdAndUpdate(
                foundDiscount._id,
                {
                    $inc: {
                        'discount_users_used.$[elem].timesUsed': -1,
                        discount_max_uses: 1,
                        discount_uses_count: -1
                    }
                },
                {
                    arrayFilters: [{ 'elem.userId': userObjectId }],
                    new: true,
                }
            );
        } else {
            updatedDiscount = await discount.findByIdAndUpdate(
                foundDiscount._id,
                {
                    $pull: { discount_users_used: { userId: userObjectId } },
                    $inc: {
                        discount_max_uses: 1,
                        discount_uses_count: -1
                    }
                },
                { new: true }
            );
        }

        if (!updatedDiscount) {
            throw new NotFoundError('Failed to update discount code!');
        }
        return { message: 'Discount code usage canceled successfully!' };
    }
}

module.exports = DiscountServices