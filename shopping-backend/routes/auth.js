const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');



// POST: Connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    console.log("Utilisateur trouvé :", user); 

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );
    res.cookie('token',token,

      {
        httpOnly: true,          
        secure: false, 
        sameSite: 'strict',      
        maxAge: 24 * 60 * 60 * 1000 
      }
    )
    res.status(200).json({ token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = new User({ name, email, password: hashedPassword, role: role || 'user'});
      await newUser.save();

  
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
module.exports = router;
