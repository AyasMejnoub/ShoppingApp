import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/cart/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCart(response.data);
      } catch (err) {
        console.error(err);
        setError('Erreur lors de la récupération du panier.');
      }
    };

    fetchCart();
  }, [userId, token]);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity <= 0) return; 
  
    try {
      const response = await axios.put(
        `http://localhost:5000/api/cart/update-quantity/${userId}`,
        { productId, quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      setCart(response.data); 
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la mise à jour de la quantité.');
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/cart/remove-from-cart/${userId}`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCart(response.data);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression du produit.');
    }
  };

  const handleConfirmOrder = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir confirmer cette commande ?')) {
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/orders/confirm/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Commande confirmée avec succès !');
      setCart([]); 
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la confirmation de la commande.');
    }
  };

  if (!cart.length) {
    return (
      <div className="container mt-5">
        <h1>Mon Panier</h1>
        <p>Votre panier est vide.</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1>Mon Panier</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        {cart.map((item) => (
          <div className="col-md-12 mb-3" key={item.productId._id}>
            <div className="card">
              <div className="row g-0 align-items-center">
                <div className="col-md-2">
                  {item.productId.image && (
                    <img
                      src={`http://localhost:5000${item.productId.image}`}
                      className="img-fluid rounded-start"
                      alt={item.productId.name}
                    />
                  )}
                </div>
                <div className="col-md-6">
                  <div className="card-body">
                    <h5 className="card-title">{item.productId.name}</h5>
                    <p className="card-text">
                      <strong>Prix :</strong> {item.productId.price} €
                    </p>
                    <p className="card-text">
                      <strong>Quantité :</strong> {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="col-md-4 d-flex justify-content-center align-items-center">
                  <button
                    className="btn btn-outline-secondary me-2"
                    onClick={() => handleQuantityChange(item.productId._id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="btn btn-outline-secondary ms-2"
                    onClick={() => handleQuantityChange(item.productId._id, item.quantity + 1)}
                  >
                    +
                  </button>
                  <button
                    className="btn btn-danger ms-2"
                    onClick={() => handleRemoveFromCart(item.productId._id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        className="btn btn-success mt-4"
        onClick={handleConfirmOrder}
      >
        Confirmer la commande
      </button>
    </div>
  );
};

export default Cart;
