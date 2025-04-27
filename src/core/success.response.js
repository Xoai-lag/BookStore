'use strict'

// Success (Thành công)
// 200 OK: Yêu cầu thành công.
// 201 Created: Tài nguyên đã được tạo thành công.
// 204 No Content: Yêu cầu thành công nhưng không có nội dung trả về.

const StatusCode ={
    OK:200,
    CREATED:201
}

const ReasonStatusCode ={
    OK:'Success',
    CREATED:'Created!'
}



class SuccessResponse{
    constructor({message,statusCode= StatusCode.OK,reasonStatusCode = ReasonStatusCode.OK, metadata = {}}){
        this.message=!message ? reasonStatusCode : message
        this.status = statusCode
        this.metadata = metadata
    }

    send(res, headers ={}){
        return res.status(this.status).json(this)
    }
}
class OK extends SuccessResponse {
    constructor({message,metadata}){
        super({message,metadata})
    }
}
class Created extends SuccessResponse {
    constructor({/*Options={} */ message,statusCode = StatusCode.CREATED,reasonStatusCode = ReasonStatusCode.CREATED,metadata}){
        super({message,statusCode,reasonStatusCode,metadata})
        //this.options = Options
    }
}
module.exports={
    OK,
    Created,
    SuccessResponse
}