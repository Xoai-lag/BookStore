'use strict';
const mongoose = require('mongoose');

// Khai báo Schema cho mô hình MongoDB của OrderItem (Mặt hàng trong đơn hàng)
var OrderItemSchema = new mongoose.Schema({  
    // OrderId: Tham chiếu đến mô hình Order (Đơn hàng), bắt buộc
    OrderId: {
        type: String,
        ref: 'Order',  // tham chiếu đến mô hình 'Order'
        required: true
    },
    
    // BookId: Tham chiếu đến mô hình Book (Sách), bắt buộc
    BookId: {
        type: String,
        ref: 'Book',  // tham chiếu đến mô hình 'Book'
        required: true
    },
    
    // Quantity: Số lượng sách trong mặt hàng đơn hàng, phải là một số lớn hơn hoặc bằng 1
    Quantity: {
        type: Number,
        min: 1,
        required: true
    },
    
    // Price: Giá của sách trong mặt hàng, phải là một số không âm
    Price: {
        type: Number,
        min: 0,
        required: true
    }
}, { timestamps: true });  // Tự động thêm các trường 'createdAt' và 'updatedAt'

// Xuất mô hình để sử dụng ở các phần khác trong ứng dụng
module.exports = mongoose.model('OrderItem', OrderItemSchema);
