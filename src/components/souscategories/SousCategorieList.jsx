import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./souscategorie.css";
import Header from "../../HomePage/Header.jsx";
import Search from '../search/Search.jsx';
import Footer from "../../Footer.jsx";

const SousCategorieList = () => {
  const { categoryId, gouvernoratName, gouvernoratId } = useParams();
  // DEBUG: log pour vérifier la valeur de gouvernoratName
  console.log('[SousCategorieList] gouvernoratName:', gouvernoratName);
  const navigate = useNavigate();
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoryId) return;
    fetch(`/api/categories/${categoryId}/subcategories`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur API sous-catégories");
        return res.json();
      })
      .then((data) => {
        if (data.success && data.subcategories) {
          setSubcategories(data.subcategories);
        } else {
          setError("Aucune sous-catégorie trouvée");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [categoryId]);

  // Correction : garantir que subcategories est toujours un tableau
  const safeSubcategories = Array.isArray(subcategories) ? subcategories : [];

  if (loading)
    return <div style={{ padding: "2rem" }}>Chargement des sous-catégories...</div>;
  if (error) return <div style={{ padding: "2rem", color: "red" }}>Erreur : {error}</div>;

  return (
    <>
      <Header />
      <Search />
      <div className="container-souscategorie">
        <div className="ad-container-left-souscategorie"></div>
        <div className="list-container-souscategorie">
          {safeSubcategories.map((subcat) => (
            <div
              key={subcat._id}
              className="item-container-souscategorie"
            onClick={() => {
              // On privilégie l'ID du gouvernorat si possible
              let govId = gouvernoratId || gouvernoratName;
              // Si la sous-catégorie contient un gouvernorat, on le prend
              if ((!govId || govId.trim() === "") && subcat.gouvernorat && (subcat.gouvernorat._id || typeof subcat.gouvernorat === 'string')) {
                govId = subcat.gouvernorat._id || subcat.gouvernorat;
              }
              if (govId && govId.trim() !== "") {
                navigate(`/users/gouvernorat/${govId}/subcategories/${subcat._id}`);
              } else {
                navigate(`/users/subcategories/${subcat._id}`);
              }
            }}
              style={{ cursor: "pointer" }}
            >
              <div className="image-container-souscategorie">
                <img
                  className="image-souscategorie"
                  src={subcat.image_url || subcat.image?.url || subcat.image}
                  alt={subcat.name}
                />
                <div className="overlay-souscategorie">
                  <span className="souscategorie-name-souscategorie">{subcat.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="ad-container-right-souscategorie"></div>
      </div>
      <Footer />
    </>
  );
};

export default SousCategorieList;
