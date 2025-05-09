//cấu hình


'use strict'

// Cấu hình cho môi trường phát triển (dev)
const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3052  // Cổng ứng dụng, nếu không có, mặc định là 3052
    },
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',  // Địa chỉ máy chủ cơ sở dữ liệu, nếu không có, mặc định là 'localhost'
        port: process.env.DEV_DB_PORT || 27017,  // Cổng cơ sở dữ liệu, mặc định là 27017 (MongoDB)
        name: process.env.DEV_DB_NAME || 'BookStore'  // Tên cơ sở dữ liệu, mặc định là 'BookStore'
    }
}

// Cấu hình cho môi trường sản xuất (pro)
const pro = {
    app: {
        port: process.env.PRO_APP_PORT || 3000  // Cổng ứng dụng, nếu không có, mặc định là 3000
    },
    db: {
        host: process.env.PRO_DB_HOST || 'localhost',  // Địa chỉ máy chủ cơ sở dữ liệu, nếu không có, mặc định là 'localhost'
        port: process.env.PRO_DB_PORT || 27017,  // Cổng cơ sở dữ liệu, mặc định là 27017 (MongoDB)
        name: process.env.PRO_DB_NAME || 'ProBookStore'  // Tên cơ sở dữ liệu, mặc định là 'ProBookStore'
    }
}

// Cấu hình chung cho các môi trường
const config = { dev, pro }

// Xác định môi trường hiện tại (default là 'dev')
const env = process.env.NODE_ENV || 'dev'

// Xuất cấu hình phù hợp với môi trường hiện tại
module.exports = config[env]
