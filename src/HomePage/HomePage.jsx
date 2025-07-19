import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Search from "../components/search/Search";
import Pays from "./Pays";
import Carousel from "./AboutUs";
import ContactUs from "./ContactUs";
import Footer from "../Footer";
import "./homePage.css";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Publicite from "./Publicite";
import CountUp from "react-countup";

const HomePage = () => {
  // Refs pour scroller aux différentes sections
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const mapRef = useRef(null);
  const contactRef = useRef(null);

  const location = useLocation();
  const { t } = useTranslation();

  // État pour gérer l'affichage du loader
  const [isLoading, setIsLoading] = useState(true);

  // Extraire l'état `activeSection` de la navigation (ou valeur par défaut)
  const { activeSection } = location.state || {};

  // Effet pour scroller à la section active
  useEffect(() => {
    const sectionToScroll = activeSection || "home"; // Défaut: "home"
    switch (sectionToScroll) {
      case "home":
        homeRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "about":
        aboutRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "map":
        mapRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "contact":
        contactRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      default:
        console.warn(`Unknown section: ${sectionToScroll}`);
        break;
    }
  }, [activeSection]);

  // Effet pour gérer le loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Cache le loader après 2 secondes
    }, 2000);

    return () => clearTimeout(timer); // Nettoie le timer si le composant est démonté
  }, []);

  return (
    <>
      {/* Si `isLoading` est true, afficher le loader */}
      {isLoading && (
        <div className="loader">
          <div className="loader-content">
            <img
              src="publicite/logo_footerlast.png"
              alt="Logo"
              className="loader-logo"
            />
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div>
        {/* Section d'accueil */}
        <section ref={homeRef} className="section">
          <header className="header">
            <div className="header-overlay-home">
              <div className="searchdesktop">
                <Search />
              </div>
              <Pays />
              <div className="Pub-mobile">
                <Publicite />
              </div>
              <div className="searchmobile">
                <Search />
              </div>
            </div>
          </header>
          <Helmet>
            <title>Felbled - Annuaire Tunisie</title>
            <meta
              name="description"
              content="felbled, annuaire tunisie, page jaune."
            />
            <link rel="canonical" href="https://felbled.com/" />
            <link rel="preload" as="image" href="/public/background6.png" />
          </Helmet>

          <div className="box-container">
            <div className="box">
              <div className="boxData">
                <CountUp
                  start={0}
                  end={2000}
                  duration={7.5}
                  separator=" "
                  suffix={t(" services disponibles!")}
                />
              </div>
            </div>
            <div className="box1">
              <div className="boxData">
                {t("Le premier annuaire en Tunisie qui vous fait de la PUB")}
              </div>
            </div>
            <div className="box">
              <div className="boxData">
                {t("Rejoignez notre communauté aujourd'hui!")}
              </div>
            </div>
          </div>
        </section>

        {/* Publicité pour desktop */}
        <div className="Pub-decktop">
          <Publicite />
        </div>

        {/* Section "À propos" */}
        <section ref={aboutRef} className="section">
          <Carousel />
        </section>

        {/* Section "Contact" */}
        <section ref={contactRef} className="section">
          <ContactUs />
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
