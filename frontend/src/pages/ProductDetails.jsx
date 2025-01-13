import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ProductDetails = () => {
  const { productId } = useParams(); 
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); 
  const [notification, setNotification] = useState("");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
        setProduct(response.data);
      } catch (err) {
        console.error(err);
        setNotification("Erreur lors du chargement du produit.");
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleAddToCart = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/cart/add-to-cart/${userId}`,
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotification("Produit ajouté au panier avec succès !");
      setTimeout(() => setNotification(""), 3000);
    } catch (err) {
      console.error(err);
      setNotification("Erreur lors de l'ajout au panier.");
    }
  };

  if (!product) {
    return <div className="container mt-5 text-center">Chargement du produit...</div>;
  }

  return (
    <div className="container mt-5">
      <button className="btn btn-secondary mb-4" onClick={() => navigate(-1)}>
        Retour
      </button>
      <div className="row">
        <div className="col-md-6">
          {product.image && (
            <img
              src={`http://localhost:5000${product.image}`}
              alt={product.name}
              className="img-fluid rounded"
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />
          )}
        </div>
        <div className="col-md-6">
          <h1>{product.name}</h1>
          <p className="text-muted">{product.description}</p>
          <p>
            <strong>Prix :</strong> {product.price} €
          </p>
          <p>
            <strong>Stock disponible :</strong> {product.stock}
          </p>
          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">
              Quantité
            </label>
            <input
              type="number"
              id="quantity"
              className="form-control"
              value={quantity}
              min={1}
              max={product.stock}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={handleAddToCart}
            disabled={quantity > product.stock || quantity <= 0}
          >
            Ajouter au panier
          </button>
          {notification && (
            <div className={`alert ${notification.includes("succès") ? "alert-success" : "alert-danger"} mt-3`}>
              {notification}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
