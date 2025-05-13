'use strict';

const orderStatusQueue = require('../queues/orderStatus.queue');
const checkoutService = require('../services/checkout.services');
const mongoose = require('mongoose');
const { db: { host, port, name } } = require('../configs/configs.mongodb');

console.log('Worker for order status queue started...');

const connectString = `mongodb://${host}:${port}/${name}`

orderStatusQueue.process(async (job, done) => {
  try {
    // Kiểm tra và mở kết nối MongoDB nếu chưa có
    if (mongoose.connection.readyState !== 1) {
      console.log('Reconnecting to MongoDB...');
      await mongoose.connect(connectString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        autoIndex: true,
        retryWrites: true,
        retryReads: true,
      });
      console.log('MongoDB reconnected successfully!');
    }

    const { orderId, targetStatus } = job.data;
    const result = await checkoutService.updateOrderStatusByAdmin(orderId, targetStatus);
    done(null, result); // Thành công
  } catch (err) {
    console.error(`orderStatusQueue: Job ${job.id} for order ${job.data.orderId} failed:`, err);
    done(err); // Thất bại
  }
});

// Xử lý sự kiện ngắt kết nối
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected! Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected!');
});