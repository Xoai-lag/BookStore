'use strict'

const mongoose = require('mongoose');

// Định nghĩa Schema cho Thanh Toán
var PaymentSchema = new mongoose.Schema({  
    // OrderId: Tham chiếu đến mô hình Order (Đơn hàng), bắt buộc
    OrderId: {
        type: String,
        ref: 'Order',  // tham chiếu đến mô hình 'Order'
        required: true
    },
    
    // PaymentDate: Ngày thanh toán, mặc định là ngày hiện tại
    PaymentDate: {
        type: Date,
        default: Date.now
    },
    
    // Amount: Số tiền thanh toán, phải là một số không âm
    Amount: {
        type: Number,
        min: 0,
        required: true
    },
    
    // Method: Phương thức thanh toán, có thể là 'cash' (tiền mặt), 'card' (thẻ), hoặc 'online' (trực tuyến)
    Method: {
        type: String,
        enum: ['cash', 'card', 'online'],  // Tiền mặt, thẻ, trực tuyến
        default: 'cash'
    },
    
    // Status: Trạng thái thanh toán, có thể là 'completed' (hoàn thành), 'pending' (đang xử lý), hoặc 'failed' (thất bại)
    Status: {
        type: String,
        enum: ['completed', 'pending', 'failed'],  // Hoàn thành, đang xử lý, thất bại
        default: 'pending'
    }
}, {
    timestamps: true  // Tự động thêm các trường 'createdAt' và 'updatedAt'
});

// Xuất mô hình để sử dụng ở các phần khác trong ứng dụng
module.exports = mongoose.model('Payment', PaymentSchema);
