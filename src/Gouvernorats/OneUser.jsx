import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './OneUser.css';
import Footer from '../Footer';
import GoogleMapEmbed from "./PigeonMapComponent";
import SocialMediaLinks from './SocialMediaLinks';

// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const OneUser = () => {
  const { userName } = useParams();
  const location = useLocation();
  const locationStateUser = location.state?.user;

  const [user, setUser] = useState(locationStateUser || null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch users data from backend API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/users`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          setUsersData(data.data);
        } else {
          throw new Error(data.error || 'Failed to fetch users');
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Find user if not already defined
  useEffect(() => {
    if (!user && usersData.length > 0) {
      const normalizedParam = decodeURIComponent(userName.trim().toLowerCase());
      const foundUser = usersData.find((u) => {
        const normalizedName = u.name?.trim().toLowerCase();
        return normalizedName === normalizedParam;
      });

      if (foundUser) {
        setUser(foundUser);
      }
    }
  }, [user, userName, usersData]);

  // Handle images (with fallback defaults)
  const images = user?.images_url
    ? Array.isArray(user.images_url)
      ? user.images_url
      : [user.images_url]
    : [
        'https://cdn.futura-sciences.com/cdn-cgi/image/width=1024,quality=60,format=auto/sources/images/dossier/773/01-intro-773.jpg',
        'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
        'https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg',
      ];

  // Carousel auto scroll
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images]);

  const handleNext = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  // Handle loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des données utilisateur...</p>
      </div>
    );
  }

  // Handle error state
  if (error && usersData.length === 0) {
    return (
      <div className="error-container">
        <h2>Erreur de chargement</h2>
        <p>Impossible de charger les données utilisateur: {error}</p>
        <button onClick={() => window.location.reload()}>
          Réessayer
        </button>
      </div>
    );
  }

  // Handle user not found
  if (!user) {
    return (
      <div className="no-user">
        <h2>Aucun utilisateur trouvé</h2>
        <p>L'utilisateur "{userName}" n'existe pas ou n'a pas pu être chargé.</p>
      </div>
    );
  }

  const video = user.video || '';
  const social = user.socialmedia || [];
  const etiquettes = user.etiquette || [];

  // Handle populated data from backend (gouvernorat and delegation might be objects)
  const gouvernoratName = typeof user.gouvernorat === 'object' && user.gouvernorat?.name 
    ? user.gouvernorat.name 
    : user.gouvernorat || '';
  
  const delegationName = typeof user.delegation === 'object' && user.delegation?.name 
    ? user.delegation.name 
    : user.delegation || '';

  const fullAddress = [user.address, delegationName, gouvernoratName]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="user-profile">
      {/* Carousel Section */}
      <div className="carousel-section">
        <div className="carousel-container">
          <div className="carousel-arrow left" onClick={handlePrev}>
            &#10094;
          </div>
          <img
            src={images[selectedImage]}
            alt={`Image ${selectedImage + 1}`}
            className="carousel-image"
            onError={(e) => {
              if (e.target.src !== 'https://via.placeholder.com/800x400') {
                e.target.src = 'https://via.placeholder.com/800x400';
              }
            }}
          />
          <div className="carousel-arrow right" onClick={handleNext}>
            &#10095;
          </div>
        </div>
        <div className="carousel-spheres">
          {images.map((_, index) => (
            <div
              key={index}
              className={`sphere ${selectedImage === index ? 'active' : ''}`}
              onClick={() => setSelectedImage(index)}
            />
          ))}
        </div>
      </div>

      <div className="profile-content">
        <div className="user-details">
          <div className="user-header">
            <img
              src={user.logo_url || 'https://via.placeholder.com/150'}
              alt={`${user.name} Logo`}
              className="user-logo"
              onError={(e) => {
                if (e.target.src !== 'https://via.placeholder.com/150') {
                  e.target.src = 'https://via.placeholder.com/150';
                }
              }}
            />
            <div className="user-info">
              <h1 className="user-name">{user.name}</h1>
              <p className="user-category">{user.activité}</p>
              <p className="user-address">{fullAddress}</p>
              <p className="user-phone">
                {showPhone ? (
                  user.telephone || '22 222 222'
                ) : (
                  <button onClick={() => setShowPhone(true)} className="show-phone-btn">
                    Afficher le numéro
                  </button>
                )}
              </p>
              <p className="user-horaire">
                <span>Horaire de travail : </span>{user.horaire}
              </p>
            </div>
          </div>

          <div className="social-icons">
            <SocialMediaLinks socialMedia={social} />
          </div>
        </div>

        <div className="map-container">
          <GoogleMapEmbed location={user.location} />
        </div>
      </div>

      <div className="profile-description">
        <div className="description-container">
          {video && (
            <div className="video-section">
              <video width="100%" height="auto" controls>
                <source src={video} type="video/mp4" />
                Votre navigateur ne supporte pas la vidéo.
              </video>
            </div>
          )}
        </div>

        <h2 className="description-title">Description</h2>
        <br />
        <p
          className="user-description"
          dangerouslySetInnerHTML={{
            __html: user.description
              ? user.description.replace(/\n/g, '<br />')
              : 'Aucune description disponible.',
          }}
        />
        <div className="etiquettes">
          {etiquettes.map((etiquette, index) => (
            <div key={index} className="etiquette">
              <span className="etiquette-icon">{etiquette.icon || '🌟'}</span>
              <span className="etiquette-text">{etiquette.text || etiquette.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="map-container-mobile">
        <GoogleMapEmbed location={user.location} />
      </div>

      <Footer />
    </div>
  );
};

export default OneUser;