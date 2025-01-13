import { jwtDecode } from "jwt-decode";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const AppNavBar = () => {
  const token = localStorage.getItem("token");
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

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Shopping App
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Accueil
              </Link>
            </li>
            {token && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/cart">
                    Panier
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/orders">
                    Mes Commandes
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    Profil
                  </Link>
                </li>
                {/* Lien spécifique aux vendeurs et administrateurs */}
                {(role === "seller" || role === "admin") && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/seller-dashboard">
                      Gestion des Commandes
                    </Link>
                  </li>
                )}
                {/* Lien spécifique aux administrateurs */}
                {role === "admin" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin-dashboard">
                      Gestion des Produits
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>
          {token ? (
            <button
              className="btn btn-danger"
              onClick={handleLogout}
            >
              Déconnexion
            </button>
          ) : (
            <Link className="btn btn-primary" to="/login">
              Connexion
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AppNavBar;
