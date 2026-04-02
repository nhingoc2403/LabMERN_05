require('../utils/MongooseUtil');
const { selectAll, update, selectByID } = require('./CategoryDAO');
const Models = require('./Models');

const ProductDAO = {
    async selectAll(){
        const query = {};
        const products = await Models.Product.find(query).exec();
        return products;
    },
    async insert(product){
        const mongoose = require('mongoose');
        product._id = new mongoose.Types.ObjectId();
        const result = await Models.Product.create(product);
        return result;
    },
    async selectByID(_id) {
        if (!_id) return null; // Kiểm tra nếu _id không hợp lệ
        const product = await Models.Product.findById(_id).exec();
        return product;
    },

    async selectTopNew(top) {
        const query = {};
        const mysort = { cdate: -1 };
        const products = await Models.Product.find(query).sort(mysort).limit(top).exec();
        return products;
    },

    async selectTopHot(top) {
        const items = await Models.Order.aggregate([
            { $match: { status: 'APPROVED' } },
            { $unwind: '$items' },
            { $group: { _id: '$items.product._id', sum: { $sum: '$items.quantity' } } },
            { $sort: { sum: -1 } }, // descending
            { $limit: top }
        ]).exec();

        const products = [];
        for (const item of items) {
            const product = await ProductDAO.selectByID(item._id);
            if (product) { // Chỉ thêm nếu product không null
                products.push(product);
            }
        }
        return products;
    },

    async selectByCatID(_cid) {
        if (!_cid) return []; // Kiểm tra nếu _cid không hợp lệ
        const query = { 'category._id': _cid };
        const products = await Models.Product.find(query).exec();
        return products;
    },

    async selectByKeyword(keyword) {
        if (!keyword) return []; // Kiểm tra nếu keyword rỗng
        const query = { name: { $regex: new RegExp(keyword, "i") } }; // Tìm kiếm không phân biệt hoa thường
        const products = await Models.Product.find(query).exec();
        return products;
    },

    async update(product) {
        const newValues = {
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            cdate: new Date().getTime(), // Cập nhật thời gian
        };
        // Tìm sản phẩm theo ID và cập nhật
        const result = await Models.Product.findByIdAndUpdate(product._id, newValues, { new: true });
        return result;
    },
    async delete(_id) {
        const result = await Models.Product.findByIdAndDelete(_id); // Sử dụng findByIdAndDelete thay vì findByIdAndRemove
        return result;
    }
};

module.exports = ProductDAO;