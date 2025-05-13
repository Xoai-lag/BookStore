'use strict'

// khởi tạo queue sử dụng bull 
const Queue = require('bull');

// tạo queue có tên status
const orderStatusQueue = new Queue('order-status', {

    // kết nối với redis 
    redis: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379
    }
});

module.exports = orderStatusQueue