'use strict';
const mongoose = require('mongoose');

// Khai báo Schema cho mô hình MongoDB của Inventory (Kho)
var InventorySchema = new mongoose.Schema({
    // BookId: Tham chiếu đến mô hình Book (Sách), bắt buộc
    BookId: {
        type: String,
        ref: 'Book',  // tham chiếu đến mô hình 'Book'
        required: true
    },
    
    // AvailableQuantity: Số lượng sách có sẵn trong kho, phải là một số không âm, mặc định là 0
    AvailableQuantity: {
        type: Number,
        min: 0,
        default: 0
    },
    
    // MinThreshold: Ngưỡng tối thiểu số lượng sách cần có trong kho, phải là một số không âm, mặc định là 0
    MinThreshold: {
        type: Number,
        min: 0,
        default: 0
    }
}, { timestamps: true });  // Tự động thêm các trường 'createdAt' và 'updatedAt'

// Xuất mô hình để sử dụng ở các phần khác trong ứng dụng
module.exports = mongoose.model('Inventory', InventorySchema);
