import React from 'react';
import './aboutUs.css';
import { useTranslation } from 'react-i18next';

const AboutUs = () => {
  const { t } = useTranslation();
  
  // Convert '\n' in text to <br /> for proper rendering of line breaks
  const getTextWithLineBreaks = (text) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <div className="main-container">
      <div className="area">
        <ul className="circles">
          <li className="circle-1"></li>
          <li className="circle-2"></li>
          <li className="circle-3"></li>
          <li className="circle-4"></li>
          <li className="circle-5"></li>
          <li className="circle-6"></li>
          <li className="circle-7"></li>
          <li className="circle-8"></li>
          <li className="circle-9"></li>
          <li className="circle-10"></li>
        </ul>
        
        <div className="center-text-container">
          <div className="centered">
            <h2 className="about-us-title">{t("A Propos Felbled")}</h2>
          </div>
          <div className="center">
            {/* Render the text with line breaks */}
            <p>{getTextWithLineBreaks(t("Felbled est une plateforme qui offre un guide virtuel vers des liens utiles pour les internautes afin de donner suite à leurs besoins tels que les placards publicitaires, la liste des services, les adresses, les contacts, les petites annonces de chaque pays. Elle permet également les clients de se faire connaitre leurs sociétés et leurs produits et être en fasse de marché.\n\nLa Tour du Monde en un Seul CLICK!"))}</p> {/* Changer ici */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;