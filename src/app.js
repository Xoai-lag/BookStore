const compression = require('compression')
require('dotenv').config()
const { default: helmet } = require('helmet')
const express = require('express')
const morgan = require('morgan')
const app = express()

// Thiết lập middleware morgan để ghi lại các yêu cầu HTTP trong khi phát triển.
app.use(morgan("dev"))

// Thiết lập helmet để bảo vệ ứng dụng khỏi một số mối đe dọa bảo mật phổ biến bằng cách thiết lập các header HTTP an toàn.
app.use(helmet())

// Sử dụng compression để nén các phản hồi HTTP, giúp giảm tải băng thông và tăng tốc độ phản hồi cho người dùng.
app.use(compression())

// Cho phép CORS nếu ứng dụng cần hỗ trợ yêu cầu từ các miền khác.
const cors = require('cors')
app.use(cors())

// Khởi tạo cơ sở dữ liệu MongoDB
require('./dbs/init.mongodb.js')

// Kiểm tra số lượng kết nối và tình trạng quá tải
// const { countConnect } = require('./helpers/check.connect')
// countConnect()

// const { checkOverLoad } = require('./helpers/check.connect')
// checkOverLoad()


app.use(express.json());
app.use(express.urlencoded({
  extended:true
}))

// Khởi tạo các route
app.use('', require('./routers'))

// Xử lý lỗi - middleware để xử lý các lỗi xảy ra trong ứng dụng
app.use((req,res,next)=>{
  const error = new Error('Not Found')
  error.stack = 404
  next(error)
})
app.use((error,req,res,next)=>{
  const statusCode = error.status ||500
  return res.status(statusCode).json({
    status:'error',
    code: statusCode,
    // stack:error.stack,
    message: error.message || 'Internal Server Error'
  })
})



app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    code: '50000',
    message: 'Internal Server Error',
    status: 'error',
  })
})

// Xử lý lỗi 404 cho các route không hợp lệ
app.use((req, res, next) => {
  res.status(404).json({
    code: '40400',
    message: 'Route not found',
    status: 'error',
  })
})

module.exports = app
