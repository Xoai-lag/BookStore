'use strict'

const mongoose = require('mongoose');

// Khai báo Schema cho mô hình MongoDB của Book
var BookSchema = new mongoose.Schema({
    // BookTitle: Tiêu đề của sách, phải là duy nhất
    BookTitle: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    
    // Author: Tên tác giả của sách, có thể để trống
    Author: {
        type: String,
        trim: true
    },
    
    // Publisher: Nhà xuất bản của sách, có thể để trống
    Publisher: {
        type: String,
        trim: true
    },
    
    // PublishYear: Năm xuất bản sách, phải là một số không âm
    PublishYear: {
        type: Number,
        min: 0
    },
    
    // Price: Giá của sách, phải là một số không âm
    Price: {
        type: Number,
        min: 0
    },
    
    // Quantity: Số lượng sách còn lại trong kho, phải là một số không âm
    Quantity: {
        type: Number,
        min: 0
    },
    
    // Status: Trạng thái khả dụng của sách, có thể là 'available' (có sẵn) hoặc 'unavailable' (hết)
    Status: {
        type: String,
        enum: ['available', 'unavailable'],
        default: 'available'  // Trạng thái mặc định là 'available'
    },
    
    // CategoryId: Tham chiếu đến mô hình Category, bắt buộc
    CategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',  // tham chiếu đến mô hình 'Category'
        required: true
    },
    
    // InventoryId: Tham chiếu đến mô hình Inventory, bắt buộc
    InventoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',  // tham chiếu đến mô hình 'Inventory'
        required: true
    }
}, {
    timestamps: true  // Tự động thêm các trường 'createdAt' và 'updatedAt'
});

// Xuất mô hình để sử dụng ở các phần khác trong ứng dụng
module.exports = mongoose.model('Book', BookSchema);
