'use strict'

const { book, stationery, gift, product } = require('../models/Product.Model')
const { BadRequestError } = require('../core/error.response')
const ProductModel = require('../models/Product.Model')


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
        return await product.create({...this,_id:product_id})
    }
}

//define factory class to create product 
class ProductFactory {

    //khởi tạo 1 Object rỗng để lưu trữ ánh xạ key-value 
    static productRegistry={}

    //đăng kí 1 cặp type classRef vào productRegistry 
    static registerProductType(type,classRef){
        ProductFactory.productRegistry[type]=classRef
    }
        
    //Lấy lớp từ productRegistry.Tạo instance và gọi createProduct 

    //METHOD FACTORY PATTERN
    static async createProduct(type,payload) {
        const productClass=ProductFactory.productRegistry[type]
        if(!productClass)
            throw new BadRequestError(`Invalid Product Type ${type}`)

        return new productClass(payload).createProduct()
    }
}

//define sub-class for different product type = book

class Book extends Product{
    async createProduct(){
        const newBook = await book.create(this.product_attributes)
        if(!newBook) throw new BadRequestError('Create new Book error!')

        const newProduct = await super.createProduct(newBook._id)
        if(!newProduct) throw new BadRequestError('Create new Product error!')

        return newProduct
    } 
}

//define sub-class for different product type = stationery

class Stationery extends Product{
    async createProduct(){
        const newStationery = await stationery.create(this.product_attributes)
        if(!newStationery) throw new BadRequestError('Create new Stationery error!')

        const newProduct = await super.createProduct(newStationery._id)
        if(!newProduct) throw new BadRequestError('Create new Product error!')

        return newProduct
    } 
}

//define sub-class for different product type = gift

class Gift extends Product{
    async createProduct(){
        const newGift = await gift.create(this.product_attributes)
        if(!newGift) throw new BadRequestError('Create new Gift error!')

        const newProduct = await super.createProduct(newGift._id)
        if(!newProduct) throw new BadRequestError('Create new Product error!')

        return newProduct
    } 
}

//Register product types
ProductFactory.registerProductType('Book',Book)
ProductFactory.registerProductType('Stationery',Stationery)
ProductFactory.registerProductType('Gift',Gift)

module.exports=ProductFactory   