import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./HomePage/HomePage";
import Gouvernorats from "./Gouvernorats/Gouvernorats.jsx";
import SousCategorie from "./Gouvernorats/SousCategorie.jsx";
import Subcategories2 from "./Gouvernorats/SousCategorie2.jsx";
import Activities from "./Gouvernorats/Activities.jsx";
import OneUser from "./Gouvernorats/OneUser.jsx";
import Users from "./Gouvernorats/Users";
import UsersFilter from "./Gouvernorats/UsersFilter.jsx";
import OneUserUpdate from "./Gouvernorats/Update.jsx";
import SideBar from "./App.jsx";
import Connect from "./HomePage/Login";
import { Helmet } from 'react-helmet';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
          {/* Most specific routes first */}
          <Route path="/tunisie/:gouvernoratName/:subcategory/:userName" element={<OneUser />} />
          <Route path="/tunisie/:gouvernoratName/:subcategory" element={<Users />} />
          <Route path="/tunisie/:gouvernoratName/:subcategory/sub" element={<Subcategories2 />} />
          <Route path="/tunisie/:gouvernoratName/:categoryName/cat" element={<SousCategorie />} />
          
          
          <Route path="/tunisie/:gouvernoratName" element={<Activities />} />
          <Route path="/tunisie" element={<Gouvernorats />}/>
          {/* Generic routes */}
          <Route path="/searchresult" element={<UsersFilter />} />
          <Route path="/" element={<HomePage />} />
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