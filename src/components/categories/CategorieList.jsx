import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./categorie.css";
import Header from "../../HomePage/Header.jsx";
import Footer from "../../Footer.jsx";
import Search from '../search/Search.jsx';

const CategorieList = () => {
  const navigate = useNavigate();
  const { gouvernoratName, secteurName } = useParams();
  const location = useLocation();
  // Récupérer l'ID du secteur depuis l'URL ou le state
  const secteurId =
    secteurName && secteurName.match(/^[0-9a-fA-F]{24}$/)
      ? secteurName
      : location.state?.secteurId;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!secteurId) return;
    fetch(`/api/categories?secteur=${secteurId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur API catégories");
        return res.json();
      })
      .then((data) => {
        if (data.success && data.categories) {
          setCategories(data.categories);
        } else {
          setError("Aucune catégorie trouvée");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [secteurId]);

  const handleCategoryClick = (category) => {
    // Naviguer vers la route qui attend l'ID de la catégorie pour afficher les sous-catégories
    navigate(
      `/tunisie/${gouvernoratName}/${secteurName}/categories/${category._id}/souscategories`,
      {
        state: { category },
      }
    );
  };

  if (loading)
    return <div style={{ padding: "2rem" }}>Chargement des catégories...</div>;
  if (error)
    return (
      <div style={{ padding: "2rem", color: "red" }}>Erreur : {error}</div>
    );

  return (
    <>
      <Header />
      <Search />
      <div className="container-categorie">
        <div className="ad-container-left-categorie"></div>
        <div className="list-container-categorie">
          {categories.map((category) => (
            <div
              key={category._id}
              className="item-container-categorie"
              onClick={() => handleCategoryClick(category)}
            >
              <div className="image-container-categorie">
                <img
                  className="image-categorie"
                  src={
                    category.image_url ||
                    category.image?.url ||
                    category.image
                  }
                  alt={category.name}
                />
                <div className="overlay-categorie">
                  <span className="categorie-name-categorie">{category.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="ad-container-right-categorie"></div>
      </div>
      <Footer />
    </>
  );
};

export default CategorieList;
