import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './users.css';
import Footer from "../Footer";
import Search from "./Search";

const Users = () => {
  const { gouvernoratName, subcategory } = useParams();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [selectedDelegations, setSelectedDelegations] = useState([]);
  const [subcategoryData, setSubcategoryData] = useState(null);
  const [gouvernoratData, setGouvernoratData] = useState(null);
  const [categoriesData, setCategoriesData] = useState(null);
  const [gouvernoratsData, setGouvernoratsData] = useState(null);

  // 🔄 Charger les utilisateurs depuis le backend
  useEffect(() => {
    fetch('/data/users.json')
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error('Erreur chargement JSON :', err));
  }, []);

  // 🔄 Charger les JSON locaux depuis /public/data
  useEffect(() => {
    const loadJSON = async () => {
      try {
        const [gouvRes, catRes] = await Promise.all([
          fetch('/data/Gouvernorats.json'),
          fetch('/data/Categories.json'),
        ]);

        const gouvernoratsJson = await gouvRes.json();
        const categoriesJson = await catRes.json();

        setGouvernoratsData(gouvernoratsJson);
        setCategoriesData(categoriesJson);
      } catch (err) {
        console.error('Erreur de chargement des JSON locaux:', err);
      }
    };

    loadJSON();
  }, []);

  // 🎯 Fonction récursive pour trouver une sous-catégorie à n'importe quel niveau
  const findSubcategoryByName = (subcategories, name) => {
    for (const sub of subcategories) {
      if (sub.name.toLowerCase() === name.toLowerCase()) return sub;
      if (sub.subcategories) {
        const found = findSubcategoryByName(sub.subcategories, name);
        if (found) return found;
      }
    }
    return null;
  };

  // 🎯 Extraire le gouvernorat à partir du JSON
  useEffect(() => {
    if (!gouvernoratsData) return;

    const normalizedGouv = decodeURIComponent(gouvernoratName).toLowerCase().trim();
    const found = gouvernoratsData.find((gouvObj) =>
      Object.keys(gouvObj)[0].toLowerCase() === normalizedGouv
    );

    if (found) {
      const key = Object.keys(found)[0];
      setGouvernoratData({ ...found[key], name: key });
    }
  }, [gouvernoratName, gouvernoratsData]);

  // 🎯 Extraire la sous-catégorie (même imbriquée) depuis le JSON
  useEffect(() => {
    if (!categoriesData) return;

    const normalizedSub = decodeURIComponent(subcategory).toLowerCase().trim();
    let foundSubcategory = null;

    for (const key in categoriesData) {
      const category = categoriesData[key];
      foundSubcategory = findSubcategoryByName(category.subcategories, normalizedSub);
      if (foundSubcategory) break;
    }

    setSubcategoryData(foundSubcategory);
  }, [subcategory, categoriesData]);

  const handleCheckboxChange = (delegation) => {
    setSelectedDelegations((prev) =>
      prev.includes(delegation)
        ? prev.filter((d) => d !== delegation)
        : [...prev, delegation]
    );
  };

  const handleUserClick = (user) => {
    navigate(`${user.name.toLowerCase()}`, { state: { user } });
  };

  const normalize = (str) => str?.toLowerCase().trim();

  const filteredUsers = users.filter(
    (user) =>
      normalize(user.gouvernorat) === normalize(gouvernoratName) &&
      normalize(user.activité) === normalize(subcategoryData?.name)
  );

  const finalUsers =
    selectedDelegations.length > 0
      ? filteredUsers.filter((user) => selectedDelegations.includes(user.delegation))
      : filteredUsers;

  if (!subcategoryData || !gouvernoratData) {
    return <div style={{ padding: '2rem' }}>Chargement des données ou données non disponibles.</div>;
  }

  return (
    <div className="container-column">
      <div className="container-user">
        {/* LEFT: Delegations */}
        <div className="left-section-user">
          <div className="gouvernaurat-container-user">
            <h3 className="gouvernaurat-title-user">{gouvernoratData.name}</h3>
            <ul className="delegation-list-user">
              {gouvernoratData.delegations.map((delegation, index) => (
                <li key={index} className="delegation-item-user">
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

        {/* MIDDLE: Subcategory Image & User List */}
        <div className="middle-section">
          <div className="background-image-container">
            <img
              src={`/${subcategoryData.image}`}
              alt={subcategoryData.name}
              className="gouvernaurat-image"
            />
            <div className="image-overlay-text">
              <p className="gouvernaurat-name">{subcategoryData.name}</p>
            </div>
          </div>

          <Search />

          {finalUsers.length === 0 ? (
            <div className="no-results-message">
              <p style={{ color: 'blue', textAlign: 'center', marginTop: '50px' }}>
                Aucun résultat trouvé.
              </p>
            </div>
          ) : (
            <div className="users-grid">
              {finalUsers.map((user, index) => (
                <div
                  key={index}
                  className="users-item-user cursor-pointer"
                  onClick={() => handleUserClick(user)}
                >
                  <div className="user-item-container">
                    <div className="image-container-user">
                      <img
                        src={user.logo_url}
                        alt={user.name}
                        className="image-user"
                      />
                    </div>
                    <div className="text-container-user">
                      <p className="user-name">{user.name}</p>
                      <p className="user-delegation">{user.delegation}</p>
                      <p className="user-address">{user.address}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Placeholder */}
        <div className="right-section-user" />
      </div>
      <Footer />
    </div>
  );
};

export default Users;
