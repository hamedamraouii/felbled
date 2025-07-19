import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faTiktok,
  faXTwitter,
  faSnapchat,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

const FooterComponent = () => {
  return (
    <div className="footer-container">
      <div className="footer-section">
   <img src="/assets/logo_footerlast.png" alt="felbled" />
      </div>
      <div className="footer-section">
        <h3>Felbled Info</h3>
        <ul>
          <li>
            <a href="mailto:info@felbled.com">
              {" "}
              <span>
                <FontAwesomeIcon icon={faEnvelope} />
                Email:
              </span>{" "}
              info@felbled.com
            </a>
          </li>
          <li>
            <a href="mailto:dg@felbled.com">
              {" "}
              <span>
                <FontAwesomeIcon icon={faEnvelope} />
                Email:
              </span>{" "}
              dg@felbled.com
            </a>
          </li>
          <li>
            <a href="#services">
              <span>
                <FontAwesomeIcon icon={faPhone} />
                Phone:
              </span>{" "}
              +216 53270270
            </a>
          </li>
        </ul>
      </div>
      <div className="footer-section">
        <h3>Liens Rapides</h3>
        <ul>
          <li>
            <Link to="/tunisie/Bizerte">
              <FontAwesomeIcon icon={faLocationDot} /> Bizerte
            </Link>
          </li>
          <li>
            <Link to="/tunisie/Tunis">
              <FontAwesomeIcon icon={faLocationDot} /> Tunis
            </Link>
          </li>
          <li>
            <Link to="/tunisie/Sousse">
              <FontAwesomeIcon icon={faLocationDot} /> Sousse
            </Link>
          </li>
          <li>
            <Link to="/tunisie/Medenine">
              <FontAwesomeIcon icon={faLocationDot} /> Médenine
            </Link>
          </li>
        </ul>
      </div>
      <div className="footer-section">
        <h3>Suivez Nous</h3>
        <ul>
          <li>
            <a
              href="https://www.facebook.com/profile.php?id=61571253933313"
              id="fb"
            >
              <FontAwesomeIcon icon={faFacebook} />
              Facebook
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/felblad.bigdata/" id="insta">
              <FontAwesomeIcon icon={faInstagram} />
              Instagram
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/felblad-platform-4aa8b5337/"
              id="link"
            >
              <FontAwesomeIcon icon={faLinkedin} />
              LinkedIN
            </a>
          </li>
          <li>
            <a href="https://www.tiktok.com/@felbled.platform" id="tik">
              <FontAwesomeIcon icon={faTiktok} />
              Tiktok
            </a>
          </li>
          <li>
            <a href="https://x.com/felblad" id="x">
              <FontAwesomeIcon icon={faXTwitter} />X
            </a>
          </li>
          <li>
            <a href="https://www.snapchat.com/add/felbled.bigdata" id="snap">
              <FontAwesomeIcon icon={faSnapchat} />
              Snapchat
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com/@felbled" id="yt">
              <FontAwesomeIcon icon={faYoutube} />
              Youtube
            </a>
          </li>
        </ul>
        <div className="footer">
          <p>&copy; 2025 Felbled. All rights reserved </p>
        </div>
      </div>
    </div>
  );
};

export default FooterComponent;
