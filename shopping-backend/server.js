const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
// Middleware
app.use(bodyParser.json());
app.use(cookieParser(corsOptions))
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const cartRoutes = require('./routes/cart');
const authRoutes = require('./routes/auth');

app.use('/api/users', userRoutes);                     
app.use('/api/orders', orderRoutes); 
app.use('/api/cart', cartRoutes);
app.use('/api/auth', authRoutes);

const bcrypt = require('bcrypt');
const saltRounds = 10;

// Middleware pour servir les fichiers statiques (images dans /uploads)
app.use('/uploads', express.static('uploads'));

const path = require('path');

// Pour servir les fichiers React
app.use(express.static(path.join(__dirname, '../shopping-frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../shopping-frontend/build', 'index.html'));
});
