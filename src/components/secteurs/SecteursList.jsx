import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./secteurs.css";
import Header from '../../HomePage/Header.jsx';
import Search from '../search/Search.jsx';
import Footer from "../../Footer.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faWrench, faUmbrellaBeach, faVanShuttle, faBellConcierge } from '@fortawesome/free-solid-svg-icons';
import './quicklinks-secteurs.css';
const SecteursList = () => {
  const navigate = useNavigate();
  const { gouvernoratName } = useParams();
  const [secteurs, setSecteurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/secteurs?gouvernorat=${gouvernoratName}`)
      .then((res) => {
        if (!res.ok) throw new Error('Erreur API secteurs');
        return res.json();
      })
      .then((data) => {
        if (data.success && data.secteurs) {
          console.log('SECTEURS API DATA:', data.secteurs);
          setSecteurs(data.secteurs);
        } else {
          setError("Aucun secteur trouvé");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [gouvernoratName]);

  const handleSecteurClick = (secteur) => {
    // Naviguer vers la liste des catégories du secteur sélectionné, en passant l'ID du secteur
    navigate(`/tunisie/${gouvernoratName}/${secteur._id}/categories`, {
      state: { secteurId: secteur._id, secteurName: secteur.name }
    });
  };

  if (loading) return <div style={{ padding: '2rem' }}>Chargement des secteurs...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>Erreur : {error}</div>;

  return (
    <>
      <Header />
      
      <div className="container-gouv" style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        {/* Left Section: Quick Links */}
        <div className="left-section-cat" style={{ width: '18%', minWidth: '180px', maxWidth: '320px' }}>
          <div className="quick-links-cat">
            <h2>Liens rapides</h2>
            <div className="links-container">
              {secteurs && secteurs.length > 0 && (
                <>
                  {secteurs.find(s => s.name.toLowerCase().includes('shopping')) && (
                    <div className="link" style={{padding: '8px 10px', margin: '6px 0', minHeight: '38px', fontSize: '15px'}} onClick={() => handleSecteurClick(secteurs.find(s => s.name.toLowerCase().includes('shopping')))}>
                      <h4 style={{fontStyle: 'italic', fontWeight: 600, fontSize: '15px'}}>SHOPPING</h4>
                      <FontAwesomeIcon icon={faCartShopping} style={{color: '#3ab6d5', fontSize: 20}} />
                    </div>
                  )}
                  {secteurs.find(s => s.name.toLowerCase().includes('métier') || s.name.toLowerCase().includes('metier')) && (
                    <div className="link" style={{padding: '8px 10px', margin: '6px 0', minHeight: '38px', fontSize: '15px'}} onClick={() => handleSecteurClick(secteurs.find(s => s.name.toLowerCase().includes('métier') || s.name.toLowerCase().includes('metier')))}>
                      <h4 style={{fontStyle: 'italic', fontWeight: 600, fontSize: '15px'}}>METIER</h4>
                      <FontAwesomeIcon icon={faWrench} style={{color: '#3ab6d5', fontSize: 20}} />
                    </div>
                  )}
                  {secteurs.find(s => s.name.toLowerCase().includes('loisir')) && (
                    <div className="link" style={{padding: '8px 10px', margin: '6px 0', minHeight: '38px', fontSize: '15px'}} onClick={() => handleSecteurClick(secteurs.find(s => s.name.toLowerCase().includes('loisir')))}>
                      <h4 style={{fontStyle: 'italic', fontWeight: 600, fontSize: '15px'}}>LOISIR</h4>
                      <FontAwesomeIcon icon={faUmbrellaBeach} style={{color: '#3ab6d5', fontSize: 20}} />
                    </div>
                  )}
                  {secteurs.find(s => s.name.toLowerCase().includes('transport')) && (
                    <div className="link" style={{padding: '8px 10px', margin: '6px 0', minHeight: '38px', fontSize: '15px'}} onClick={() => handleSecteurClick(secteurs.find(s => s.name.toLowerCase().includes('transport')))}>
                      <h4 style={{fontStyle: 'italic', fontWeight: 600, fontSize: '15px'}}>TRANSPORT</h4>
                      <FontAwesomeIcon icon={faVanShuttle} style={{color: '#3ab6d5', fontSize: 20}} />
                    </div>
                  )}
                  {secteurs.find(s => s.name.toLowerCase().includes('service')) && (
                    <div className="link" style={{padding: '8px 10px', margin: '6px 0', minHeight: '38px', fontSize: '15px'}} onClick={() => handleSecteurClick(secteurs.find(s => s.name.toLowerCase().includes('service')))}>
                      <h4 style={{fontStyle: 'italic', fontWeight: 600, fontSize: '15px'}}>SERVICES</h4>
                      <FontAwesomeIcon icon={faBellConcierge} style={{color: '#3ab6d5', fontSize: 20}} />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        {/* Middle Section: Search Bar and Secteurs List */}
        <div className="middle-section-secteurs" style={{ flex: 1, padding: '0 24px' }}>
          {/* Gouvernorat image and name at the top, styled like categoryData example */}
          <div className="background-image-container">
            {/* DEBUG: Gouvernorat object */}
            {secteurs.length > 0 && secteurs[0].gouvernorat && (
              <pre style={{ background: '#f8f8f8', color: '#333', fontSize: 12, padding: 8, border: '1px solid #eee', marginBottom: 8 }}>
                <strong>Gouvernorat debug:</strong> {JSON.stringify(secteurs[0].gouvernorat, null, 2)}
              </pre>
            )}
           <img
  src={(() => {
    let img = '/background.jpg';
    if (secteurs.length > 0 && secteurs[0].gouvernorat) {
      if (secteurs[0].gouvernorat.image && typeof secteurs[0].gouvernorat.image === 'object' && secteurs[0].gouvernorat.image.url) {
        img = secteurs[0].gouvernorat.image.url;
      } else if (secteurs[0].gouvernorat.image_url) {
        img = secteurs[0].gouvernorat.image_url;
      } else if (typeof secteurs[0].gouvernorat.image === 'string') {
        img = secteurs[0].gouvernorat.image;
      }
    }
    console.log('GOUV IMG USED:', img, secteurs[0]?.gouvernorat);
    return img;
  })()}
  alt={
    secteurs.length > 0 && secteurs[0].gouvernorat && secteurs[0].gouvernorat.name
      ? secteurs[0].gouvernorat.name
      : gouvernoratName
  }
  className="gouvernaurat-image"
/>
            <div className="image-overlay-text">
              <p className="category-name">
                {secteurs.length > 0 && secteurs[0].gouvernorat && secteurs[0].gouvernorat.name
                  ? secteurs[0].gouvernorat.name
                  : gouvernoratName}
              </p>
            </div>
          </div>
          <Search />
          <div className="list-container-gouv">
            {secteurs.map((secteur) => {
              const imageUrl = secteur.image;
              return (
                <div
                  key={secteur._id}
                  className="item-container-gouv"
                  onClick={() => handleSecteurClick(secteur)}
                >
                  <div className="image-container-gouv">
                    <img
                      className="image-gouv"
                      src={imageUrl}
                      alt={secteur.name}
                    />
                    <div className="overlay-gouv">
                      <span className="gouvernorat-name-gouv">{secteur.name}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Right Section: Felbled Logo */}
        <div className="right-section-secteurs" style={{ width: '18%', minWidth: '180px', maxWidth: '320px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '24px 18px', marginTop: '38px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' , height: '50%'  }}>
            <img src="/assets/logo_footerLast.png" alt="Felbled Logo" className="secteur-logo" style={{ width: '240px', height: 'auto' }} />
          </div>
        </div>
      </div>
       <Footer />
    </>
  );
};

export default SecteursList;
