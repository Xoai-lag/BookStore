'use strict';
const mongoose = require('mongoose');

// Khai báo Schema cho mô hình MongoDB của Order (Đơn hàng)
var OrderSchema = new mongoose.Schema({  
    // OrderDate: Ngày đặt hàng, mặc định là ngày hiện tại
    OrderDate: {
        type: Date,
        default: Date.now
    },
    
    // Status: Trạng thái của đơn hàng, có thể là 'pending' (đang chờ), 'completed' (hoàn thành), hoặc 'cancelled' (bị hủy)
    Status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'  // Trạng thái mặc định là 'pending'
    },
    
    // TotalAmount: Tổng giá trị của đơn hàng, phải là một số không âm, mặc định là 0
    TotalAmount: {
        type: Number,
        min: 0,
        default: 0
    },
    
    // CustomerId: Tham chiếu đến mô hình Customer (Khách hàng), bắt buộc
    CustomerId: {
        type: String,
        ref: 'Customer',  // tham chiếu đến mô hình 'Customer'
        required: true
    }
}, { timestamps: true });  // Tự động thêm các trường 'createdAt' và 'updatedAt'

// Xuất mô hình để sử dụng ở các phần khác trong ứng dụng
module.exports = mongoose.model('Order', OrderSchema);
