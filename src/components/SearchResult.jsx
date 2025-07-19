
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import UsersList from "./users/UsersList";
import Header from "../HomePage/Header.jsx";
import Footer from "../Footer";
import Search from "./search/Search.jsx";
import { fetchUsersBySearchParams } from "./search/searchApi";

const SearchResult = () => {
  const location = useLocation();
  // Try to recover from localStorage if location.state is missing
  let searchParams = location.state?.searchParams;
  let initialUsers = location.state?.users;
  if (!searchParams) {
    try {
      searchParams = JSON.parse(localStorage.getItem("felbled_searchParams"));
    } catch {}
  }
  if (!initialUsers) {
    try {
      initialUsers = JSON.parse(localStorage.getItem("felbled_searchUsers"));
    } catch {}
  }
  searchParams = searchParams || {};
  initialUsers = initialUsers || [];
  const [users, setUsers] = useState(initialUsers);
  // Debug log
  useEffect(() => {
    console.log("SearchResult initialUsers:", initialUsers);
    console.log("SearchResult searchParams:", searchParams);
    console.log("SearchResult users state:", users);
  }, [initialUsers, searchParams, users]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If users are passed from navigation, use them directly
    if (initialUsers && initialUsers.length > 0) {
      setUsers(initialUsers);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetchUsersBySearchParams(searchParams)
      .then((users) => {
        setUsers(users);
        setLoading(false);
      })
      .catch(() => {
        setError("Erreur lors de la recherche des utilisateurs.");
        setLoading(false);
      });
  }, [JSON.stringify(searchParams), initialUsers]);

  return (
    <>
      <Header />
      <Search />
   
      <div className="container-column">
        {loading && <div style={{ padding: "2rem" }}>Recherche en cours...</div>}
        {error && <div style={{ padding: "2rem", color: "red" }}>{error}</div>}
        {!loading && !error && <UsersList users={users} hideHeaderAndSearch={true} context="search" />}
        {!loading && !error && users.length === 0 && (
          <div style={{ padding: "2rem", color: "#888" }}>Aucun utilisateur trouvé.</div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SearchResult;
