import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./gouvernorats.css";
import Footer from "../Footer";
import Search from "../components/search/Search";
import { useTranslation } from "react-i18next";

const Gouvernorats = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const [gouvernorats, setGouvernorats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //  Charger les gouvernorats depuis le backend
  useEffect(() => {
    fetch('/api/gouvernorats')
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur API gouvernorats: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.success && data.governorats) {
          setGouvernorats(data.governorats);
        } else {
          setError("Aucun gouvernorat trouvé");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur chargement gouvernorats :', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleGouvernoratClick = (gouvernorat) => {
    navigate(`/tunisie/${gouvernorat.name.toLowerCase()}`, {
      state: { 
        gouvernoratData: {
          image_url: gouvernorat.image_url || gouvernorat.image?.url,
          delegations: gouvernorat.delegations
        }, 
        gouvernoratName: gouvernorat.name 
      },
    });
  };

  if (loading) return <div style={{ padding: '2rem' }}>Chargement des gouvernorats...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>Erreur : {error}</div>;

  return (
    <div className="gouvernorats-container">
      {/* Header with an image */}
      <div className="header-gouv">
        <img
          className="gouv-image-desktop"
          src="/gouvernorats/tunisie_desktop.webp"
          alt=""
        />
        <img
          className="gouv-image-mobile"
          src="/gouvernorats/treyet.webp"
          alt=""
        />
      </div>

      <div className="container-gouv">
        {/* Main container */}
        <div className="ad-container-left-gouv"></div>
        <div className="list-container-gouv">
          {gouvernorats.map((gouvernorat) => {
            const imageUrl = gouvernorat.image_url || gouvernorat.image?.url;

            return (
              <div
                key={gouvernorat._id}
                className="item-container-gouv"
                onClick={() => handleGouvernoratClick(gouvernorat)}
              >
                <img
                  className="gouv-image"
                  src={imageUrl}
                  alt={gouvernorat.name}
                />
                <div className="gouv-name">{t(gouvernorat.name)}</div>
              </div>
            );
          })}
        </div>
        <div className="ad-container-right-gouv"></div>
      </div>

      <Footer />
    </div>
  );
};

export default Gouvernorats;
