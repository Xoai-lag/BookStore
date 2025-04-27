
'use strict'

const mongoose=require('mongoose')
const {db:{host,port,name}} = require('./../configs/configs.mongodb')

const connectString = `mongodb://${host}:${port}/${name}`



class Database{
    constructor(){

        // phương thức this.connect() được gọi để thực hiện kết nối ngay khi tạo đối tượng Database.
        this.connect()
    }
    
    //connect
    connect(type ='mongodb'){
        if(1===1){//neu la dev enviroment
            // Câu lệnh mongoose.set('debug', true) và mongoose.set('debug', { color: true }) giúp hiển thị thông tin debug khi thực hiện các thao tác với MongoDB.
            mongoose.set('debug',true)
            mongoose.set('debug',{color:true})
        }

        // Dùng để thực hiện kết nối tới MongoDB bằng cách gọi mongoose.connect(connectString). Nếu kết nối thành công, sẽ in ra Connected MongoDB Success, nếu có lỗi sẽ in ra Error connect!
        mongoose.connect(connectString).then(_=>console.log('Connected MongoDB Success ')).catch(err=>console.log('Error connect!'))
    }
    //Instance : ket noi db
    // Pattern Singleton: Phương thức getInstance đảm bảo chỉ có một instance duy nhất của đối tượng Database trong ứng dụng. Nếu đã có instance, nó sẽ trả về instance đó, nếu chưa, nó sẽ tạo một instance mới.
    static getInstance(){
        if(!Database.instance){
            Database.instance=new Database()
        }
        return Database.instance
    }
}
const instanceMongoDB = Database.getInstance()
module.exports=instanceMongoDB