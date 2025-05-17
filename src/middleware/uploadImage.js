'use strict'

const multer = require('multer');
// thư viện Multer, dùng để xử lý file upload trong Express.

// thư viện path của Node.js, dùng để xử lý đường dẫn file và tách phần mở rộng 
const path = require('path');


const fs = require('fs');
//  thư viện fs (file system), dùng để kiểm tra và tạo thư mục nếu chưa có.



// Đảm bảo thư mục images mới tồn tại
const dir = 'd:/download/BookStore/public/images';

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    //recursive: true cho phép tạo cả đường dẫn cha nếu cần thiết.
}


// Khởi tạo multer với kiểu lưu trên ổ đĩa (disk storage).
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Chỉ định thư mục đích để lưu ảnh.


        cb(null, dir);
        //cb(null, dir) nghĩa là không có lỗi (null) và lưu vào thư mục dir.
    },


    //  Chỉ định tên file sau khi lưu:
    filename: (req, file, cb) => {


        const ext = path.extname(file.originalname);
        // file.originalname là tên file gốc của người dùng.
        // path.extname() lấy phần mở rộng (đuôi file), ví dụ: .jpg, .png


        const filename = Date.now() + ext;
        // tạo theo timestamp để tránh trùng tên 
        

        cb(null, filename);
    }
});

const upload = multer({ storage });
//  Tạo biến upload, dùng trong các route để xử lý upload 1 hoặc nhiều file.

module.exports = upload;