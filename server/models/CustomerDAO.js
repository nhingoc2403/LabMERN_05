const mongoose = require('mongoose');
const Models = require('./Models');

const CustomerDAO = {

    // INSERT
    async insert(customer) {
        try {
            if (!customer._id) {
                customer._id = new mongoose.Types.ObjectId();
            }
            const newCustomer = new Models.Customer(customer);
            const result = await newCustomer.save();
            return result;
        } catch (error) {
            console.error('Error saving customer:', error);
            return null;
        }
    },

    // SELECT BY ID
    async selectByID(id) {
        try {
            return await Models.Customer.findById(id).exec();
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    // SELECT BY USERNAME
    async selectByUsername(username) {
        try {
            return await Models.Customer.findOne({ username: username }).exec();
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    // SELECT ALL (Lab 09 dùng)
    async selectAll() {
        const query = {};
        const customers = await Models.Customer.find(query).exec();
        return customers;
    },

    // 🔥 QUAN TRỌNG: ACTIVE / DEACTIVE
    async active(id, token, active) {
        try {
            const query = { _id: id, token: token };
            const newvalues = { active: active };
            const result = await Models.Customer.findOneAndUpdate(query, newvalues);
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    // (OPTIONAL) UPDATE
    async updateCustomer(id, updates) {
        try {
            return await Models.Customer.findByIdAndUpdate(id, updates, { new: true });
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    // (OPTIONAL) CHECKOUT
    async checkout(customer, items, total) {
        try {
            const Order = Models.Order;

            const newOrder = new Order({
                _id: new mongoose.Types.ObjectId(),
                cdate: new Date(),
                customer: customer,
                total: total,
                status: 'NEW',
                items: items
            });

            const result = await newOrder.save();
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

};

module.exports = CustomerDAO;