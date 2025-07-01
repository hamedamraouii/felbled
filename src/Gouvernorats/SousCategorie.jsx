import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './Categories.css';
import Footer from "../Footer";
import Search from "./Search";
import { useTranslation } from 'react-i18next';

const SousCategories = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { gouvernoratName, categoryName } = useParams();

  const [gouvernorats, setGouvernorats] = useState([]);
  const [categories, setCategories] = useState({});
  const [gouvernoratData, setGouvernoratData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [gouvernoratLabel, setGouvernoratLabel] = useState(gouvernoratName);
  const [selectedDelegations, setSelectedDelegations] = useState([]);

  // Charger les fichiers JSON dynamiquement
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, gouvernoratsRes] = await Promise.all([
          fetch('/data/Categories.json'),
          fetch('/data/Gouvernorats.json')
        ]);
        const categoriesJson = await categoriesRes.json();
        const gouvernoratsJson = await gouvernoratsRes.json();
        setCategories(categoriesJson);
        setGouvernorats(gouvernoratsJson);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };
    fetchData();
  }, []);

  // Charger les données depuis JSON si pas dans location.state
  useEffect(() => {
    if (gouvernorats.length > 0 && !gouvernoratData) {
      const found = gouvernorats.find(
        (gouv) => Object.keys(gouv)[0].toLowerCase() === gouvernoratName.toLowerCase()
      );
      if (found) {
        const key = Object.keys(found)[0];
        setGouvernoratData(found[key]);
        setGouvernoratLabel(key);
      }
    }

    if (Object.keys(categories).length > 0 && !categoryData) {
      const found = Object.values(categories).find(
        (cat) => cat.category.toLowerCase() === categoryName.toLowerCase()
      );
      if (found) setCategoryData(found);
    }
  }, [gouvernorats, categories, gouvernoratName, categoryName]);

  // Priorité aux données passées par location.state
  useEffect(() => {
    if (location.state?.categoryData) setCategoryData(location.state.categoryData);
    if (location.state?.gouvernoratData) setGouvernoratData(location.state.gouvernoratData);
    if (location.state?.gouvernoratName) setGouvernoratLabel(location.state.gouvernoratName);
  }, [location.state]);

  const handleClick = (subcategory) => {
    const path = `/tunisie/${gouvernoratLabel.toLowerCase()}/${subcategory.name.toLowerCase()}`;
    const state = {
      gouvernoratData,
      gouvernoratName: gouvernoratLabel,
      categoryData,
      subcategory,
    };

    if (subcategory.subcategories) {
      navigate(`${path}/sub`, { state: { ...state, subcategory } });
    } else {
      navigate(path, { state });
    }
  };

  const handleCheckboxChange = (delegation) => {
    setSelectedDelegations((prev) =>
      prev.includes(delegation)
        ? prev.filter((item) => item !== delegation)
        : [...prev, delegation]
    );
  };

  if (!categoryData || !gouvernoratData) {
    return <div style={{ padding: '2rem' }}>Chargement des données ou données non disponibles.</div>;
  }

  const delegations = gouvernoratData?.delegations || [];

  return (
    <div className="container-column">
      <div className="container-cat">
        {/* LEFT: Delegations */}
        <div className="left-section-cat">
          {/*<div className="gouvernaurat-container-cat">
            <h3 className="gouvernaurat-title-cat">{gouvernoratLabel}</h3>
            <ul className="delegation-list-cat">
              {delegations.map((delegation, index) => (
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
          </div>*/}
        </div>

        {/* MIDDLE: Subcategories */}
        <div className="middle-section-cat">
          <div className="background-image-container">
            <img
              src={`/${categoryData.image}`}
              alt={categoryData.category}
              className="gouvernaurat-image"
            />
            <div className="image-overlay-text">
              <p className="category-name">{categoryData.category}</p>
            </div>
          </div>

          <Search />

          <div className="categories-list-container">
            <div className="categories-grid">
              {categoryData.subcategories?.map((subcategory, index) => (
                <div
                  key={index}
                  className="subcategory-item-cat cursor-pointer"
                  onClick={() => handleClick(subcategory)}
                >
                  <div className="image-container-cat">
                    <img
                      src={`/${subcategory.image}`}
                      alt={subcategory.name}
                      className="image-cat"
                    />
                    <div className="overlay-cat">
                      <div className="overlay1-cat">
                        <p className="subcategory-name-cat">{t(subcategory.name)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Placeholder */}
        <div className="right-section-cat" />
      </div>
      <Footer />
    </div>
  );
};

export default SousCategories;
