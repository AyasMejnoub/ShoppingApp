import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filter, setFilter] = useState({ name: "", minPrice: "", maxPrice: "" });
  const [filtersApplied, setFiltersApplied] = useState(false); 
  const [notification, setNotification] = useState("");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((response) => {
        setProducts(response.data);
        setFilteredProducts(response.data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    let filtered = products;

    if (filter.name) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(filter.name.toLowerCase())
      );
    }

    if (filter.minPrice) {
      filtered = filtered.filter((product) => product.price >= parseFloat(filter.minPrice));
    }

    if (filter.maxPrice) {
      filtered = filtered.filter((product) => product.price <= parseFloat(filter.maxPrice));
    }

    setFilteredProducts(filtered);
    setFiltersApplied(filter.name || filter.minPrice || filter.maxPrice); 
  }, [filter, products]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const resetFilters = () => {
    setFilter({ name: "", minPrice: "", maxPrice: "" });
    setFilteredProducts(products);
    setFiltersApplied(false); 
  };

  const handleAddToCart = async (productId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/cart/add-to-cart/${userId}`,
        { productId, quantity: 1 },
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

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Bienvenue à votre shop !</h1>

      {/* Formulaire de filtre */}
      <div className="mb-4">
        <h3>Filtres</h3>
        <div className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Nom du produit"
              name="name"
              value={filter.name}
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              placeholder="Prix minimum"
              name="minPrice"
              value={filter.minPrice}
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              placeholder="Prix maximum"
              name="maxPrice"
              value={filter.maxPrice}
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-secondary w-100" onClick={resetFilters}>
              Réinitialiser 
            </button>
          </div>
        </div>
      </div>

      {/* Compteur de produits */}
      {filtersApplied && (
        <p className="text-center mb-4">{filteredProducts.length} produit(s) trouvé(s).</p>
      )}

      {/* Notifications */}
      {notification && (
        <div className={`alert ${notification.includes("succès") ? "alert-success" : "alert-danger"} text-center`}>
          {notification}
        </div>
      )}

      {/* Affichage des produits */}
      <div className="row">
        {filteredProducts.length === 0 ? (
          <p className="text-center">Aucun produit ne correspond aux critères de recherche.</p>
        ) : (
          filteredProducts.map((product) => (
            <div className="col-md-4 mb-4" key={product._id}>
              <div className="card h-100">
                {product.image && (
                  <img
                    src={`http://localhost:5000${product.image}`}
                    className="card-img-top"
                    alt={product.name}
                    style={{ maxHeight: "200px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <p>
                    <strong>Prix :</strong> {product.price} €
                  </p>
                  <button
                    className="btn btn-secondary mt-2"
                    onClick={() => handleViewDetails(product._id)}
                  >
                    Plus de détails
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
