import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import UsersList from "./components/users/UsersList.jsx";
import HomePage from "./HomePage/HomePage";

import SousCategorie from "./Gouvernorats/SousCategorie.jsx";
import Subcategories2 from "./Gouvernorats/SousCategorie2.jsx";

import OneUser from "./Gouvernorats/OneUser.jsx";
import Users from "./Gouvernorats/Users";
import SearchResult from "./components/SearchResult.jsx";

import SideBar from "./App.jsx";

import ApiTest from "./ApiTest.jsx";
import { Helmet } from 'react-helmet';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import GouvernoratsList from "./components/gouvernorats/GouvernoratsList.jsx";
import SecteursList from "./components/secteurs/SecteursList.jsx";
import CategorieList from "./components/categories/CategorieList.jsx";
import SousCategorieList from "./components/souscategories/SousCategorieList.jsx";
import UserDetails from "./components/users/UserDetails.jsx";

const AppContent = () => {
  return (
    <div className="app">
       <Helmet>
    <title></title>
    <meta name="description" content="felbled,annuaire tunisie,page jaune." />
    <link rel="canonical" href="https://felbled.com/" />
    <meta name="robots" content="index, follow" />
  </Helmet>
      {/* Sidebar (Desktop Version) */}
      <div className="sidebar">
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="content">
        <Routes>
          {/* Test API route */}
          <Route path="/test-api" element={<ApiTest />} />
          {/* Most specific routes first */}
          <Route path="/users/subcategories/:subcategoryId" element={<UsersList />} />
          <Route path="/users/gouvernorat/:gouvernoratName/subcategories/:subcategoryId" element={<UsersList />} />
          <Route path="/user/:userId" element={<UserDetails />} />
          <Route path="/tunisie/:gouvernoratName/:subcategory/:userName" element={<OneUser />} />
          <Route path="/tunisie/:gouvernoratName/:subcategory" element={<Users />} />
          <Route path="/tunisie/:gouvernoratName/:subcategory/sub" element={<Subcategories2 />} />
          <Route path="/tunisie/:gouvernoratName/:categoryName/cat" element={<SousCategorie />} />
          
          
          <Route path="/tunisie/:gouvernoratName" element={<SecteursList />}/>
          <Route path="/tunisie" element={<GouvernoratsList />}/>
          {/* Generic routes */}
          <Route path="/searchresult" element={<SearchResult />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/tunisie/:gouvernoratName/:secteurName/categories" element={<CategorieList />} />
          <Route path="/tunisie/:gouvernoratName/:secteurName/categories/:categoryId/souscategories" element={<SousCategorieList />} />
        </Routes>
      </div>
    </div>
  );
};

// Wrap AppContent in Router at the root level
const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;