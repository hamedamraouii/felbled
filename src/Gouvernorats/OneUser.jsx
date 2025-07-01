import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './OneUser.css';
import Footer from '../Footer';
import GoogleMapEmbed from "./PigeonMapComponent";
import SocialMediaLinks from './SocialMediaLinks';

const OneUser = () => {
  const { userName } = useParams();
  const location = useLocation();
  const locationStateUser = location.state?.user;

  const [user, setUser] = useState(locationStateUser || null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [usersData, setUsersData] = useState([]);

  // Récupère les données JSON
  useEffect(() => {
    fetch('/data/users.json')
      .then((res) => res.json())
      .then((data) => setUsersData(data))
      .catch((err) => console.error('Erreur chargement JSON :', err));
  }, []);

  // Trouve l'utilisateur si pas encore défini
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

  // Définir les images (même si user est null au début)
  const images = user?.images_url
    ? Array.isArray(user.images_url)
      ? user.images_url
      : [user.images_url]
    : [
        'https://cdn.futura-sciences.com/cdn-cgi/image/width=1024,quality=60,format=auto/sources/images/dossier/773/01-intro-773.jpg',
        'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
        'https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg',
      ];

  // Carousel auto défilement
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

  if (!user) {
    return <div className="no-user">Aucun utilisateur trouvé.</div>;
  }

  const video = user.video || '';
  const social = user.socialmedia || [];
  const etiquettes = user.etiquette || [];

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
              <p className="user-address">{user.address}</p>
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