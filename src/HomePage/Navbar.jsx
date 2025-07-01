import React from "react";
import "./Navbar.css";
import { Home, Info, Mail, Globe } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/logo.png" alt="Felbled Logo" className="logo" />
      </div>

      <div className="navbar-welcome">
        <h2>WELCOME TO OUR SITE</h2>
      </div>

      <div className="navbar-links">
        <a href="#" className="navbar-link">
          <Home size={18} />
          <span>Accueil</span>
        </a>
        <a href="#about" className="navbar-link">
          <Info size={18} />
          <span>À propos</span>
        </a>
        <a href="#contact" className="navbar-link">
          <Mail size={18} />
          <span>Contactez Nous</span>
        </a>
        <button className="language-selector">
          <Globe size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
