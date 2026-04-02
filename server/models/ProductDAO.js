require('../utils/MongooseUtil');
const Models = require('./Models');

const ProductDAO = {

  async selectAll() {
    const query = {};
    const products = await Models.Product.find(query).exec();
    return products;
  },

  async insert(product) {
    const mongoose = require('mongoose');
    product._id = new mongoose.Types.ObjectId();

    const newProduct = new Models.Product(product);
    const result = await newProduct.save();

    return result;
  },

  async selectByID(_id) {
    if (!_id) return null;
    const product = await Models.Product.findById(_id).exec();
    return product;
  },

  async selectTopNew(top) {
    const products = await Models.Product
      .find({})
      .sort({ cdate: -1 })
      .limit(top)
      .exec();

    return products;
  },

  async selectTopHot(top) {

    const items = await Models.Order.aggregate([
      { $match: { status: 'APPROVED' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product._id',
          sum: { $sum: '$items.quantity' }
        }
      },
      { $sort: { sum: -1 } },
      { $limit: top }
    ]);

    const products = [];

    for (let i = 0; i < items.length; i++) {

      const product = await Models.Product.findById(items[i]._id);

      if (product) products.push(product);

    }

    return products;
  },

  async selectByCatID(_cid) {

    if (!_cid) return [];

    const products = await Models.Product.find({
      'category._id': _cid
    });

    return products;
  },

  async selectByKeyword(keyword) {

    if (!keyword) return [];

    const products = await Models.Product.find({
      name: { $regex: keyword, $options: "i" }
    });

    return products;
  },

  async update(product) {

    const newValues = {
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      cdate: Date.now()
    };

    const result = await Models.Product.findByIdAndUpdate(
      product._id,
      newValues,
      { new: true }
    );

    return result;
  },

  async delete(_id) {

    const result = await Models.Product.findByIdAndDelete(_id);

    return result;
  }

};

module.exports = ProductDAO;