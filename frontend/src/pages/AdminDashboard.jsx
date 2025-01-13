import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]); 
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  let role;

  if (token) {
    try {
      const decodedToken = jwtDecode(token); 
      role = decodedToken.role; 
    } catch (error) {
      console.error("Invalid token:", error);
      role = null;
    }
  }

  useEffect(() => {
    if (!token || role !== "admin") {
      alert("Accès refusé : Vous n'avez pas les permissions nécessaires.");
      navigate("/"); 
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data); 
      } catch (err) {
        console.error(err);
        setErrorMessage("Erreur lors de la récupération des produits.");
      }
    };

    fetchProducts();
  }, [role, navigate, token]);

  const handleUpdateStock = async (productId, newStock) => {
    try {
      await axios.put(
        `http://localhost:5000/api/products/update-stock/${productId}`,
        { stock: newStock },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage("Stock mis à jour avec succès.");
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId ? { ...product, stock: newStock } : product
        )
      );
    } catch (err) {
      console.error(err);
      setErrorMessage("Erreur lors de la mise à jour du stock.");
    }
  };

  const handleAddProductRedirect = () => {
    navigate("/add-product");
  };

  return (
    <div className="container mt-5">
      <h1>Gestion des Produits</h1>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {/* Liste des produits */}
      <div className="mt-4">
        <h2>Produits existants</h2>
        {products.length === 0 ? (
          <p>Aucun produit disponible.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Description</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.price} €</td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={product.stock}
                      onChange={(e) =>
                        setProducts((prevProducts) =>
                          prevProducts.map((p) =>
                            p._id === product._id
                              ? { ...p, stock: e.target.value }
                              : p
                          )
                        )
                      }
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleUpdateStock(product._id, product.stock)}
                    >
                      Mettre à jour le stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Bouton pour rediriger vers la page d'ajout de produit */}
      <div className="mt-4">
        <button
          className="btn btn-success"
          onClick={handleAddProductRedirect}
        >
          Ajouter un nouveau produit
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
