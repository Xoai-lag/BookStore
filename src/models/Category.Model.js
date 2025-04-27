'use strict';
const mongoose = require('mongoose');

// Khai báo Schema cho mô hình MongoDB của Category (Danh mục)
var CategorySchema = new mongoose.Schema({
    // NameCategory: Tên của danh mục, phải là duy nhất
    NameCategory: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    
    // Description: Mô tả về danh mục, có thể để trống
    Description: {
        type: String,
        trim: true
    }
}, { timestamps: true });  // Tự động thêm các trường 'createdAt' và 'updatedAt'

// Xuất mô hình để sử dụng ở các phần khác trong ứng dụng
module.exports = mongoose.model('Category', CategorySchema);
