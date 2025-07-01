import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { FaS, FaXTwitter } from "react-icons/fa6";
import './OneUser.css';
import { FaFacebookF, FaInstagram ,FaSnapchat} from 'react-icons/fa';
import Footer from '../Footer';
import PigeonMapComponent from "./PigeonMapComponent";
import SocialMediaLinks from './SocialMediaLinks';


const OneUser = () => {
  const { userName } = useParams();
  const location = useLocation();
  const { user } = location.state || {}; // Get the user data from state

  const [selectedImage, setSelectedImage] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  // Handle the case where the user is undefined
  if (!user) {
    return <div>No user data available.</div>;
  }

  // Ensure images_url is an array
  const images = user.images_url
    ? Array.isArray(user.images_url)
      ? user.images_url
      : [user.images_url]
    : [
        'https://cdn.futura-sciences.com/cdn-cgi/image/width=1024,quality=60,format=auto/sources/images/dossier/773/01-intro-773.jpg',
        'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
        'https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg',
      ];
  const social = user.socialmedia;
  const latitude=user.latitude;
  const longitude=user.longitude;
  const etiquettes = user.etiquette || [
    { icon: '🌟', text: 'Friendly' },
    { icon: '🚀', text: 'Ambitious' },
    { icon: '🎨', text: 'Creative' },
  ];

  // Handling carousel navigation
  const handleNext = () => {
    console.log("next");
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="user-profile">
      {/* Carousel Section */}
      <div className="carousel-section">
        <div className="carousel-container">
          <div className="carousel-arrow left" onClick={handlePrev} aria-label="Previous image">
            &#10094;
          </div>
          <img
            src={images[selectedImage]}
            alt={`Carousel Image ${selectedImage + 1}`}
            className="carousel-image"
            onError={(e) => {
              if (e.target.src !== 'https://via.placeholder.com/800x400') {
                e.target.src = 'https://via.placeholder.com/800x400'; // Fallback image
              }
            }}
          />
          <div className="carousel-arrow right" onClick={handleNext} aria-label="Next image">
            &#10095;
          </div>
        </div>
        <div className="carousel-spheres">
          {images.map((_, index) => (
            <div
              key={index}
              className={`sphere ${selectedImage === index ? 'active' : ''}`}
              onClick={() => setSelectedImage(index)}
              role="button"
              aria-label={`Image ${index + 1}`}
            ></div>
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
                  e.target.src = 'https://via.placeholder.com/150'; // Fallback logo
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
                   <button
                       onClick={() => setShowPhone(true)}
                     className="show-phone-btn"
                    >
                       Afficher le numéro
                          </button>
                      )}
                     </p>
                  <p className="user-horaire"><span>Horaire de travail : </span>{user.horaire}</p>
            </div>
          </div>

          {/* Social Icons */}
          <div className="social-icons">
          <SocialMediaLinks socialMedia={social} />
            
            
          
          
           


          </div></div>
         
        
         {/* Description and Etiquettes */}
      <div className="profile-description">
        <h2 className="description-title">Description</h2> <br/>
        <p
          className="user-description"
          dangerouslySetInnerHTML={{
            __html: user.description ? user.description.replace(/\n/g, '<br />') : 'No description available.',
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

        {/* Map */}
       
        <div className="map-container">
       
       
       
       <PigeonMapComponent latitude={latitude} longitude={longitude} />
         </div>
       </div>
     

      <Footer />
    </div>
  );
};

export default OneUser;