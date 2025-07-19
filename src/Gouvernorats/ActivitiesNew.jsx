import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "./Categories.css";
import Footer from "../Footer";
import Search from "../components/search/Search";
import { useTranslation } from "react-i18next";
import AdSlider from "./AdSlider";

const Activities = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { gouvernoratName } = useParams();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  // 🔄 Charger les catégories depuis le backend
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => {
        if (!res.ok) throw new Error('Erreur API catégories');
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
        console.error('Erreur chargement catégories :', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
  };

  const handleSubcategoryClick = (subcategory) => {
    if (gouvernoratName) {
      // Naviguer vers la page des utilisateurs filtrés
      navigate(`/gouvernorat/${gouvernoratName}/${encodeURIComponent(subcategory.name)}`);
    }
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  const handleBackToSubcategories = () => {
    setSelectedSubcategory(null);
  };

  if (loading) return <div style={{ padding: '2rem' }}>Chargement des catégories...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>Erreur : {error}</div>;

  return (
    <div className="container-column">
      <div className="container-categories">
        <div className="left-section-categories">
          <Search />
        </div>

        <div className="middle-section-categories">
          <AdSlider />
          
          {!selectedCategory ? (
            // Affichage des catégories principales
            <>
              <h2 className="categories-title">Catégories d'activités</h2>
              <div className="categories-grid">
                {categories.map((category) => (
                  <div 
                    key={category._id} 
                    className="category-item"
                    onClick={() => handleCategoryClick(category)}
                  >
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="category-image"
                    />
                    <p className="category-name">{category.name}</p>
                  </div>
                ))}
              </div>
            </>
          ) : !selectedSubcategory ? (
            // Affichage des sous-catégories
            <>
              <div className="breadcrumb">
                <button onClick={handleBackToCategories} className="breadcrumb-link">
                  ← Retour aux catégories
                </button>
                <span> / {selectedCategory.name}</span>
              </div>
              
              <h2 className="categories-title">
                Sous-catégories de {selectedCategory.name}
              </h2>
              
              <div className="categories-grid">
                {selectedCategory.subcategories && selectedCategory.subcategories.map((subcategory) => (
                  <div 
                    key={subcategory._id} 
                    className="category-item"
                    onClick={() => handleSubcategoryClick(subcategory)}
                  >
                    <img 
                      src={subcategory.image} 
                      alt={subcategory.name} 
                      className="category-image"
                    />
                    <p className="category-name">{subcategory.name}</p>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>

        <div className="right-section-categories">
          {/* Section droite pour d'éventuelles publicités ou filtres */}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Activities;
