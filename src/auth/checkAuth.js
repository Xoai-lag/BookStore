'use strict'

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

const { BadRequestError } = require('../core/error.response')
const { findById } = require('../services/apiKey.services') // Đổi tên file nếu cần

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        if (!key) throw new BadRequestError('Error: Forbidden Error!')

        const apiKey = await findById(key)
        if (!apiKey) throw new BadRequestError('Error: Forbidden Error!')

        req.apiKey = apiKey
        return next()
    } catch (error) {
        return next(error)
    }
}

const permission = (permission) => {
    return (req, res, next) => {
        if (!req.apiKey.permissions) {
            throw new BadRequestError('Error: Permission Denied!')
        }

        console.log('permissions::', req.apiKey.permissions)
        const hasPermission = req.apiKey.permissions.includes(permission)

        if (!hasPermission) {
            throw new BadRequestError('Error: Permission Denied!')
        }

        return next()
    }
}

module.exports = { apiKey, permission }
