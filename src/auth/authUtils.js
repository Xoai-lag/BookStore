//authentication (xác thực)


'use strict' // Kích hoạt chế độ strict mode để tăng tính an toàn và giảm lỗi trong JavaScript



const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    CLIENT_ID: 'x-client-id',
    REFRESHTOKEN: 'x-rtoken-id'
}

const JWT = require('jsonwebtoken') // Import thư viện jsonwebtoken để tạo và xác minh token
const asyncHandler = require('../helpers/asyncHandler')
const { AuthFailureError, NotFoundError } = require('../core/error.response')

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

const authenticationV1 = asyncHandler(async (req, res, next) => {
    if (req.headers[HEADER.AUTHORIZATION]) {
        try {
            const accessToken = req.headers[HEADER.AUTHORIZATION]
            if (!accessToken) throw new AuthFailureError('Access Token Required!');
            const decodeUser = JWT.verify(accessToken, req.keyCustomer.publicKey)
            if (req.userId !== decodeUser.userId) throw new AuthFailureError('Invalid Id!')
            return next()
        } catch (error) {
            throw error
        }
    }
    return next()
})


const preAuthentication = asyncHandler(async(req,res,next)=>{
    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new AuthFailureError('Invalid Request!')

    const keyCustomer = await findByuserId(userId)
    if (!keyCustomer) throw new NotFoundError('Not Found KeyCustomer!')
    
    req.keyCustomer=keyCustomer
    req.userId=userId
    return next()
})

const authenticationV2 = asyncHandler(async (req, res, next) => {
    if (req.headers[HEADER.REFRESHTOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN]
            if (!refreshToken) throw new AuthFailureError('Refresh Token Required!');
            const decodeUser = JWT.verify(refreshToken, req.keyCustomer.privateKey)
            if (req.userId !== decodeUser.userId) throw new AuthFailureError('Invalid Id!')
            req.user = decodeUser
            req.refreshToken = refreshToken
            return next()
        } catch (error) {
            throw error
        }
    }
    return next()
})

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)
}

module.exports = { // Xuất hàm createTokenPair để sử dụng ở nơi khác
    createTokenPair,
    authenticationV1,
    authenticationV2,
    preAuthentication,
    verifyJWT
}