// "Bộ điều khiển"


'use strict'

const ProductService = require('../services/product.services')
const { SuccessResponse } = require('../core/success.response')

class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new Product Success',
            metadata: await ProductService.createProduct(req.body.product_type, req.body)
        }).send(res)
    }

    publishProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Publish new Product Success',
            metadata: await ProductService.publishProduct({
                product_id: req.params.id //lấy id từ url trên đoạn :id của router
            })
        }).send(res)
    }

    unpublishProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'unPublish Product Success',
            metadata: await ProductService.unpublishProduct({
                product_id: req.params.id //lấy id từ url trên đoạn :id của router
            })
        }).send(res)
    }


    //update product

    updateProduct= async (req,res,next)=>{
        new SuccessResponse({
            message: 'Update Product Success',
            metadata: await ProductService.updateProduct(req.body.product_type,req.params.productId,req.body)
        }).send(res)
    }

    //query

    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get List Search Success!',
            metadata: await ProductService.searchProduct(req.params)
        }).send(res)
    }

    /**
     * @description Get All Draft for shop
     * @param {number} limit
     * @param {number} skip 
     * @return {JSON}  
     */
    getAllDraftsForOrganization = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get List Draft Success!',
            metadata: await ProductService.findAllDraftsForOrganization({ limit: 50, skip: 0 })
        }).send(res)
    }

    getAllPublishForOrganization = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get List Publish Success!',
            metadata: await ProductService.findAllPublishForOrganization({ limit: 50, skip: 0 })
        }).send(res)
    }

    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get All Products Success!',
            metadata: await ProductService.findAllProducts(req.query)
        }).send(res)
    } 
    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get Product Success!',
            metadata: await ProductService.findProduct({
                product_id:req.params.product_id
            })
        }).send(res)
    } 
    deleteProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete Product Success!',
            metadata: await ProductService.deleteProduct(req.body.product_type,req.params.productId)
        }).send(res)
    } 
}

module.exports = new ProductController()