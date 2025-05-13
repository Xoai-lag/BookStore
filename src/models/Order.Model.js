'use strict'

const { model, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'

// Declare the Schema of the Mongo model
var OrderSchema = new Schema({
    order_userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Customer'
    },
    order_checkout: {
        type: Object,
        default: {},
    },
    /*
        order_checkout:{
            totalPrice,
            totalDiscount,
            feeship,
            totalCheckout
        }
    */
    order_shipping: {
        type: Object,
        default: {},
    },
    /*
     order_shipping:{
         street,
         city,
         state,
         country
     }
 */
    order_payment: {
        type: Object,
        default: {},
    },
    order_products: {
        type: Array,
        required: true
    },
    order_trackingNumber: {
        type: String,
        default: '#0000111052025'
    },
    order_status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'],
        // pending đơn hàng được tạo đang chờ xữ lí ; 
        // confirmed đơn hàng đươc xữ lí và xác nhận 
        // shipped đơn hàng đã được vận chuyển trên đường đến tay người dùng
        // cancelled đơn hàng bị hủy 
        // delivered đơn hàng đã được giao 
        default: 'pending'
    },
    order_statusHistory:{
        type:Array,
        default:[]
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, OrderSchema);