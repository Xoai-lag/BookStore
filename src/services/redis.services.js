'use strict'
// đoạn này phải cài redis : https://github.com/microsoftarchive/redis/releases
const { resolve } = require('path')
const redis = require('redis') // dùng thư viện lưu trữ redis kiểu key-value 
const { reservationInventory, increasestock } = require('../models/repositories/inventory.repo')
const redisClient = redis.createClient()

// kết nối với redis bắt buộc với redis V5
redisClient.connect().catch(err => console.error('Redis Client Connection Error:', err));


// Xử lý lỗi Redis
redisClient.on('error', err => console.error('Redis Client Error:', err))


// Chuyển các hàm pexpire và setnx của redisclient sang async gắn .bind(redisClient) vào để chắc chắn biến this sau khi
// chuyển đổi hàm từ callback sang promise sẽ luôn chính xác ở V4 phải làm 


// Không cần promisify, các lệnh đã là Promise trong v5

const acquireLock = async ({ productId, cartId, quantity, method, orderId }) => {
    const key = `lock_v2025_${productId}` //tạo tên khóa key 

    // cho phép thử lại 10 lần 
    const retryTime = 10;

    const expireTime = 5000;

    const retryDelay = 100;



    for (let i = 0; i < retryTime; i++) {

        // Kiểm tra xem khóa có tồn tại và hết hạn hay không
        const existingTTL = await redisClient.pTTL(key);

        if (existingTTL <= 0 && existingTTL !== -2) {
            // Khóa tồn tại nhưng không có TTL, xóa khóa bị kẹt

            // >0 TTL còn hiệu lực (key sẽ hết hạn sau X ms)
            // 0 TTL đã hết, nhưng Redis chưa xóa key
            // -1 Key tồn tại nhưng không có TTL (vô hạn) ❗
            // -2 Key không tồn tại trong Redis


            await redisClient.del(key);
            console.log(`Cleared stale lock: ${key}`);
        }

        // đặt value cho tên key, thằng nào nắm giữ được vào thanh toán 
        const result = await redisClient.setNX(key, '');

        console.log(`result:::`, result)

        if (result === 1) { //lấy key thành công


            await redisClient.pExpire(key, expireTime)

            // thao tác với inventory 
            if (method === 'reservation') {
                const isReservation = await reservationInventory({ productId, quantity, cartId })
                if (isReservation.modifiedCount) {
                    return key;
                } else {
                    await releaseLock(key);
                    return null;
                }
            }
            if (method === 'increasestock') {
                const isIncrease = await increasestock({ productId, quantity, orderId })
                if (isIncrease.modifiedCount) {
                    return key
                } else {
                    await releaseLock(key);
                    return null;
                }
            }
        } else {
            await new Promise((resolve) => setTimeout(resolve, retryDelay)) // chờ 50 giây trước khi tiếp tục dòng for 
        }
    }

    return null;
}

const releaseLock = async keyLock => {

    // const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    // Không cần promisify, các lệnh đã là Promise trong v5

    return await redisClient.del(keyLock)
}

module.exports = {
    acquireLock,
    releaseLock
}