const express = require('express');
const router = express.Router();
const JwtUtil = require('../utils/JwtUtil');
const AdminDAO = require('../models/AdminDAO');
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const Models = require('../models/Models');
const OrderDAO = require('../models/OrderDAO');
const jwt = require('jsonwebtoken');
const MyConstants = require('../utils/MyConstants');

// 🔥 ADD
const EmailUtil = require('../utils/EmailUtil');


// ========================
// ADMIN LOGIN
// ========================
router.post('/login', async (req, res) => {

  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({
      success: false,
      message: 'Please input username and password'
    });
  }

  const admin = await AdminDAO.selectByUsernameAndPassword(username, password);

  if (!admin) {
    return res.json({
      success: false,
      message: 'Incorrect username or password'
    });
  }

  const token = JwtUtil.genToken({ userId: admin._id, role: 'admin' });

  res.json({
    success: true,
    token: token
  });

});


// ========================
// CATEGORY CRUD
// ========================

router.get('/categories', JwtUtil.checkToken, async (req, res) => {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});

router.post('/categories', JwtUtil.checkToken, async (req, res) => {
  try {
    const { name } = req.body;
    const result = await CategoryDAO.insert({ name });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Add category failed' });
  }
});

router.put('/categories/:id', JwtUtil.checkToken, async (req, res) => {
  try {
    const _id = req.params.id;
    const { name } = req.body;
    const result = await CategoryDAO.update({ _id, name });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Update category failed' });
  }
});

router.delete('/categories/:id', JwtUtil.checkToken, async (req, res) => {
  try {
    const _id = req.params.id;
    const result = await CategoryDAO.delete(_id);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Delete category failed' });
  }
});


// ========================
// PRODUCT CRUD
// ========================

router.get('/products', JwtUtil.checkToken, async (req, res) => {

  let products = await ProductDAO.selectAll();

  const sizePage = 4;
  const noPages = Math.ceil(products.length / sizePage);
  const curPage = parseInt(req.query.page) || 1;
  const offset = (curPage - 1) * sizePage;

  products = products.slice(offset, offset + sizePage);

  res.json({
    products,
    noPages,
    curPage
  });

});

router.post('/products', JwtUtil.checkToken, async (req, res) => {
  try {
    const { name, price, category: cid, image } = req.body;
    const category = await CategoryDAO.selectByID(cid);

    const product = {
      name,
      price,
      image,
      cdate: Date.now(),
      category
    };

    const result = await ProductDAO.insert(product);
    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Add product failed' });
  }
});

router.put('/products/:id', JwtUtil.checkToken, async (req, res) => {
  try {
    const _id = req.params.id;
    const { name, price, category: cid, image } = req.body;
    const category = await CategoryDAO.selectByID(cid);

    const product = { _id, name, price, image, category };
    const result = await ProductDAO.update(product);

    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Update product failed' });
  }
});

router.delete('/products/:id', JwtUtil.checkToken, async (req, res) => {
  try {
    const _id = req.params.id;
    const result = await ProductDAO.delete(_id);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Delete product failed' });
  }
});


// ========================
// CHECK TOKEN
// ========================
router.get('/token', JwtUtil.checkToken, (req, res) => {
  res.json({ success: true, message: 'Token is valid' });
});


// ========================
// GET CUSTOMERS
// ========================
router.get('/customers', JwtUtil.checkToken, async (req, res) => {
  try {
    const customers = await Models.Customer.find({});
    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});


// ========================
// DEACTIVE CUSTOMER
// ========================
router.put('/customers/deactive/:id', JwtUtil.checkToken, async (req, res) => {
  try {
    const customer = await Models.Customer.findById(req.params.id);

    if (!customer) return res.json(false);

    customer.active = 0;
    await customer.save();

    res.json(true);

  } catch (error) {
    console.error(error);
    res.json(false);
  }
});


// ========================
// ACTIVATE CUSTOMER
// ========================
router.put('/customers/active/:id', JwtUtil.checkToken, async (req, res) => {
  try {
    const customer = await Models.Customer.findById(req.params.id);

    if (!customer) return res.json(false);

    customer.active = 1;
    await customer.save();

    res.json(true);

  } catch (error) {
    console.error(error);
    res.json(false);
  }
});


// ========================
// 🔥 SEND MAIL (LAB 9)
// ========================
router.get('/customers/sendmail/:id', JwtUtil.checkToken, async (req, res) => {
  try {
    const customer = await Models.Customer.findById(req.params.id);

    if (!customer) {
      return res.json({ message: "Customer not found" });
    }

    const subject = "Account Activation";
    const content = "Your account has been activated successfully.";

    await EmailUtil.send(customer.email, subject, content);

    res.json({ message: "Send email successfully!" });

  } catch (error) {
    console.error(error);
    res.json({ message: "Send email failed!" });
  }
});


// ========================
// ADMIN GET ALL ORDERS
// ========================
router.get('/orders', JwtUtil.checkToken, async (req, res) => {
  try {
    const orders = await OrderDAO.selectAllWithCustomer();
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


// ========================
// GET ORDERS BY CUSTOMER (🔥 THIẾU → THÊM)
// ========================
router.get('/orders/customer/:cid', JwtUtil.checkToken, async (req, res) => {
  try {
    const orders = await OrderDAO.selectByCustID(req.params.cid);
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json([]);
  }
});


// ========================
// UPDATE ORDER STATUS
// ========================
router.put('/orders/status/:id', JwtUtil.checkToken, async (req, res) => {

  const { status } = req.body;

  if (!['APPROVED', 'CANCELED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const updatedOrder = await OrderDAO.updateOrderStatus(req.params.id, status);
    res.json({ success: true, updatedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }

});

module.exports = router;