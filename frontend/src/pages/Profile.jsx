import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    address: '',
    password: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile({
          name: response.data.name,
          address: response.data.address || '',
          password: '', 
        });
      } catch (err) {
        console.error(err);
        setErrorMessage('Erreur lors de la récupération des informations.');
      }
    };

    fetchProfile();
  }, [userId, token]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/${userId}`,
        {
          name: profile.name,
          address: profile.address,
          password: profile.password || undefined, 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage('Profil mis à jour avec succès.');
      setTimeout(() => setSuccessMessage(''), 3000); 
    } catch (err) {
      console.error(err);
      setErrorMessage('Erreur lors de la mise à jour du profil.');
    }
  };

  return (
    <div className="container mt-5">
      <h1>Mon Profil</h1>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form onSubmit={handleUpdateProfile}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nom</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">Adresse Postale</label>
          <input
            type="text"
            className="form-control"
            id="address"
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Nouveau Mot de Passe</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={profile.password}
            onChange={(e) => setProfile({ ...profile, password: e.target.value })}
          />
          <small className="form-text text-muted">
            Laissez vide si vous ne souhaitez pas changer le mot de passe.
          </small>
        </div>
        <button type="submit" className="btn btn-primary">Mettre à jour</button>
      </form>
    </div>
  );
};

export default Profile;
