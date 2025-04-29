'use strict' // Kích hoạt chế độ strict mode để tăng tính an toàn và giảm lỗi trong JavaScript



const HEADER={
    API_KEY : 'x-api-key',
    AUTHORIZATION:'authorization',
    CLIENT_ID:'x-client-id',
}

const JWT = require('jsonwebtoken') // Import thư viện jsonwebtoken để tạo và xác minh token
const asyncHandler = require('../helpers/asyncHandler')
const { BadRequestError, AuthFailureError, NotFoundError } = require('../core/error.response')

//services
const { findByuserId } = require('../services/keyToken.services')
const { token } = require('morgan')

const createTokenPair = async (payload, publicKey, privateKey) => { // Định nghĩa hàm createTokenPair để tạo cặp accessToken và refreshToken
    try { // Bắt đầu khối try-catch để xử lý lỗi
        // access token
        const accessToken = await JWT.sign(payload, publicKey, { // Tạo accessToken với payload và publicKey
            expiresIn: '2 days' // AccessToken hết hạn sau 2 ngày
        })

        const refreshToken = await JWT.sign(payload, privateKey, { // Tạo refreshToken với payload và privateKey
            expiresIn: '7 days' // RefreshToken hết hạn sau 7 ngày
        })

        JWT.verify(accessToken, publicKey, (err, decode) => { // Xác minh accessToken bằng publicKey
            if (err) { // Nếu có lỗi khi xác minh
                console.error(`error verify::`, err) // Ghi log lỗi
            } else { // Nếu xác minh thành công
                console.log(`decode verify::`, decode) // Ghi log dữ liệu đã giải mã
            }
        })

        return { accessToken, refreshToken } // Trả về cặp accessToken và refreshToken
    } catch (error) { // Xử lý lỗi nếu có (khối catch hiện tại để trống)
        
    }
}

const authentication = asyncHandler(async(req,res,next)=>{
    /*
    step:
    1. check userId missing 
    2. get accessToken
    3. verifyToken
    4. check user in dbs
    5. check keyCustomer with this userId
    6. Ok all => return next
    */

    //1
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new AuthFailureError('Invalid Request!')

    //2
    const keyCustomer = await findByuserId(userId)
    if(!keyCustomer) throw new NotFoundError('Not Found KeyCustomer!')
    
    //3
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError('Invalid Request!')

    //4
    try {
        const decodeUser = JWT.verify(accessToken,keyCustomer.publicKey)
        if(userId!==decodeUser.userId) throw new AuthFailureError('Invalid Id!')
        req.keyCustomer = keyCustomer
        return next()
    } catch (error) {
        throw error
    }
})

const verifyJWT = async (token, keySecret)=>{
    return await JWT.verify(token,keySecret)
}

module.exports = { // Xuất hàm createTokenPair để sử dụng ở nơi khác
    createTokenPair,
    authentication,
    verifyJWT
}