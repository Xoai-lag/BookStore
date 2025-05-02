'use strict'

const { BadRequestError } = require('../core/error.response')
const {findByUserId} = require('../services/customer.services')

const restrictToAdmin = async(req,res,next)=>{
    try {
        const userId = req.userId
        if(!userId) throw new BadRequestError('Error user ID Not Found!')
        const admin = await findByUserId(userId)
        if(!admin) throw new BadRequestError('Error ID Not Found!')
        if(!admin.roles || !admin.roles.includes('admin')) throw new BadRequestError('Error: Admin access required!')
        return next()
    } catch (error) {
        next(error)
    }
}
module.exports={
    restrictToAdmin
}