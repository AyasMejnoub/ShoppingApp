const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { isAuthenticated, isAdmin } = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuration de stockage pour Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage });


// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route POST pour ajouter un produit avec une image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const product = new Product({
      name,
      description,
      price,
      stock,
      image: imagePath, 
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la création du produit' });
  }
});

// GET product by ID
router.get('/:id', async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });


  
  // PUT: Update product by ID, including image
router.put('/:id', isAuthenticated, isAdmin, upload.single('image'), async (req, res) => {
    try {
      const { name, description, price, stock } = req.body;
  
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      const updatedFields = {
        name: name || product.name,
        description: description || product.description,
        price: price || product.price,
        stock: stock || product.stock,
      };
  
      if (req.file) {
        if (product.image) {
          const oldImagePath = path.join(__dirname, '../..', product.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlink(oldImagePath, (err) => {
              if (err) console.error('Erreur lors de la suppression de l\'ancienne image:', err);
            });
          }
        }
        updatedFields.image = `/uploads/${req.file.filename}`; 
      }
  
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        updatedFields,
        { new: true, runValidators: true }
      );
  
      res.json(updatedProduct);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  

// PUT: Modifier le stock d'un produit
router.put('/update-stock/:productId', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { productId } = req.params;
      const { stock } = req.body;
  
      if (stock < 0) {
        return res.status(400).json({ error: 'Stock cannot be negative' });
      }
  
      const product = await Product.findByIdAndUpdate(
        productId,
        { stock },
        { new: true, runValidators: true } 
      );
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.status(200).json({ message: 'Stock updated successfully', product });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

module.exports = router;
