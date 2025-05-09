//(kho mã nguồn)


'use strict'

const { product } = require('../Product.Model')
const { getSelectData, unGetSelectData, convertToObjectIdMongodb } = require('../../utils/index')
const { model } = require('mongoose')

const findAllDraftsForOrganization = async (query, limit, skip) => {
    return await queryProduct(query, limit, skip)
}

const findAllPublishForOrganization = async (query, limit, skip) => {
    return await queryProduct(query, limit, skip)
}

const searchProduct = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch)
    const result = await product.find({
        isPublish: true,
        $text: { $search: regexSearch }
    }, { score: { $meta: 'textScore' } }).
        sort({ score: { $meta: 'textScore' } }).
        lean()
    return result
}


//publishProduct 
const publishProduct = async ({ product_id }) => {
    const foundProduct = await product.findOne({ _id: product_id })
    if (!foundProduct) return null
    foundProduct.isDraft = false
    foundProduct.isPublish = true

    //mongoose trả về số document được updateupdate
    const { modifiedCount } = await foundProduct.updateOne(foundProduct)
    return modifiedCount
}

const unpublishProduct = async ({ product_id }) => {
    const foundProduct = await product.findOne({ _id: product_id })
    if (!foundProduct) return null
    foundProduct.isDraft = true
    foundProduct.isPublish = false

    //mongoose trả về số document được updateupdate
    const { modifiedCount } = await foundProduct.updateOne(foundProduct)
    return modifiedCount
}

//update

const updateProductById = async ({productId,bodyUpdate,model,isNew=true})=>{
    return await model.findByIdAndUpdate(productId,bodyUpdate,{
        new:isNew
    })
}

//Do cả find Draft và find Publish đều dùng chung phương thức query nên tạo 1 fn queryProduct để tái sử dụng 
const queryProduct = async (query, limit, skip) => {
    return await product.find(query).
        sort({ updatedAt: -1 }). //sắp xếp theo này update giảm dần (thời gian gần nhấtnhất)
        skip(skip). //bỏ qua các select đầu tiên
        limit(limit). //giới hạn select 
        lean()
}

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const products = await product.find(filter).
        sort(sortBy).
        skip(skip).
        limit(limit).
        select(getSelectData(select)).
        lean()

    return products
}

const findProduct = async ({product_id,unSelect})=>{
    return await product.findById(product_id).select(unGetSelectData(unSelect))
}

//delete 
const deleteProductById = async({productId,model})=>{
    return await model.findByIdAndDelete(productId)
}

const getProductById = async(productId)=>{
    return await product.findOne({_id:convertToObjectIdMongodb(productId)}).lean()
}


module.exports = {
    findAllDraftsForOrganization,
    findAllPublishForOrganization,
    publishProduct,
    unpublishProduct,
    searchProduct,
    findAllProducts,
    findProduct,
    updateProductById,
    deleteProductById,
    getProductById
}