const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');

// POST: Ajouter un produit au panier
router.post('/add-to-cart/:userId', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const { userId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Not enough stock available' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingItem = user.cart.find((item) => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ productId, quantity });
    }

    await user.save();

    res.status(200).json(user.cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate('cart.productId');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user.cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/remove-from-cart/:userId', async (req, res) => {
  const { productId } = req.body;
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });

  user.cart = user.cart.filter(item => item.productId.toString() !== productId);

  await user.save();
  res.status(200).json(user.cart);
});

router.put('/update-quantity/:userId', async (req, res) => {
  const { productId, quantity } = req.body; 
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('cart.productId'); 
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });

    const cartItem = user.cart.find(item => item.productId._id.toString() === productId);
    if (!cartItem) return res.status(404).json({ error: 'Produit non trouvé dans le panier.' });

    cartItem.quantity = quantity;

    await user.save();

    const updatedUser = await User.findById(userId).populate('cart.productId');
    res.status(200).json(updatedUser.cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});


module.exports = router;
