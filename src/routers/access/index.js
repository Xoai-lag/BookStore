'use strict'
const express = require('express');  // Nhập thư viện Express
const accessController = require('../../controllers/access.controller');  // Nhập controller xử lý đăng ký
const  asyncHandler  = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();  // Tạo router mớiS

// Định nghĩa route POST cho việc đăng ký
router.post('/BookStore/SignUp', asyncHandler(accessController.SignUp));  // Khi gửi POST request tới /BookStore/SignUp, gọi hàm SignUp trong controller
router.post('/BookStore/Login', asyncHandler(accessController.login)); 

//authentication kiểm tra các thông tin trong header của client
//Middleware authentication được áp dụng cho tất cả các route được định nghĩa sau nó
router.use(authentication)

//Handler logout chỉ được chạy nếu middleware authentication gọi next() (tức là request được xác thực thành công).
router.post('/BookStore/Logout', asyncHandler(accessController.logout)); 
router.post('/BookStore/handlerRefreshToken', asyncHandler(accessController.handlerRefreshToken)); 


module.exports = router;  // Xuất router để sử dụng trong các module khác

//Nếu request vượt qua tất cả middleware, handler tương ứng sẽ được chạy.


