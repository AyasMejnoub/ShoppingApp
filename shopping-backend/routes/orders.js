const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); 
const User = require('../models/User'); 
const Product = require('../models/Product'); 
const { isAuthenticated, isSeller } = require('../middlewares/auth');


// POST: Créer une commande
router.post('/', async (req, res) => {
  try {
    const { userId, items } = req.body;
    const newOrder = new Order({ userId, items });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET: Récupérer toutes les commandes
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('userId items.productId');
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET: Récupérer une commande par ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId items.productId');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/user/:userId', async (req, res) => {
    try {
      const orders = await Order.find({ userId: req.params.userId }).populate('items.productId');
      res.json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });


  router.post('/confirm/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
  
      const user = await User.findById(userId).populate('cart.productId');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      if (!user.cart.length) {
        return res.status(400).json({ error: 'Cart is empty' });
      }
  
      const newOrder = new Order({
        userId: user._id,
        items: user.cart.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
        })),
        status: 'pending',
      });
  
      await newOrder.save();
  
      for (const item of user.cart) {
        const product = await Product.findById(item.productId._id);
        if (product.stock < item.quantity) {
          return res.status(400).json({ error: `Not enough stock for product: ${product.name}` });
        }
        product.stock -= item.quantity;
        await product.save();
      }
  
      user.cart = [];
      await user.save();
  
      res.status(201).json(newOrder);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
// PUT: Annuler une commande
router.put('/cancel/:orderId', async (req, res) => {
    try {
      const { orderId } = req.params;
  
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      if (order.status !== 'pending') {
        return res.status(400).json({ error: 'Order cannot be cancelled as it is already validated or cancelled' });
      }
  
      order.status = 'cancelled';
      await order.save();
  
      for (const item of order.items) {
        const product = await Product.findById(item.productId);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
  
      res.status(200).json({ message: 'Order cancelled successfully', order });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });
// PUT: Valider une commande (par un vendeur)
router.put('/validate/:orderId', isAuthenticated, isSeller, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Order cannot be validated as it is already processed' });
    }

    order.status = 'validated';
    await order.save();

    res.status(200).json({ message: 'Order validated successfully', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT: Rejeter une commande (par un vendeur)
router.put('/reject/:orderId', isAuthenticated, isSeller, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Order cannot be rejected as it is already processed' });
    }

    order.status = 'rejected';
    await order.save();

    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    res.status(200).json({ message: 'Order rejected successfully', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

   
module.exports = router;
