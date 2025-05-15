const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Đảm bảo thư mục images tồn tại
const dir = path.join(__dirname, '../../images');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
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