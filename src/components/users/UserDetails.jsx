
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./users.css";
import Footer from '../../Footer.jsx';
import Header from '../../HomePage/Header.jsx';
import Search from '../search/Search.jsx';
import GoogleMapEmbed from "../../Gouvernorats/PigeonMapComponent.jsx";
import SocialMediaLinks from '../../Gouvernorats/SocialMediaLinks.jsx';


const UserDetails = () => {
  const location = useLocation();
  const { userId } = useParams();
  const [user, setUser] = useState(location.state?.user || null);
  const [loading, setLoading] = useState(!user);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    if (user) return;
    fetch(`/api/users/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Utilisateur introuvable");
        return res.json();
      })
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setError("Utilisateur non trouvé");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [user, userId]);

  // Carousel images
  const images = user?.images_url && Array.isArray(user.images_url) && user.images_url.length > 0
    ? user.images_url
    : (user?.images && Array.isArray(user.images) && user.images.length > 0
      ? user.images.map(img => img.url)
      : [user?.logo?.url || user?.logo_url || '/default-user.png']);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  const handleNext = () => setSelectedImage((prev) => (prev + 1) % images.length);
  const handlePrev = () => setSelectedImage((prev) => (prev - 1 + images.length) % images.length);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des données utilisateur...</p>
      </div>
    );
  }
  if (error || !user) {
    return (
      <div className="no-user">
        <h2>Aucun utilisateur trouvé</h2>
        <p>L'utilisateur n'existe pas ou n'a pas pu être chargé.<br/>Erreur: {error}</p>
      </div>
    );
  }

  const video = user.video || '';
  const social = user.socialmedia || [];
  const etiquettes = user.etiquette || [];
  const gouvernoratName = typeof user.gouvernorat === 'object' && user.gouvernorat?.name 
    ? user.gouvernorat.name 
    : user.gouvernorat || '';
  const delegationName = typeof user.delegation === 'object' && user.delegation?.name 
    ? user.delegation.name 
    : user.delegation || '';
  const fullAddress = [user.address, delegationName, gouvernoratName].filter(Boolean).join(', ');

  return (
    <>
      <Header />
      <Search />
      <div className="user-profile">
      {/* Carousel Section */}
      <div className="carousel-section">
        <div className="carousel-container">
          <div className="carousel-arrow left" onClick={handlePrev}>&#10094;</div>
          <img
            src={images[selectedImage]}
            alt={`Image ${selectedImage + 1}`}
            className="carousel-image"
            onError={(e) => {
              if (e.target.src !== '/default-user.png') {
                e.target.src = '/default-user.png';
              }
            }}
          />
          <div className="carousel-arrow right" onClick={handleNext}>&#10095;</div>
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
              src={user.logo?.url || user.logo_url || '/default-user.png'}
              alt={`${user.name} Logo`}
              className="user-logo"
              onError={(e) => {
                if (e.target.src !== '/default-user.png') {
                  e.target.src = '/default-user.png';
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
    </>
  );
};

export default UserDetails;
