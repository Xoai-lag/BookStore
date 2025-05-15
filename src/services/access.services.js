'use strict' // Kích hoạt chế độ strict mode để tăng tính an toàn và giảm lỗi trong JavaScript

const CustomerModel = require("../models/Customer.Model") // Import CustomerModel để tương tác với collection Customer trong MongoDB
const bcrypt = require('bcrypt') // Import bcrypt để mã hóa mật khẩu
const crypto = require('crypto'); // Import crypto để tạo khóa ngẫu nhiên (privateKey, publicKey)
const keyTokenServices = require("./keyToken.services"); // Import keyTokenServices để lưu khóa vào database
const { createTokenPair } = require("../auth/authUtils"); // Import hàm createTokenPair để tạo cặp token (accessToken, refreshToken)
const { getInfoData } = require("../utils"); // Import hàm getInfoData để lọc dữ liệu trả về
const { BadRequestError, InternalServerError, AuthFailureError } = require("../core/error.response");


//services
const { findByEmail } = require("./customer.services");
const { token } = require("morgan");

class AccessServices { // Định nghĩa class AccessServices để chứa các dịch vụ liên quan đến truy cập

    /*
        check this token used
    */ 

        static handlerRefreshTokenV2 = async( {keyCustomer,user,refreshToken} )=>{
            const { userId,email } = user;
            if(keyCustomer.refreshTokensUsed.includes(refreshToken)){
                await keyTokenServices.deleteKeyByuserId(userId)
                throw new BadRequestError('Something Wrong Happend')
            }
            if(keyCustomer.refreshToken !== refreshToken) throw new AuthFailureError('Customer Not registered!')

            const foundCustomer = await findByEmail({email})
            if(!foundCustomer) throw new AuthFailureError('Shop Not Registered !')
             //Cấp lại cặp token mới bằng publicKey và privateKey
            const tokens = await createTokenPair({userId,email}, keyCustomer.publicKey,keyCustomer.privateKey) 
            await keyCustomer.updateOne({
                //Gán refreshToken mới vào dbs
                $set:{
                    refreshToken:tokens.refreshToken
                },
                // Thêm refreshToken cũ vào danh sách refreshTToken đã sử dụng 
                $addToSet:{
                    refreshTokensUsed:refreshToken
                }
            })
            return {
                user,
                tokens
            }
        }

    static logout = async(keyCustomer)=>{
        const delkeyCustomer = await keyTokenServices.removeKeyById(keyCustomer._id)
        console.log({delkeyCustomer})
        return delkeyCustomer
    }

    /*
    step 1- Check email in dbs
    step 2- match password
    step 3- Create AToken vs RToken and save
    step 4- generate tokens 
    step 5- get data return login
    */
    static login = async ({Email,Password,refreshToken=null})=>{
        try {
            //1
            const foundcustomer=await findByEmail({Email})
            if(!foundcustomer){
                throw new BadRequestError('Error: Email not found!')
            }

            //2
            const match = bcrypt.compare(Password,foundcustomer.Password)
            if(!match){
                throw new AuthFailureError('Error: Authentication error!')
            }

            //3
            const privateKey = crypto.randomBytes(64).toString('hex') 
            const publicKey = crypto.randomBytes(64).toString('hex') 


            //4
            const {_id:userId}=foundcustomer
            const tokens = await  createTokenPair({userId,Email:Email}, publicKey,privateKey) 
            await keyTokenServices.CreateKeyToken({
                userId,
                refreshToken :tokens.refreshToken,
                privateKey,publicKey,
            })
            //5
            return { 
                User:getInfoData({fields:['_id','UserName','Email','roles'],object:foundcustomer}),
                tokens 
            };
            } catch (error) {
                throw error
        }

    }


    static SignUp = async ({ Email, Password, UserName }) => { // Định nghĩa phương thức tĩnh SignUp để xử lý đăng ký người dùng
        try { // Bắt đầu khối try-catch để xử lý lỗi
            // Kiểm tra email đã tồn tại hay chưa
            const userEmail = await CustomerModel.findOne({ Email }).lean(); // Tìm kiếm người dùng trong database dựa trên Email
            if (userEmail) { // Nếu email đã tồn tại
                throw new BadRequestError('Error: Shop already registered!')
            }

            // Mã hóa mật khẩu
            const passwordHash = await bcrypt.hash(Password, 10); // Mã hóa mật khẩu người dùng với độ dài salt là 10

            // Tạo tài khoản mới
            const newAccount = await CustomerModel.create({ // Tạo tài khoản mới trong database
                UserName, 
                Email,   
                Password: passwordHash, // Lưu mật khẩu đã mã hóa
                roles: ['customer'] // Gán vai trò mặc định là 'customer'
            });
            if(newAccount){ // Nếu tài khoản được tạo thành công
                //create private key,bublic key

                const privateKey = crypto.randomBytes(64).toString('hex') // Tạo privateKey ngẫu nhiên (64 bytes, mã hóa hex)
                const publicKey = crypto.randomBytes(64).toString('hex') // Tạo publicKey ngẫu nhiên (64 bytes, mã hóa hex)
              
                const keyUser = await keyTokenServices.CreateKeyToken({ // Lưu cặp khóa privateKey, publicKey vào database
                    userId:newAccount._id,
                    publicKey,
                    privateKey
                })

                if(!keyUser){ // Nếu lưu khóa thất bại
                    throw new InternalServerError('Error: keyUser error!')
                }

                const tokens = await createTokenPair({userId:newAccount._id,email:Email}, publicKey,privateKey) // Tạo cặp token (accessToken, refreshToken)
                console.log(`Create Tokens Success::`,tokens) // Ghi log thông báo tạo token thành công
                // Trả về thông tin tài khoản mới (hoặc có thể thêm token nếu cần thiết)
                return { // Trả về phản hồi thành công
                    code: '20000',
                    message: 'Đăng ký người dùng thành công!',
                    metadata:{
                        User:getInfoData({fields:['_id','UserName','Email'],object:newAccount}), // Lọc thông tin người dùng để trả về
                        tokens // Trả về cặp token
                    }
                };
            }
            return { // Trả về nếu không tạo được tài khoản
                code:200,
                metadata:null
            }     
        } catch (ex) { // Xử lý lỗi nếu có
            if (ex instanceof BadRequestError) { // Nếu lỗi là BadRequestError 
                throw ex; 
            } else if (ex instanceof InternalServerError) { // Nếu lỗi là InternalServerError 
                throw ex; 
            } else { 
                throw new InternalServerError(`Error: ${ex.message}`); // Ném InternalServerError cho lỗi không xác định
            }
        }
    };
}

module.exports = AccessServices; // Xuất class AccessServices để sử dụng ở nơi khác