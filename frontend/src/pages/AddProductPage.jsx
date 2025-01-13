import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddProductPage = () => {
  const [product, setProduct] = useState({ name: "", description: "", price: "", stock: "" });
  const [imageFile, setImageFile] = useState(null); // Pour gérer le fichier image
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "admin") {
      alert("Accès refusé : Vous n'avez pas les permissions nécessaires.");
      navigate("/"); 
    }
  }, [role, navigate]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("stock", product.stock);
      if (imageFile) {
        formData.append("image", imageFile); 
      }

      await axios.post("http://localhost:5000/api/products", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", 
        },
      });

      setSuccessMessage("Produit ajouté avec succès.");
      setErrorMessage("");
      setProduct({ name: "", description: "", price: "", stock: "" });
      setImageFile(null); 
    } catch (err) {
      console.error(err);
      setSuccessMessage("");
      setErrorMessage("Erreur lors de l'ajout du produit.");
    }
  };

  return (
    <div className="container mt-5">
      <h1>Ajouter un Nouveau Produit</h1>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form onSubmit={handleAddProduct} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Nom du produit</label>
          <input
            type="text"
            className="form-control"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Prix</label>
          <input
            type="number"
            className="form-control"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Stock</label>
          <input
            type="number"
            className="form-control"
            value={product.stock}
            onChange={(e) => setProduct({ ...product, stock: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Image</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setImageFile(e.target.files[0])} 
          />
        </div>
        <button type="submit" className="btn btn-primary">Ajouter le produit</button>
      </form>
    </div>
  );
};

export default AddProductPage;
