'use strict';
const mongoose = require('mongoose');

// Khai báo Schema cho mô hình MongoDB của Customer (Khách hàng)
var CustomerSchema = new mongoose.Schema({
    // UserName: Tên người dùng, bắt buộc và không được trùng
    UserName: {
        type: String,
        required: true,
        trim: true
    },
    
    // Phone: Số điện thoại của khách hàng, có thể để trống
    Phone: {
        type: String,
        trim: true
    },
    
    // Email: Địa chỉ email của khách hàng, phải là duy nhất
    Email: {
        type: String,
        trim: true,
    },
    
    // Password: Mật khẩu của khách hàng, bắt buộc, ít nhất 6 ký tự, không được truy xuất khi lấy dữ liệu
    Password: {
        type: String,
        required: true,
        minlength: 6,
        select: false  // mật khẩu sẽ không được chọn khi truy vấn
    },
    
    // Address: Địa chỉ của khách hàng, có thể để trống
    Address: {
        type: String,
        trim: true
    },
    
    // JoinDate: Ngày tham gia của khách hàng, mặc định là thời gian hiện tại
    JoinDate: {
        type: Date,
        default: Date.now
    },
    
    // roles: Các vai trò của khách hàng, có thể là 'customer', 'admin', hoặc 'manager', mặc định là 'customer'
    roles: {
        type: [String],
        enum: ['customer', 'admin', 'manager'],
        default: ['customer']
    },
}, { timestamps: true });  // Tự động thêm các trường 'createdAt' và 'updatedAt'

// Xuất mô hình để sử dụng ở các phần khác trong ứng dụng
module.exports = mongoose.model('Customer', CustomerSchema);
