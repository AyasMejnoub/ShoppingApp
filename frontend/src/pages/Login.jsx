import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      const decode = jwtDecode(response.data.token);
      console.log("decode=>", decode);
      localStorage.setItem("role", response.data.role);
      console.log("Rôle enregistré dans localStorage :", response.data.role); // Log pour vérifier
      localStorage.setItem('userId', decode?.id); 
      navigate('/'); 
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    }
  };

  return (
    <div className="container mt-5">
      <h1>Connexion</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Mot de passe</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Se connecter</button>
      </form>
      {/* Ajout du lien vers la page d'inscription */}
      <p className="mt-3">
        Vous n'avez pas de compte ?{" "}
        <Link to="/register" className="text-primary">
          Créer un compte
        </Link>
      </p>
    </div>
  );
};

export default Login;
