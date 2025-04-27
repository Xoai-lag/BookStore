'use strict';
const mongoose = require('mongoose');

// Định nghĩa Schema cho Nhân viên (Staff)
var StaffSchema = new mongoose.Schema({  
    // Name: Tên của nhân viên, bắt buộc nhập
    Name: {
        type: String,
        required: true,
        trim: true  // loại bỏ khoảng trắng ở đầu và cuối
    },
    
    // Role: Vai trò của nhân viên, có thể là "admin", "manager", "staff" hoặc vai trò khác
    Role: {
        type: String,
        trim: true  // loại bỏ khoảng trắng ở đầu và cuối
    },
    
    // Password: Mật khẩu của nhân viên, bắt buộc nhập
    Password: {
        type: String,
        required: true,
        trim: true  // loại bỏ khoảng trắng ở đầu và cuối
    },
    
    // Address: Địa chỉ của nhân viên
    Address: {
        type: String,
        trim: true  // loại bỏ khoảng trắng ở đầu và cuối
    }
}, { timestamps: true });  // Tự động thêm các trường 'createdAt' và 'updatedAt'

// Xuất mô hình để sử dụng ở các phần khác trong ứng dụng
module.exports = mongoose.model('Staff', StaffSchema);
