'use strict'


const { model, Schema } = require('mongoose'); // Erase if already required
const { schema } = require('./discount.Model');

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'

// Declare the Schema of the Mongo model
var cartSchema = new Schema({
    cart_state: {
        type: String,
        required: true,
        enum: ['active', 'completed', 'failed', 'pending'],
        default: 'active'
    },
    cart_products: {
        type: Array,
        required: true,
        default: []
    },
    /*
        productId,
        quantity,
        name,
        price
    */
    cart_count_product: {// so luong san pham trong gio hang
        type: Number,
        default: 0
    },
    cart_userId: { type: Schema.Types.ObjectId , required: true, ref:'Customer' }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = {cart:model(DOCUMENT_NAME, cartSchema)}