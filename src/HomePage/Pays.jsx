import React from "react";
import { useNavigate } from "react-router-dom";
import "./pays.css";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

const ListItem = ({ isActive, image, title, comingSoon, onClick }) => {
  return (
    <div onClick={onClick} className="list-item-container">
      <div className={`list-item ${isActive ? "active" : "inactive"}`}>
        <div className="image-container">
          <img src={image} alt={title} className="image-pays" />
        </div>
        <div className="title">{title}</div>
      </div>
      {comingSoon && <div className="coming-soon">{comingSoon}</div>}
    </div>
  );
};

const Pays = () => {
  const navigate = useNavigate();
  const countries = [
    {
      isActive: true,
      image: "/flags/Tunisie.webp",
      title: "Tunisie",
      comingSoon: "",
    },
    {
      isActive: false,
      image: "/flags/Lybie.webp",
      title: "Libye",
      comingSoon: "Bientôt disponible",
    },
    {
      isActive: false,
      image: "/flags/Algerie.webp",
      title: "Algérie",
      comingSoon: "Bientôt disponible",
    },
    {
      isActive: false,
      image: "/flags/Maroc.webp",
      title: "Maroc",
      comingSoon: "Bientôt disponible",
    },
    {
      isActive: false,
      image: "/flags/Egypte.webp",
      title: "Egypte",
      comingSoon: "Bientôt disponible",
    },
  ];
  const { t, i18n } = useTranslation();

  const handleClick = (country) => {
    if (country.isActive) {
      navigate("/tunisie");
    } else {
      Swal.fire({
        title: t(country.title),
        text: t("Ce pays sera bientôt disponible."),
        imageUrl: country.image,
        imageWidth: 200,
        imageHeight: 100,
        imageAlt: t(country.title),
        confirmButtonText: t("OK"),
        width: 350,
      });
    }
  };

  return (
    <div className="pays-container">
      <div className="list-container-home cursor-pointer">
        {countries.map((country, index) => (
          <ListItem
            key={index}
            image={country.image}
            title={t(country.title)}
            comingSoon={country.comingSoon}
            isActive={country.isActive}
            onClick={() => handleClick(country)}
          />
        ))}
      </div>
    </div>
  );
};

export default Pays;
