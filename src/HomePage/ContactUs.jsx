import React from 'react';
import { FaTiktok,FaSnapchat,FaFacebook , FaInstagram, FaLinkedin, FaGoogle, FaYoutube } from 'react-icons/fa';
import './contactUs.css';
import { FaS, FaXTwitter } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

const ContactUsComponent = () => {
  const { t, i18n } = useTranslation();
  return (
    <div className="contact-container-contact">
      <div className="image-container-contact">
        <img
          src="https://thecustomizewindows.cachefly.net/wp-content/uploads/2024/08/What-Happens-When-Your-Phone-Spies-on-You.jpg"
          alt="Contact Us"
          className="contact-image-contact"
        />
        <div className="overlay-contact">
          <h2 className="contact-title-contact">{t("Contact Felbled")}</h2>

          <div className="social-media-container-contact">
            <ul className="social-media-list-contact">
              <li className="social-media-item-contact">
                <a href="https://www.facebook.com/profile.php?id=61571253933313" target="_blank" rel="noopener noreferrer">
                  <FaFacebook className="social-icon-contact" />
                </a>
              </li>
              <li className="social-media-item-contact">
                <a href="https://x.com/felblad" target="_blank" rel="noopener noreferrer">
                  <FaXTwitter className="social-icon-contact" />
                </a>
              </li>
              <li className="social-media-item-contact">
                <a href="https://www.instagram.com/felbled.platform/" target="_blank" rel="noopener noreferrer">
                  <FaInstagram className="social-icon-contact" />
                </a>
              </li>
              <li className="social-media-item-contact">
                <a href="https://www.linkedin.com/in/felblad-platform/" target="_blank" rel="noopener noreferrer">
                  <FaLinkedin className="social-icon-contact" />
                </a>
              </li>
              <li className="social-media-item-contact">
                <a href="https://wa.me/+21653270270" target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp className="social-icon-contact" />
                </a>
              </li>
              <li className="social-media-item-contact">
                <a href="https://youtube.com/@felbled?si=9-bCbESkIZRAvaj5" target="_blank" rel="noopener noreferrer">
                  <FaYoutube className="social-icon-contact" />
                </a>
              </li>
              <li className="social-media-item-contact">
                <a href="https://www.snapchat.com/add/felbled.bigdata?share_id=z-tmpdwDfH0&locale=fr-FR" target="_blank" rel="noopener noreferrer">
                  <FaSnapchat className="social-icon-contact" />
                </a>
              </li>
              <li className="social-media-item-contact">
                <a href="https://www.tiktok.com/@felbled.platform" target="_blank" rel="noopener noreferrer">
                  <FaTiktok className="social-icon-contact" />
                </a>
              </li>
              {/* <li className="social-media-item-contact">
                <a href="mailto:support@felblad.com" target="_blank" rel="noopener noreferrer">
                  <FaGoogle className="social-icon-contact" />
                </a>
              </li> */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsComponent;
