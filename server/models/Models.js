const mongoose = require('mongoose');

// Schema Admin
const AdminSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String
}, { versionKey: false });

// Schema Category
const CategorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String
}, { versionKey: false });

// Schema Customer
// const CustomerSchema = mongoose.Schema({
//     _id: mongoose.Schema.Types.ObjectId,
//     username: String,
//     password: String,
//     name: String,
//     phone: String,
//     email: String,
//     active: Number,
//     token: String
// }, { versionKey: false });\

const CustomerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String,
    name: String,
    phone: String,
    email: String,
    active: Number,
    token: String
    
}, { versionKey: false });

const orderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    items: [
        {
            _id: String,
            name: String,
            category: String,
            image: String,
            price: Number,
            quantity: Number
        }
    ],
    createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

// Schema Product
const ProductSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,
    image: String,
    cdate: Number,
    category: CategorySchema,
    isHot: { type: Boolean, default: false }  // Thêm trường isHot
}, { versionKey: false });

// Schema Order Item
const ItemSchema = mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: Number
}, { versionKey: false, _id: false });

const OrderDetailSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    image: String,
    price: Number,
    quantity: Number
}, { _id: false });

const OrderSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date: { type: Date, default: Date.now },
    status: { type: String, default: 'PENDING' },
    total: Number,
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    items: [OrderDetailSchema]
});



// Models
const Admin = mongoose.model('Admin', AdminSchema);
const Category = mongoose.model('Category', CategorySchema);
const Customer = mongoose.model('Customer', CustomerSchema);
const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);

module.exports = { Admin, Category, Customer, Product, Order };
