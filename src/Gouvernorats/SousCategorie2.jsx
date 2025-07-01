import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Categories.css';
import Footer from '../Footer';
import Search from './Search';
import { useTranslation } from 'react-i18next';

const Subcategories2 = () => {
  const { gouvernoratName, subcategory: subcategoryParam } = useParams();
  const [selectedDelegations, setSelectedDelegations] = useState([]);
  const [categoriesData, setCategoriesData] = useState(null);
  const [gouvernorats, setGouvernorats] = useState(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, gouvernoratsRes] = await Promise.all([
          fetch('/data/Categories.json'),
          fetch('/data/Gouvernorats.json')
        ]);
        const categoriesJson = await categoriesRes.json();
        const gouvernoratsJson = await gouvernoratsRes.json();
        setCategoriesData(categoriesJson);
        setGouvernorats(gouvernoratsJson);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };
    fetchData();
  }, []);

  const findSubcategoryByName = (subcategories, name) => {
    for (const sub of subcategories) {
      if (sub.name.toLowerCase() === name.toLowerCase()) return sub;
      if (sub.subcategories) {
        const result = findSubcategoryByName(sub.subcategories, name);
        if (result) return result;
      
      }
    }
    return null;
  };

  const subcategory = useMemo(() => {
    if (!categoriesData) return null;
    for (const key in categoriesData) {
      const cat = categoriesData[key];
      const found = findSubcategoryByName(cat.subcategories || [], subcategoryParam);
      if (found) return found;
    }
    return null;
  }, [categoriesData, subcategoryParam]);

  const gouvernoratData = useMemo(() => {
    if (!gouvernorats) return null;
    const item = gouvernorats.find(
      g => Object.keys(g)[0].toLowerCase() === gouvernoratName.toLowerCase()
    );
    return item ? item[Object.keys(item)[0]] : null;
  }, [gouvernorats, gouvernoratName]);

  const handleClick = (nestedSubcategory) => {
    console.log("Clicked subcategory: ", nestedSubcategory);
    if (nestedSubcategory.subcategories) {
      console.log("Nested subcategories found:", nestedSubcategory.subcategories);
      // If there are nested subcategories
      navigate(`/tunisie/${gouvernoratName.toLowerCase()}/${nestedSubcategory.name.toLowerCase()}`, {
        state: {
          subcategory: nestedSubcategory,  
          gouvernoratData,
          gouvernoratName,
        },
      });
    } else {
      console.log("No nested subcategories for:", nestedSubcategory.name);
      // If there are no further nested subcategories
      navigate(`/tunisie/${gouvernoratName.toLowerCase()}/${nestedSubcategory.name.toLowerCase()}`, {
        state: {
          gouvernoratName,
          gouvernoratData,
          subcategory: nestedSubcategory,   
          nestedSubcategory,
        },
      });
    }
  };
  



  const handleCheckboxChange = (delegation) => {
    setSelectedDelegations(prev =>
      prev.includes(delegation)
        ? prev.filter(d => d !== delegation)
        : [...prev, delegation]
    );
  };

  if (!categoriesData || !gouvernorats) {
    return <div style={{ padding: "2rem" }}>Chargement des données...</div>;
  }

  if (!subcategory || !gouvernoratData) {
    return <div style={{ padding: "2rem" }}>⚠ Données indisponibles pour cette sous-catégorie ou gouvernorat.</div>;
  }

  return (
    <div className="container-column">
      <div className="container-cat">
        {/* Left: Delegations List */}
        <div className="left-section-cat">
          <div className="gouvernaurat-container-cat">
            <h3 className="gouvernaurat-title-cat">{gouvernoratName}</h3>
            <ul className="delegation-list-cat">
              {gouvernoratData.delegations.map((delegation, index) => (
                <li key={index} className="delegation-item-cat">
                  <label>
                    <input
                      type="checkbox"
                      value={delegation}
                      checked={selectedDelegations.includes(delegation)}
                      onChange={() => handleCheckboxChange(delegation)}
                    />
                    {delegation}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Middle: Image + Subcategories */}
        <div className="middle-section-cat">
          <div className="background-image-container">
            <img
              src={`/${subcategory.image}`}
              alt={subcategory.name}
              className="gouvernaurat-image"
            />
            <div className="image-overlay-text">
              <p className="category-name">{subcategory.name}</p>
            </div>
          </div>

          <Search />

          <div className="categories-list-container">
          <div className="categories-grid">
  {subcategory.subcategories?.map((nested, index) => {
    console.log("Rendering subcategory: ", nested);  // Log de chaque sous-catégorie
    return (
      <div
        key={index}
        className="subcategory-item-cat cursor-pointer"
        onClick={() => handleClick(nested)}
      >
        <div className="image-container-cat">
          <img
            src={`/${nested.image}`}
            alt={nested.name}
            className="image-cat"
          />
          <div className="overlay-cat">
            <div className="overlay1-cat">
              <p className="subcategory-name-cat">{t(nested.name)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  })}
  {subcategory.subcategories?.length === 0 && (
    <div style={{ padding: "1rem" }}>Pas de sous-catégories disponibles.</div>
  )}
</div>
</div>
</div>

        {/* Right Placeholder (Ads etc.) */}
        <div className="right-section-cat"></div>
      </div>
      <Footer />
    </div>
  );
};

export default Subcategories2;
