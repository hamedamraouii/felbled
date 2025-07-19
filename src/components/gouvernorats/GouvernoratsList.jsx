import React, { useEffect, useState } from "react";
import Search from '../search/Search.jsx';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Footer from "../../Footer.jsx";
import "./gouvernorats.css";

const GouvernoratsList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [gouvernorats, setGouvernorats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/gouvernorats/simple')
      .then((res) => {
        if (!res.ok) throw new Error('Erreur API gouvernorats');
        return res.json();
      })
      .then((data) => {
        if (data.success && data.gouvernorats) {
          setGouvernorats(data.gouvernorats);
        } else {
          setError("Aucun gouvernorat trouvé");
        }
        setLoading(false);
      })
      .catch((err) => {
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
    <>
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
              <div className="image-container-gouv">
                <img
                  className="image-gouv"
                  src={imageUrl}
                  alt={gouvernorat.name}
                />
                <div className="overlay-gouv">
                  <span className="gouvernorat-name-gouv">{t(gouvernorat.name)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="ad-container-right-gouv"></div>
         
    </div>
    <Footer />
  </>
  );
};

export default GouvernoratsList;
