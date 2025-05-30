// utility (tiện ích)


'use strict'

const _ = require('lodash')
const { default: mongoose } = require('mongoose')
const { BadRequestError } = require('../core/error.response')
const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}

//['name','price'] = {name:1,price:1}
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}


const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}


const removeUndefinedObject = obj => {
    Object.keys(obj).forEach(k => {
        if (obj[k] && typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
            obj[k] = removeUndefinedObject(obj[k])
        } else if (obj[k] == null) {
            delete obj[k]
        }
    })
    return obj
}

const updateNestedObjectParser = obj => {
    const final = {}
    Object.keys(obj).forEach(k => {
        if (typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
            const response = updateNestedObjectParser(obj[k])
            Object.keys(response).forEach(a => {
                final[`${k}.${a}`] = response[a]
            })
        } else {
            final[k] = obj[k]
        }
    })

    return final
}

const convertToObjectIdMongodb = (id)=>{
    if(mongoose.Types.ObjectId.isValid(id)){
        return new mongoose.Types.ObjectId(id)
    }
    throw new BadRequestError('Invalid ObjectId format');
}

module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
    convertToObjectIdMongodb
}

