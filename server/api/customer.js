// const express = require('express');
// const router = express.Router();

// const CategoryDAO = require('../models/CategoryDAO');
// const ProductDAO = require('../models/ProductDAO');

// router.get('/categories', async function(req, res) {
//     const categories = await CategoryDAO.selectAll();
//     res.json(categories);    
// });
// router.get('/products/new', async function(req, res) {
//     const products = await ProductDAO.selectTopNew(3);
//     res.json(products);    
// });
// router.get('/products/hot', async function(req, res) {
//     const products = await ProductDAO.selectTopHot(3);
//     res.json(products);    
// });
// router.get('/products/category/:cid', async function(req, res) {
//     const _cid = req.params.cid;
//     const products = await ProductDAO.selectByCatID(_cid);
//     res.json(products);    
// });
// router.get('/products/search/:keyword', async function (req, res) {
//     try {
//         const keyword = req.params.keyword;
//         const products = await ProductDAO.selectByKeyword(keyword);
//         res.json(products);
//     } catch (error) {
//         console.error("Error searching products:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });
// router.get('/products/:id', async function(req, res) {
//     const _id = req.params.id;
//     const product = await ProductDAO.selectByCatID(_id);
//     res.json(product);    
// });
// module.exports = router;
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const CustomerDAO = require('../models/CustomerDAO');
const MyConstants = require('../utils/MyConstants');
const OrderDAO = require('../models/OrderDAO');
const mongoose = require('mongoose');


// API lấy danh sách danh mục
router.get('/categories', async function(req, res) {
    try {
        const categories = await CategoryDAO.selectAll();
        res.json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// API lấy sản phẩm mới
router.get('/products/new', async function(req, res) {
    try {
        const products = await ProductDAO.selectTopNew(3);
        res.json(products);
    } catch (error) {
        console.error("Error fetching new products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// API lấy sản phẩm hot
router.get('/products/hot', async function(req, res) {
    try {
        const products = await ProductDAO.selectTopHot(3);
        res.json(products);
    } catch (error) {
        console.error("Error fetching hot products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// API lấy sản phẩm theo danh mục
router.get('/products/category/:cid', async function(req, res) {
    try {
        const _cid = req.params.cid;
        if (!_cid) return res.status(400).json({ error: "Invalid category ID" });

        const products = await ProductDAO.selectByCatID(_cid);
        res.json(products);
    } catch (error) {
        console.error("Error fetching products by category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// API tìm kiếm sản phẩm theo từ khóa
router.get('/products/search/:keyword', async function (req, res) {
    try {
        const keyword = req.params.keyword;
        if (!keyword) return res.status(400).json({ error: "Invalid search keyword" });

        const products = await ProductDAO.selectByKeyword(keyword);
        res.json(products);
    } catch (error) {
        console.error("Error searching products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// API lấy sản phẩm theo ID
router.get('/products/:id', async function(req, res) {
    try {
        const _id = req.params.id;
        if (!_id) return res.status(400).json({ error: "Invalid product ID" });

        const product = await ProductDAO.selectByID(_id);
        if (!product) return res.status(404).json({ error: "Product not found" });

        res.json(product);
    } catch (error) {
        console.error("Error fetching product details:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



router.post('/signup', async (req, res) => {
    const { username, password, name, phone, email } = req.body;

    // Kiểm tra nếu các trường cần thiết không được cung cấp
    if (!username || !password || !name || !phone || !email) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Kiểm tra nếu tên đăng nhập đã tồn tại
        const existingCustomer = await CustomerDAO.selectByUsername(username);
        if (existingCustomer) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo đối tượng khách hàng mới
        const newCustomer = {
            username,
            password: hashedPassword,
            name,
            phone,
            email,
            active: 0, // Mặc định tài khoản chưa được kích hoạt
            token: '' // Token sẽ được tạo sau khi đăng ký
        };

        // Lưu thông tin khách hàng vào cơ sở dữ liệu
        const result = await CustomerDAO.insert(newCustomer);

        // Tạo token cho người dùng
        const token = jwt.sign(
            { id: result._id, username: result.username },
            MyConstants.JWT_SECRET, // Lưu trữ secret key trong biến môi trường
            { expiresIn: '1h' } // Thời gian hết hạn của token
        );

        // Cập nhật lại thông tin token cho khách hàng trong cơ sở dữ liệu
        result.token = token;
        await result.save();

        // Trả về thông báo thành công cùng với token
        res.status(201).json({
            success: true,
            message: 'Customer registered successfully',
            token: token,  // Trả về token
            customer: result // Trả về thông tin khách hàng
        });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.post('/active', async (req, res) => {
    const { id, token } = req.body;

    // Kiểm tra nếu id và token không được cung cấp
    if (!id || !token) {
        return res.status(400).json({ error: 'ID and token are required' });
    }

    try {
        // Kiểm tra xem khách hàng có tồn tại trong cơ sở dữ liệu hay không
        const customer = await CustomerDAO.selectByID(id);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Kiểm tra token có hợp lệ không
        const decoded = jwt.verify(token, MyConstants.JWT_SECRET);

        // Kiểm tra token có đúng với khách hàng không
        if (decoded.id !== customer._id.toString()) {
            return res.status(400).json({ error: 'Invalid token' });
        }

        // Kích hoạt tài khoản
        customer.active = 1;  // Đánh dấu khách hàng là đã kích hoạt
        await customer.save();

        res.json({ success: true, message: 'Account activated successfully' });
    } catch (error) {
        console.error('Error during account activation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// API đăng nhập khách hàng
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Kiểm tra nếu thiếu tên đăng nhập hoặc mật khẩu
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Tìm khách hàng theo username
        const customer = await CustomerDAO.selectByUsername(username);
        if (!customer) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // So sánh mật khẩu người dùng với mật khẩu đã mã hóa trong cơ sở dữ liệu
        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Tạo token cho khách hàng
        const token = jwt.sign(
            { id: customer._id, username: customer.username },
            MyConstants.JWT_SECRET, // secret key
            { expiresIn: '1h' } // Token hết hạn sau 1 giờ
        );

        // Trả về token và thông tin khách hàng
        res.json({
            success: true,
            message: 'Login successful',
            token: token,  // Trả về token
            customer: {
                id: customer._id,
                username: customer.username,
                name: customer.name,
                phone: customer.phone,
                email: customer.email,
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get('/token', (req, res) => {
    const token = req.header('x-access-token');  // Lấy token từ header

    if (!token) {
        return res.status(400).json({ error: 'No token provided' });
    }

    // Xác minh token
    jwt.verify(token, MyConstants.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(400).json({ error: 'Invalid token' });
        }
        res.json({
            success: true,
            decoded: decoded  // Trả về thông tin giải mã từ token
        });
    });
});
router.post('/logout', (req, res) => {
    // Đơn giản chỉ cần xóa token ở frontend
    // Ở backend không cần phải xóa gì cả vì token hết hạn khi không còn trên frontend
    res.json({ success: true, message: 'Logout successful' });
});

// Cập nhật thông tin người dùng
router.put('/customers/:id', async (req, res) => {
    const { id } = req.params;
    const { username, password, name, phone, email } = req.body;
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        // Xác minh token
        const decoded = jwt.verify(token, MyConstants.JWT_SECRET);
        
        // Kiểm tra nếu token hợp lệ và thuộc về người dùng đang đăng nhập
        if (decoded.id !== id) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        // Cập nhật thông tin người dùng
        const updatedCustomer = await CustomerDAO.updateCustomer(id, { username, password, name, phone, email });

        if (!updatedCustomer) {
            return res.status(400).json({ error: 'Customer not found' });
        }

        res.json({ success: true, message: 'Customer updated successfully', customer: updatedCustomer });
    } catch (error) {
        console.error('Error during update:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/checkout', async (req, res) => {
    const token = req.headers['x-access-token'];
    const { cartItems } = req.body;

    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        // Xác thực token
        const decoded = jwt.verify(token, MyConstants.JWT_SECRET);
        const customerId = decoded.id;

        // Tính tổng tiền
        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Chuẩn bị order
        const order = {
            _id: new mongoose.Types.ObjectId(),
            customer: customerId,
            total: total,
            status: 'PENDING',
            date: new Date(),
            items: cartItems.map(item => ({
                product: item._id,         // ID sản phẩm
                name: item.name,
                image: item.image || "",   // hoặc base64
                price: item.price,
                quantity: item.quantity
            }))
        };

        // Lưu order
        const result = await OrderDAO.insert(order);

        res.json({
            success: true,
            message: 'Checkout successful',
            order: result
        });
    } catch (error) {
        console.error("Error during checkout:", error);
        res.status(500).json({ error: 'Checkout failed' });
    }
});

router.get('/orders/customer/:cid', async (req, res) => {
    const customerId = req.params.cid;
    const token = req.headers['x-access-token'];

    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, MyConstants.JWT_SECRET);

        // Kiểm tra token đúng người dùng
        if (decoded.id !== customerId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        // Lấy danh sách đơn hàng theo ID khách
        const orders = await OrderDAO.selectByCustomerID(customerId);

        res.json({
            success: true,
            orders: orders
        });
    } catch (error) {
        console.error('Error getting orders:', error);
        res.status(500).json({ error: 'Could not fetch orders' });
    }
});




module.exports = router;
