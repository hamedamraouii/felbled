// src/SocialMediaLinks.js
import React from 'react';
import { FaTiktok,FaSnapchat,FaFacebook , FaInstagram, FaLinkedin, FaGoogle, FaYoutube,FaWhatsapp } from 'react-icons/fa'; // Importer les icônes
import { FaS, FaXTwitter } from "react-icons/fa6";
const SocialMediaLinks = ({ socialMedia }) => {
  // Fonction pour obtenir l'icône correspondante au nom du réseau social
  const getIcon = (name) => {
    switch (name) {
      case 'Facebook':
        return <FaFacebook />;
      case 'X':
        return <FaXTwitter  />;
      case 'Instagram':
        return <FaInstagram />;
      case 'LinkedIn':
        return <FaLinkedin />;
        case 'Tiktok':
        return <FaTiktok/>;
        case 'Snapchat':
        return <FaSnapchat/>;
        
      
        case 'Youtube':
        return <FaYoutube/>;
        case 'Whatsapp':
        return <FaWhatsapp/>;
      default:
        return null;
    }
  };

  return (
    <div>
      {socialMedia.length > 0 ? (
        <div style={{ display: 'flex', gap: '10px' }}>
          {socialMedia.map((link, index) => (
            <a 
              key={index} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {getIcon(link.name)} {/* Afficher l'icône */}
                
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p>L'utilisateur n'a pas de réseaux sociaux.</p>
      )}
    </div>
  );
};

export default SocialMediaLinks;
