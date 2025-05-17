'use strict'
const express = require('express');
const ProductController = require('../../controllers/product.controller')
const { preAuthentication, authenticationV1 } = require('../../auth/authUtils');
const router = express.Router();  // Tạo router mớiS
const asyncHandler = require('../../helpers/asyncHandler');
const { restrictToAdmin } = require('../../auth/restrictToAdmin');
const productController = require('../../controllers/product.controller');
const upload = require('../../middleware/uploadImage'); // Thêm dòng này


router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))
router.get('', asyncHandler(productController.findAllProducts))
router.get('/:product_id', asyncHandler(productController.findProduct))


router.use(preAuthentication)
router.use(authenticationV1)
router.use(restrictToAdmin)

//create 
router.post(
    '', 
    upload.single('product_thumb'), // middleware upload, upload xong multer Gắn thông tin file vào req.file.


    asyncHandler(async (req, res, next) => {
        // gắn filename vào req.body
        if (req.file) {
            req.body.product_thumb = `/images/${req.file.filename}`;
        }
        // Gọi controller như cũ
        await ProductController.createProduct(req, res, next);
    })
);

//update 
router.patch('/:productId', asyncHandler(ProductController.updateProduct))

//delete
router.delete('/:productId', asyncHandler(productController.deleteProduct))


router.post('/publish/:id', asyncHandler(ProductController.publishProduct))
router.post('/unpublish/:id', asyncHandler(ProductController.unpublishProduct))


//query
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForOrganization))
router.get('/published/all', asyncHandler(productController.getAllPublishForOrganization))

module.exports = router