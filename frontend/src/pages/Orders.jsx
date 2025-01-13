import axios from "axios";
import React, { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/orders/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  }, []);

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir annuler cette commande ?")) {
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/orders/cancel/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Commande annulée !");
      setOrders(orders.filter((order) => order._id !== orderId)); 
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'annulation de la commande.");
    }
  };

  return (
    <div className="container mt-5">
      <h1>Mes Commandes</h1>
      {orders.map((order) => (
        <div className="card mb-3" key={order._id}>
          <div className="card-body">
            <h5 className="card-title">Commande #{order._id}</h5>
            <p className="card-text">Statut : {order.status}</p>
            <ul>
              {order.items.map((item) => (
                <li key={item.productId._id}>
                  {item.productId.name} - Quantité : {item.quantity}
                </li>
              ))}
            </ul>
            {order.status === "pending" && (
              <button
                className="btn btn-danger"
                onClick={() => cancelOrder(order._id)}
              >
                Annuler la commande
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
