// ...existing code...

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./users.css";
import Footer from '../../Footer.jsx';
import Header from '../../HomePage/Header.jsx';
import Search from '../search/Search.jsx';

const UsersList = ({ users: usersProp, hideHeaderAndSearch = false, context = "subcategory" }) => {
  const { subcategoryId, gouvernoratName } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState(usersProp || []);
  const [loading, setLoading] = useState(!usersProp);
  const [error, setError] = useState(null);

  // Debug log for usersProp
  useEffect(() => {
    console.log("UsersList usersProp:", usersProp);
  }, [usersProp]);

  // Update users state if usersProp changes (for SearchResult)
  useEffect(() => {
    if (usersProp) {
      setUsers(usersProp);
      setLoading(false);
      return;
    }
    if (!subcategoryId) return;
    let url = `/api/users/subcategories/${subcategoryId}`;
    if (gouvernoratName) {
      url += `?gouvernorat=${encodeURIComponent(gouvernoratName)}`;
    }
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur API utilisateurs");
        return res.json();
      })
      .then((data) => {
        if (data.success && data.users) {
          setUsers(data.users);
        } else {
          setUsers([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [subcategoryId, gouvernoratName, usersProp]);

  if (loading) return <div style={{ padding: "2rem" }}>Chargement des utilisateurs...</div>;
  if (error) return <div style={{ padding: "2rem", color: "red" }}>Erreur : {error}</div>;

  return (
    <>
      {!hideHeaderAndSearch && <Header />}
      {!hideHeaderAndSearch && <Search />}
      <div className="container-column">
        <div className="container-user">
          {/* LEFT: Placeholder for future filter/ads */}
          <div className="left-section-user"></div>
          {/* MIDDLE: User List, même design que catégories/secteurs */}
          <div className="middle-section-user">
            <div className="users-grid">
              {users.length > 0 ? (
                users.map((user) => {
                  const userId = user._id || user.id;
                  return (
                    <div
                      key={userId}
                      className="user-item-container"
                      onClick={() => {
                        navigate(`/user/${userId}`, { state: { user } });
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="image-container-user">
                        <img
                          className="image-user"
                          src={user.logo?.url || user.image_url || (user.images && user.images[0]?.url) || '/default-user.png'}
                          alt={user.name}
                        />
                      </div>
                      <div className="text-container-user">
                        <h4 className="user-name">{user.name}</h4>
                        <p className="user-delegation">{typeof user.delegation === 'object' && user.delegation?.name ? user.delegation.name : user.delegation || ''}</p>
                        <p className="user-activity">{user.activité || user.activity}</p>
                        <p className="user-address">{user.address}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="no-users">
                  <p>{context === "search" ? "Aucun utilisateur trouvé pour cette recherche." : "Aucun utilisateur trouvé pour cette sous-catégorie."}</p>
                </div>
              )}
            </div>
          </div>
          {/* RIGHT: Placeholder for future filter/ads */}
          <div className="right-section-user"></div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default UsersList;
