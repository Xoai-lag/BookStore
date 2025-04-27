'use strict';
const mongoose = require('mongoose');

// Định nghĩa Schema cho Báo cáo (Report)
var ReportSchema = new mongoose.Schema({  
    // Type: Loại báo cáo, bắt buộc nhập
    Type: {
        type: String,
        required: true,
        trim: true  // loại bỏ khoảng trắng ở đầu và cuối
    },
    
    // StartDate: Ngày bắt đầu của báo cáo, bắt buộc nhập
    StartDate: {
        type: Date,
        required: true
    },
    
    // EndDate: Ngày kết thúc của báo cáo, bắt buộc nhập
    EndDate: {
        type: Date,
        required: true
    }
}, { timestamps: true });  // Tự động thêm các trường 'createdAt' và 'updatedAt'

// Xuất mô hình để sử dụng ở các phần khác trong ứng dụng
module.exports = mongoose.model('Report', ReportSchema);
