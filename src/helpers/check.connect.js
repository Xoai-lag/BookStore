'use strict'

const mongoose = require('mongoose');
const os = require('os');
const process = require('process');

const _SECONDS = 5000; // Kiểm tra mỗi 5 giây

// Hàm đếm số lượng kết nối hiện tại
const countConnect = () => {
    const numberConnection = mongoose.connections.length;  // Lấy số lượng kết nối hiện tại
    console.log(`Number of connection: ${numberConnection}`);
};

// Hàm kiểm tra tình trạng quá tải kết nối
const checkOverLoad = () => {
    setInterval(() => {
        const numberConnection = mongoose.connections.length;  // Lấy số lượng kết nối hiện tại
        const numCores = os.cpus().length;  // Số lõi CPU của hệ thống
        const memoryUsage = process.memoryUsage().rss;  // Sử dụng bộ nhớ của tiến trình Node.js

        // Tính toán giới hạn kết nối tối đa dựa trên số lõi CPU (mỗi lõi có thể xử lý tối đa 5 kết nối)
        const maxConnection = numCores * 5;

        console.log(`Active connections: ${numberConnection}`);
        console.log(`Memory Usage: ${memoryUsage / 1024 / 1024} MB`);  // In ra bộ nhớ sử dụng tính theo MB

        // Kiểm tra nếu số kết nối vượt quá giới hạn
        if (numberConnection > maxConnection) {
            console.log('Connection OverLoad detected!');
        }
    }, _SECONDS);  // Kiểm tra mỗi 5 giây
};

// Xuất các hàm để sử dụng ở các module khác
module.exports = {
    countConnect,
    checkOverLoad
};
