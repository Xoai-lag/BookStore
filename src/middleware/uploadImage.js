const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Đảm bảo thư mục images mới tồn tại
const dir = 'd:/download/BookStore/public/images';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = Date.now() + ext;
        cb(null, filename);
    }
});

const upload = multer({ storage });

module.exports = upload;