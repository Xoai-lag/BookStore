'use strict'


const { model } = require('mongoose')
const { unGetSelectData, getSelectData } = require('../../utils/index')
const discountModel = require('../discount.Model')

const updateDiscountCode = async ({ discountId, bodyUpdate, isNew = true }) => {
    return await discountModel.findByIdAndUpdate(discountId, bodyUpdate, {
        new: isNew,
        runValidators: true
    })
}

const findAllDiscountCodesUnSelect = async ({
    limit = 50, page = 1, sort = 'ctime', filter, unSelect, model
}) => {
    const skip = limit * (page - 1)
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const documents = await model.find(filter).
        sort(sortBy).
        skip(skip).
        limit(limit).
        select(unGetSelectData(unSelect)).
        lean()

    return documents
}

const findAllDiscountCodesSelect = async ({
    limit = 50, page = 1, sort = 'ctime', filter, Select, model
}) => {
    const skip = limit * (page - 1)
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const documents = await model.find(filter).
        sort(sortBy).
        skip(skip).
        limit(limit).
        select(getSelectData(Select)).
        lean()

    return documents
}

const checkDiscountExists = async ({model, filter}) => {
    return await model.findOne(filter).lean()
}



module.exports = {
    findAllDiscountCodesUnSelect,
    findAllDiscountCodesSelect,
    updateDiscountCode,
    checkDiscountExists
}