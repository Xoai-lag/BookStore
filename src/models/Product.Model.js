'use strict'

const { Schema, model } = require('mongoose')
const slugify = require('slugify')

const DOCUMENT_NAME = 'product'
const COLLECTION_NAME = 'products'

const ProductSchema = new Schema({
    product_name: {
        type: String,
        required: true,
    },
    product_thumb: {
        type: String,
        required: true,
    },
    product_description: {
        type: String,
    },
    product_slug:String,
    product_price: {
        type: Number,
        required: true,
    },
    product_quantity: {
        type: Number,
        required: true,
    },
    product_variations:{
        type:Array,
        default:[]
    },
    isDraft:{
        type:Boolean,
        default:true,
        index:true,
        select:false
    },
    isPublish:{
        type:Boolean,
        default:false,
        index:true,
        select:false
    },
    product_type: {
        type: String,
        required: true,
        enum: ['Book', 'Stationery', 'Gift'] // Loại sản phẩm: Sách, Dụng cụ học tập, Quà tặng
    },
    product_ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],

        set: (val) => Math.round(val * 10) / 10
    },
    product_attributes: {
        type: Schema.Types.Mixed, // Dùng Mixed để hỗ trợ đa hình
        required: true,
    }

}, {
    collection: COLLECTION_NAME,
    timestamps: true,
});

//create index for search

ProductSchema.index({product_name:'text',product_description:'text'})



//Document middleware: runs before .save() and .create()

ProductSchema.pre('save',function(next){
    this.product_slug=slugify(this.product_name,{lower:true})
    next()
})





//define the product type = books
const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    publication_year: {
        type: Number,
        required: true
    },
    isbn: {//(International Standard Book Number)
        type: String,
        required: true,
        unique: true
    },
    genre: {
        type: String,
        enum: ['Fiction', 'Non-Fiction', 'Science', 'Children', 'Biography', 'Fantasy', 'Mystery', 'Education'],
        required: true
    },
    language: {
        type: String,
        default: 'Vietnamese'
    },
    format: {
        type: String,
        enum: ['Hardcover', 'Paperback', 'Ebook'],
        default: 'Paperback'
    }
}, {
    collection: 'books',
    timestamps: true,
})


//define the product type = Stationery
const stationerySchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: ['Pen', 'Pencil', 'Ruler', 'Notebook', 'Eraser', 'Highlighter', 'Glue', 'Scissors']
    },
    brand: {
        type: String,
        required: true
    },
    color: {
        type: String
    },
    material: {
        type: String
    },
    size: {
        type: String
    },
    pack_quantity: {
        type: Number,
        default: 1
    }
}, {
    collection: 'stationerys',
    timestamps: true,
})

//define the product type = gift
const giftSchema = new Schema({
    // Danh sách sản phẩm trong quà tặng, mỗi phần tử gồm loại, tên và số lượng
    items: [{
        // Loại sản phẩm (Book, Stationery, Other), bắt buộc để phân biệt
        type: {
            type: String,
            required: true,
            enum: ['Book', 'Stationery', 'Other']
        },
        // Tên sản phẩm, bắt buộc để hiển thị thông tin
        name: { type: String, required: true },
        // Số lượng, bắt buộc và phải lớn hơn 0
        quantity: { type: Number, required: true, min: 1 }
    }],
    // Màu sắc hộp quà, không bắt buộc
    gift_box_color: { type: String },
    // Dịp tặng (sinh nhật, Giáng sinh, v.v.), không bắt buộc
    occasion: {
        type: String,
        enum: ['Birthday', 'Christmas', 'NewYear', 'Graduation', 'Other']
    },
    // Loại bao bì (hộp, túi, gói), không bắt buộc
    packaging_type: {
        type: String,
        enum: ['Box', 'Bag', 'Wrap']
    }
}, {
    collection: 'gifts',
    timestamps: true,
})
module.exports = {
    product: model(DOCUMENT_NAME, ProductSchema),
    book: model('book', bookSchema),
    stationery: model('stationery', stationerySchema),
    gift: model('gift', giftSchema)
}