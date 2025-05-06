'use strict'
const { BadRequestError, NotFoundError } = require('../core/error.response')

const discount = require('../models/discount.Model')
const { findAllProducts } = require('../models/repositories/product.repo')
const { updateDiscountCode } = require('../models/repositories/discount.repo')
const { findAllDiscountCodesUnSelect, findAllDiscountCodesSelect } = require('../models/repositories/discount.repo')
const { default: mongoose } = require('mongoose')
const { removeUndefinedObject } = require('../utils/index')

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
            description, type, value, max_value, max_uses,
            uses_count, max_uses_per_user, users_used
        } = body


        if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) throw new BadRequestError('Discount code has expried!')

        if (new Date(start_date) > new Date(end_date)) throw new BadRequestError('Start date must be before end date!')


        const foundDiscount = discount.findOne({
            discount_code: code
        }).lean()


        if (foundDiscount && foundDiscount.discount_is_active) throw new BadRequestError('Discount exists!')

        const convertedProductIds = applies_to === 'all' ? [] : product_ids.map(id => new mongoose.Types.ObjectId(id));

        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_code: code,
            discount_value: value,
            discount_min_order_value: min_order_value || 0,
            discount_max_value: max_value,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_users_used: users_used,
            discount_max_uses_per_user: max_uses_per_user,
            discount_applies_to: applies_to,
            discount_is_active: is_active,
            discount_product_ids: convertedProductIds
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
        const foundDiscount = await discount.findOne({
            discount_code: code
        }).lean()

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
}

module.exports = DiscountServices