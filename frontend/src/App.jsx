import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import { CartProvider } from './contexts/CartContext';
import AddProductPage from './pages/AddProductPage';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './pages/Cart';
import Home from './pages/Home';
import Login from './pages/Login';
import Orders from './pages/Orders';
import ProductDetails from "./pages/ProductDetails";
import Profile from './pages/Profile';
import Register from './pages/Register';
import SellerDashboard from './pages/SellerDashboard';


const App = () => {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/add-product" element={<AddProductPage />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
