'use strict' // Bật chế độ nghiêm ngặt trong JavaScript
const express = require('express') // Nhập (require) thư viện express
const { apiKey, permission } = require('../auth/checkAuth')
const router = express.Router() // Tạo một đối tượng router của express

//check apikey
router.use(apiKey)

//check permission

router.use(permission('0000'))

router.use('/v1/api/discountCode', require('./discountCode'))
router.use('/v1/api/product', require('./product')) 
router.use('/v1/api', require('./access')) // Sử dụng (mount) router hoặc middleware từ file './access' cho đường dẫn '/v1/api'
module.exports = router; // Xuất (export) đối tượng router này để các phần khác của ứng dụng có thể sử dụng`