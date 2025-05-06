'use strict'

const { book, stationery, gift, product } = require('../models/Product.Model')
const { BadRequestError } = require('../core/error.response')
const ProductModel = require('../models/Product.Model')
const { findAllDraftsForOrganization,
    findAllPublishForOrganization,
    searchProduct,
    unpublishProduct,
    publishProduct,
    findAllProducts,
    findProduct,
    updateProductById,
    deleteProductById } = require('../models/repositories/product.repo')
const { removeUndefinedObject, updateNestedObjectParser } = require('../utils')
const { insertInventory } = require('../models/repositories/inventory.repo')


//define base product class 
class Product {
    constructor({
        product_name, product_thumb, product_description,
        product_price, product_quantity, product_type, product_attributes
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_attributes = product_attributes
    }
    //create new product
    async createProduct(product_id) {
        const newProduct = await product.create({ ...this, _id: product_id })
        if(newProduct){
            await insertInventory({
                productId:newProduct._id,
                stock:this.product_quantity
            })
        }
        return newProduct
    }

    async updateProduct(productId, bodyUpdate) {
        return await updateProductById({ productId, bodyUpdate, model: product })
    }
    async deleteProduct(productId) {
        return await deleteProductById({ productId, model: product })
    }
}

//define factory class to create product 
class ProductFactory {

    //khởi tạo 1 Object rỗng để lưu trữ ánh xạ key-value 
    static productRegistry = {}

    //đăng kí 1 cặp type classRef vào productRegistry 
    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    //Lấy lớp từ productRegistry.Tạo instance và gọi createProduct 

    //METHOD FACTORY PATTERN
    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass)
            throw new BadRequestError(`Invalid Product Type ${type}`)

        return new productClass(payload).createProduct()
    }


    //put

    //Dùng để publish sản phẩm DraftDraft
    static async publishProduct({ product_id }) {
        return await publishProduct({ product_id })
    }

    static async unpublishProduct({ product_id }) {
        return await unpublishProduct({ product_id })
    }

    // query

    //search
    static async searchProduct({ keySearch }) {
        return await searchProduct({ keySearch })
    }

    //Tìm các sản phẩm Draft chưa được publish 
    static async findAllDraftsForOrganization(param = {}) {
        const query = { isDraft: true }
        const { limit, skip } = param
        return await findAllDraftsForOrganization(query, limit, skip)
    }


    //Tìm các sản phẩm đã được publish chính thức mở bán 
    static async findAllPublishForOrganization(param = {}) {
        const query = { isPublish: true }
        const { limit, skip } = param
        return await findAllPublishForOrganization(query, limit, skip)
    }

    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublish: true } }) {
        return await findAllProducts({
            limit, sort, page, filter,
            select: ['product_name', 'product_price', 'product_thumb']
        })
    }

    static async findProduct({ product_id }) {
        return await findProduct({ product_id, unSelect: ['__v'] })
    }
    static async updateProduct(type, productId, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass)
            throw new BadRequestError(`Invalid Product Type ${type}`)
        return await new productClass(payload).updateProduct(productId)
    }


    //delete 
    static async deleteProduct(type, productId) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid Product Type ${type}`)

        const instance = new productClass({product_type:type})
        return await instance.deleteProduct(productId)
    }
}

//define sub-class for different product type = book

class Book extends Product {
    async createProduct() {
        const newBook = await book.create(this.product_attributes)
        if (!newBook) throw new BadRequestError('Create new Book error!')

        const newProduct = await super.createProduct(newBook._id)
        if (!newProduct) throw new BadRequestError('Create new Product error!')

        return newProduct
    }

    async updateProduct(productId) {
        const objectParams = removeUndefinedObject(this)
        if (objectParams.product_attributes) {
            await updateProductById({
                productId,
                bodyUpdate: objectParams.product_attributes,
                model: book
            })
        }
        const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams))
        return updateProduct
    }
    async deleteProduct(productId) {
        const deleteBook = await deleteProductById({ productId, model: book })
        if (!deleteBook) throw new BadRequestError('Book Not Found!')

        const delProduct = await super.deleteProduct(productId)
        if (!delProduct) throw new BadRequestError('Product Not Found!')
        return delProduct
    }
}

//define sub-class for different product type = stationery

class Stationery extends Product {
    async createProduct() {
        const newStationery = await stationery.create(this.product_attributes)
        if (!newStationery) throw new BadRequestError('Create new Stationery error!')

        const newProduct = await super.createProduct(newStationery._id)
        if (!newProduct) throw new BadRequestError('Create new Product error!')

        return newProduct
    }
    async updateProduct(productId) {
        const objectParams = removeUndefinedObject(this)
        if (objectParams.product_attributes) {
            await updateProductById({
                productId,
                bodyUpdate: objectParams.product_attributes,
                model: stationery
            })
        }
        const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams))
        return updateProduct
    }
    async deleteProduct(productId) {
        const deleteStationery = await deleteProductById({ productId, model: stationery })
        if (!deleteStationery) throw new BadRequestError('Stationery Not Found!')

        const delProduct = await super.deleteProduct(productId)
        if (!delProduct) throw new BadRequestError('Product Not Found!')
        return delProduct
    }
}

//define sub-class for different product type = gift

class Gift extends Product {
    async createProduct() {
        const newGift = await gift.create(this.product_attributes)
        if (!newGift) throw new BadRequestError('Create new Gift error!')

        const newProduct = await super.createProduct(newGift._id)
        if (!newProduct) throw new BadRequestError('Create new Product error!')

        return newProduct
    }
    async updateProduct(productId) {
        const objectParams = removeUndefinedObject(this)
        if (objectParams.product_attributes) {
            await updateProductById({
                productId,
                bodyUpdate: objectParams.product_attributes,
                model: gift
            })
        }
        const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams))
        return updateProduct
    }
    async deleteProduct(productId) {
        const deleteGift = await deleteProductById({ productId, model: gift })
        if (!deleteGift) throw new BadRequestError('Gift Not Found!')

        const delProduct = await super.deleteProduct(productId)
        if (!delProduct) throw new BadRequestError('Product Not Found!')
        return delProduct
    }
}

//Register product types
ProductFactory.registerProductType('Book', Book)
ProductFactory.registerProductType('Stationery', Stationery)
ProductFactory.registerProductType('Gift', Gift)

module.exports = ProductFactory   