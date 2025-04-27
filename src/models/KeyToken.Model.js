'use strict' // Kích hoạt chế độ strict mode để tăng tính an toàn và giảm lỗi trong JavaScript

const { Schema, model } = require('mongoose'); // Import Schema và model từ Mongoose để định nghĩa schema và tạo model

// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema({ // Định nghĩa schema keyTokenSchema để mô tả cấu trúc document trong MongoDB
    user: { // Định nghĩa trường user để lưu ID người dùng
        type: Schema.Types.ObjectId, // Kiểu dữ liệu là ObjectId, dùng để lưu ID duy nhất
        required: true, // Trường bắt buộc, không được để trống
        ref: 'Customer', // Tham chiếu đến collection Customer để liên kết dữ liệu
    },
    privateKey: { // Định nghĩa trường privateKey để lưu khóa bí mật
        type: String, // Kiểu dữ liệu là chuỗi
        required: true, // Trường bắt buộc, không được để trống
    },
    publicKey: { // Định nghĩa trường publicKey để lưu khóa công khai
        type: String, // Kiểu dữ liệu là chuỗi
        required: true, // Trường bắt buộc, không được để trống
    },
    refreshTokensUsed: { //Những refreshTokens đã được sử dụng 
        type: Array, 
        default: [], // Giá trị mặc định là mảng rỗng nếu không có giá trị
    },
    refreshToken:{
        type: String,
        required:true,     
    },
}, {
    collection: 'keyTokens', // Xác định tên collection trong MongoDB là keyTokens
    timestamps: true // Tự động thêm trường createdAt và updatedAt để theo dõi thời gian
});

// Export the model
module.exports = model('KeyToken', keyTokenSchema); // Tạo model KeyToken từ schema để tương tác với collection keyTokens