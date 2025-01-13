import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SellerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  let role;

  if (token) {
    try {
      const decodedToken = jwtDecode(token); 
      role = decodedToken.role; 
    } catch (error) {
      console.error('Invalid token:', error);
      role = null;
    }
  }

  useEffect(() => {
    if (!token || (role !== 'seller' && role !== 'admin')) {
      alert("Accès refusé : Vous n'avez pas les permissions nécessaires.");
      navigate('/'); 
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (err) {
        console.error(err);
        setError('Erreur lors de la récupération des commandes.');
      }
    };

    fetchOrders();
  }, [token, role, navigate]);

  const handleOrderAction = async (orderId, action) => {
    try {
      const url = `http://localhost:5000/api/orders/${action}/${orderId}`;
      await axios.put(url, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(`Commande ${action === 'validate' ? 'validée' : 'rejetée'} avec succès.`);
      setOrders(orders.filter(order => order._id !== orderId)); // Retirer la commande de la liste
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'action sur la commande.");
    }
  };

  return (
    <div className="container mt-5">
      <h1>Gestion des Commandes</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {orders.length === 0 ? (
        <p>Aucune commande à traiter.</p>
      ) : (
        orders.map(order => (
          <div className="card mb-3" key={order._id}>
            <div className="card-body">
              <h5 className="card-title">Commande #{order._id}</h5>
              <p><strong>Utilisateur :</strong> {order.userId?.name || 'Inconnu'}</p>
              <p><strong>Statut :</strong> {order.status}</p>
              <ul>
                {order.items.map(item => (
                  <li key={item.productId._id}>
                    {item.productId.name} - Quantité : {item.quantity}
                  </li>
                ))}
              </ul>
              {order.status === 'pending' && (
                <div>
                  <button
                    className="btn btn-success me-2"
                    onClick={() => handleOrderAction(order._id, 'validate')}
                  >
                    Valider
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleOrderAction(order._id, 'reject')}
                  >
                    Rejeter
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SellerDashboard;
