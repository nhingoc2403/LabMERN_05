const mongoose = require('mongoose');
const Models = require('./Models');

const OrderDAO = {
    async insert(order) {
        try {
            if (!order._id) order._id = new mongoose.Types.ObjectId();
            const newOrder = new Models.Order(order);
            return await newOrder.save();
        } catch (error) {
            console.error('Error saving order:', error);
            throw error;
        }
    },

    async selectByCustomerID(customerId) {
        try {
            return await Models.Order.find({ customer: customerId })
                .populate('customer') // ✅ để có tên + số điện thoại
                .exec();
        } catch (error) {
            console.error('Error fetching orders by customer:', error);
            throw error;
        }
    },
    async selectAllWithCustomer() {
        return await Models.Order.find({})
          .populate('customer') // nếu bạn dùng ref trong schema
          .sort({ date: -1 })   // sắp xếp theo ngày mới nhất
          .exec();
      },
      async updateOrderStatus(orderId, status) {
        try {
            // Kiểm tra trạng thái hợp lệ
            if (!['APPROVED', 'CANCELED'].includes(status)) {
                throw new Error('Invalid status');
            }
    
            // Tìm và cập nhật trạng thái đơn hàng
            const updatedOrder = await Models.Order.findByIdAndUpdate(
                orderId,
                { status: status }, // Cập nhật trạng thái mới
                { new: true } // Trả về đơn hàng đã được cập nhật
            );
    
            return updatedOrder; // Trả về đơn hàng đã cập nhật
        } catch (err) {
            console.error("Error updating order status:", err);
            throw err;
        }
    }
    
};

module.exports = OrderDAO;
