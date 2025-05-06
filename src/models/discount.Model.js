'use strict'

const { model, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'discount'
const COLLECTION_NAME = 'discounts'

// Declare the Schema of the Mongo model
var discountSchema = new Schema({
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, default: 'fixed_amount', required: true },//fixed_amount theo số tiền; percentage phần trăm
    discount_value: { type: Number, requierd: true },//số tiền cụ thể hoặc phần trăm 
    discount_code: { type: String, required: true },//mã code áp dụng vocher 
    discount_start_date: { type: Date, required: true },// ngày bắt đầu áp dụng vocher
    discount_end_date: { type: Date, required: true },// ngày kết thúc vocher
    discount_max_uses: { type: Number, required: true },
    discount_uses_count: { type: Number, requierd: true }, //số lượng discount đã sử dụng 
    discount_users_used: { type: Array, default: [] },
    discount_max_uses_per_user: { type: Number, requierd: true }, // số lượng sử dụng tối đa với mỗi user
    discount_min_order_value: { type: Number, requierd: true },
    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: { type: String, requierd: true, enum: ['all', 'specific'] },
    discount_product_ids: [{
        type:Schema.Types.ObjectId,
        ref:'product'
    }] // các sản phẩm được áp dụng vocher hoặc áp dụng tất cả thì là mảng rỗng 
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema)