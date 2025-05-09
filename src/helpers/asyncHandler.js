//các hàm, lớp hoặc module phụ trợ có chức năng giúp đỡ 


const asyncHandler = fn =>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next)
    }
}
module.exports=asyncHandler
