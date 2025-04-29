'use strict' // Kích hoạt chế độ strict mode để tăng tính an toàn và giảm lỗi trong JavaScript

const {Types} =require('mongoose')
const { filter, update } = require("lodash")
const KeyTokenModel = require("../models/KeyToken.Model") // Import KeyTokenModel để tương tác với collection keyTokens trong MongoDB

class keyTokenServices { // Định nghĩa class keyTokenServices để chứa các dịch vụ liên quan đến quản lý khóa
    static CreateKeyToken = async ({ userId, publicKey, privateKey,refreshToken }) => { // Định nghĩa phương thức tĩnh CreateKeyToken để tạo và lưu khóa cho người dùng
        try { 
            const filter ={user:userId}, update={
                userId,
                publicKey,
                privateKey,
                refreshTokensUsed:[],
                refreshToken
            }, options ={upsert:true, new:true}
            const token= await KeyTokenModel.findOneAndUpdate(filter,update,options)
            return token ? token.publicKey : null
        } catch (error) { // Xử lý lỗi nếu có
            return error // Trả về lỗi nếu quá trình tạo thất bại
        }
    }

    static findByuserId = async(userId)=>{
        return await KeyTokenModel.findOne({user: new Types.ObjectId(userId)}).lean()
    }

    static removeKeyById = async(id)=>{
        return await KeyTokenModel.deleteMany(id)
    }
    static findByRefreshTokenUsed = async(refreshToken)=>{
        return await KeyTokenModel.findOne({
            refreshTokensUsed:refreshToken
        }).lean()
    }
    static findByRefreshToken = async(refreshToken)=>{
        return await KeyTokenModel.findOne({refreshToken})
    }
    static deleteKeyByuserId = async(userId)=>{
        return await KeyTokenModel.findOneAndDelete({user:userId})
    }
}

module.exports = keyTokenServices // Xuất class keyTokenServices để sử dụng ở nơi khác