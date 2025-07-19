import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './users.css';
import Footer from '../Footer';

const Users = () => {
  const navigate = useNavigate();
  const { gouvernoratName, subcategory } = useParams();

  const [users, setUsers] = useState([]);
  const [selectedDelegations, setSelectedDelegations] = useState([]);
  const [gouvernoratData, setGouvernoratData] = useState(null);
  const [subcategoryData, setSubcategoryData] = useState(null);
  const [categoriesData, setCategoriesData] = useState(null);
  const [gouvernoratsData, setGouvernoratsData] = useState(null);

  useEffect(() => {
    // Charger les utilisateurs depuis l'API
    fetch('/api/users')
      .then((res) => {
        if (!res.ok) throw new Error('Erreur API utilisateurs');
        return res.json();
      })
      .then((data) => {
        console.log('📊 Users API response:', data);
        if (data.success && data.users) {
          setUsers(data.users);
        } else {
          setUsers(data); // Fallback si pas de structure success/users
        }
      })
      .catch((err) => console.error('Erreur chargement API :', err));
  }, []);

  useEffect(() => {
    // Charger les gouvernorats et catégories depuis l'API
    const loadAPIData = async () => {
      try {
        const [gouvRes, catRes] = await Promise.all([
          fetch('/api/gouvernorats'),
          fetch('/api/categories'),
        ]);

        const gouvernoratsData = await gouvRes.json();
        const categoriesData = await catRes.json();

        console.log('📍 Gouvernorats API:', gouvernoratsData);
        console.log('📋 Categories API:', categoriesData);

        if (gouvernoratsData.success && gouvernoratsData.governorats) {
          setGouvernoratsData(gouvernoratsData.governorats);
        }
        
        if (categoriesData.success && categoriesData.categories) {
          setCategoriesData(categoriesData.categories);
        }
      } catch (err) {
        console.error('Erreur de chargement des APIs:', err);
      }
    };

    loadAPIData();
  }, []);

  // Fonction pour trouver une sous-catégorie par nom dans la structure récursive
  const findSubcategoryByName = (categories, name) => {
    if (!categories || !Array.isArray(categories)) return null;
    
    for (const category of categories) {
      // Vérifier les sous-catégories directes
      if (category.subcategories) {
        for (const sub of category.subcategories) {
          if (sub.name && sub.name.toLowerCase() === name.toLowerCase()) {
            return sub;
          }
          // Recherche récursive dans les sous-sous-catégories
          if (sub.subcategories) {
            const found = findSubcategoryByName([{ subcategories: sub.subcategories }], name);
            if (found) return found;
          }
        }
      }
    }
    return null;
  };

  useEffect(() => {
    if (!gouvernoratsData || !Array.isArray(gouvernoratsData)) return;

    const normalizedGouv = decodeURIComponent(gouvernoratName).toLowerCase().trim();
    const found = gouvernoratsData.find(gouv => 
      gouv.name.toLowerCase() === normalizedGouv
    );

    if (found) {
      setGouvernoratData({
        name: found.name,
        image_url: found.image_url || found.image?.url,
        delegations: found.delegations || []
      });
    }
  }, [gouvernoratsData, gouvernoratName]);

  useEffect(() => {
    if (!categoriesData || !Array.isArray(categoriesData)) return;

    const normalizedSub = decodeURIComponent(subcategory).toLowerCase().trim();
    const foundSubcategory = findSubcategoryByName(categoriesData, normalizedSub);
    
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

  const filteredUsers = users.filter((user) => {
    // Filtrer par gouvernorat et activité/sous-catégorie
    const userGouv = normalize(user.gouvernorat) || normalize(user.gouvernoratName);
    const userActivity = normalize(user.activité) || normalize(user.activity);
    
    return userGouv === normalize(gouvernoratName) &&
           userActivity === normalize(subcategoryData?.name);
  });

  const finalUsers =
    selectedDelegations.length > 0
      ? filteredUsers.filter((user) => selectedDelegations.includes(user.delegation))
      : filteredUsers;

  if (!subcategoryData || !gouvernoratData) {
    return (
      <div style={{ padding: '2rem' }}>
        <div>Chargement des données...</div>
        <div>Gouvernorat: {gouvernoratName}</div>
        <div>Sous-catégorie: {subcategory}</div>
        <div>Données gouvernorat: {gouvernoratData ? '✅' : '❌'}</div>
        <div>Données sous-catégorie: {subcategoryData ? '✅' : '❌'}</div>
      </div>
    );
  }

  return (
    <div className="container-column">
      <div className="container-user">
        {/* LEFT: Delegations */}
        <div className="left-section-user">
          <div className="gouvernaurat-container-user">
            <h3 className="gouvernaurat-title-user">{gouvernoratData.name}</h3>
            <ul className="delegation-list-user">
              {gouvernoratData.delegations.map((delegation, index) => {
                const delegationName = delegation.name || delegation; // Support both formats
                return (
                  <li key={delegation._id || index} className="delegation-item-user">
                    <label>
                      <input
                        type="checkbox"
                        value={delegationName}
                        checked={selectedDelegations.includes(delegationName)}
                        onChange={() => handleCheckboxChange(delegationName)}
                      />
                      {delegationName}
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* MIDDLE: Subcategory Image & User List */}
        <div className="middle-section">
          <div className="background-image-container">
            <img
              src={subcategoryData.image ? `/${subcategoryData.image}` : '/default-category.jpg'}
              alt={subcategoryData.name}
              className="gouvernaurat-image"
            />
            <div className="image-overlay-text">
              <p className="gouvernaurat-name">{subcategoryData.name}</p>
              <p className="users-count">({finalUsers.length} résultats)</p>
            </div>
          </div>

          <div className="users-list">
            {finalUsers.length > 0 ? (
              finalUsers.map((user) => (
                <div
                  key={user._id || user.id}
                  className="user-card"
                  onClick={() => handleUserClick(user)}
                >
                  <div className="user-info">
                    <h4 className="user-name">{user.name}</h4>
                    <p className="user-location">{user.delegation}</p>
                    <p className="user-activity">{user.activité || user.activity}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-users">
                <p>Aucun utilisateur trouvé pour cette catégorie dans ce gouvernorat.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Ads */}
        <div className="right-section-user">
          {/* Section droite pour les publicités */}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Users;
