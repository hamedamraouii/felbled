import React, { useState, useRef, useEffect } from "react";
import "./App.css"; 
import Logo1 from "./public/logoR.png";
import { MdViewList } from "react-icons/md";
import { IoMdSearch } from "react-icons/io";
import { MdGTranslate } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { MdArrowForwardIos,MdArrowBackIos } from "react-icons/md";
import { FaHome, FaInfoCircle, FaEnvelope } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import './i18n'; 
const App = () => {
  const { t, i18n } = useTranslation();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false); // Sidebar is collapsed initially
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileNavbarOpen, setIsMobileNavbarOpen] = useState(false); // New state for mobile navbar
  const [isMobileListOpen, setIsMobileListOpen] = useState(false); // New state for mobile navbar
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false); // Search popup state
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false); // Language dropdown visibility state
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [category, setCategory] = useState('');
  const [activity, setActivity] = useState('');
  const [language, setLanguage] = useState('fr');
  const searchPopupRef = useRef(null);
  const languageDropdownRef = useRef(null);
  const navigate=useNavigate()
  const pages = ["/", "/about", "/contact", "/connect"];
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  
  // Close dropdowns and popup when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchPopupRef.current && searchPopupRef.current.contains(event.target)) {
        setIsSearchPopupOpen(false);
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setIsLanguageDropdownOpen(false);
      }
    };

    // Add event listener for clicks outside
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    setIsSearchPopupOpen(false);
    console.log(`Searching for: ${country}, ${region}, ${category}, ${activity}`);
  };

  const goToPreviousPage = () => {
    const newIndex = (currentPageIndex - 1 + pages.length) % pages.length;
    setCurrentPageIndex(newIndex);
    navigate(pages[newIndex]);  
  };
  
  const goToNextPage = () => {
    const newIndex = (currentPageIndex + 1) % pages.length;
    setCurrentPageIndex(newIndex);
    navigate(pages[newIndex]);  
  };
  const toggleMobileNavbar = () => {
    setIsMobileListOpen(!isMobileListOpen); 
  };

  const goToSection = (section) => {
    setActiveSection(section);
    setIsMobileListOpen(false);
    navigate("/", { state: { activeSection: section } });
  };

  const toggleSearchPopup = () => {
    setIsSearchPopupOpen(!isSearchPopupOpen);
  };

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen); 
  };

  const handleLanguageChange = (language) => {
    console.log(`Selected Language: ${language}`);
    setIsLanguageDropdownOpen(false);
    if (language == 'French'){
    i18n.changeLanguage('fr')
    }
    if (language == 'Arabic'){
      i18n.changeLanguage('ar')
    }
    else {i18n.changeLanguage('en')}
  };
  const onSelectChange = (e) => {
    handleLanguageChange(e.target.value);
  };

  return (
    <div className="myApp">

      {/* Navbar (Desktop Version) */}
      <div className={`navbar`}>
  <div
    className="logo-container"
    onClick={() => {
      navigate("/", { state: { activeSection: "home" } });
    }}
  >
    <img src={Logo1} alt="Logo" className="logo1" />
  </div>

  <div className="welcome-text">
    <span className="line1">WELCOME</span>
    <div id="flip">
    <div><div><span className="line2">TO OUR SITE</span></div></div>
    <div><div><span className="line2">TO OUR PLATEFORM</span></div></div>
     <div><div><span className="line3">Felbled</span></div></div>
    </div>
  </div>
   {/*<div id="flip">
    <div><div>{t("Our Website")}</div></div>
    <div><div>{t("Our Plateform")}</div></div>
    <div><div>Felbled</div></div>
  </div>*/}

  <div className="icons-container">
    <button
      className={`icon ${activeSection === "home" ? "active" : ""}`}
      onClick={() => {
        navigate("/");
        goToSection("home");
      }}
    >
      <FaHome className="icon-logo" />
      <span className="icon-text">Accueil</span>
    </button>

    <button
      className={`icon ${activeSection === "about" ? "active" : ""}`}
      onClick={() => goToSection("about")}
    >
      <FaInfoCircle className="icon-logo" />
      <span className="icon-text">A propos</span>
    </button>

    <button
      className={`icon ${activeSection === "contact" ? "active" : ""}`}
      onClick={() => goToSection("contact")}
    >
      <FaEnvelope className="icon-logo" />
      <span className="icon-text">Contactez Nous</span>
    </button>
  </div>

  <div onClick={toggleLanguageDropdown}>
    <MdGTranslate className="mobile-svg-lang" />
  </div>
</div>

      {/* Mobile Navbar */}
      <div className={`mobile-navbar ${isMobileNavbarOpen ? "open" : ""}`}>
        <div className="mobile-navbar-header">
          <img src={Logo1} alt="Logo" className="logo1"onClick={()=>{navigate("/", {activeSection:"home"} )}} />
          <div className="mobile-svgs">
          {/*<div >
              <MdArrowBackIos onClick={goToPreviousPage}  className="" />
            </div>
            <div >
              <MdArrowForwardIos onClick={goToNextPage} className="" />
            </div>
            <div onClick={toggleSearchPopup} className="mobile-search" >
              <IoMdSearch className="mobile-svg-search" />
            </div>*/}
            <div onClick={toggleLanguageDropdown}>
            <MdGTranslate className="mobile-svg-lang" />
            </div>
            <div onClick={toggleMobileNavbar}>
              <MdViewList className="mobile-svg" />
            </div>
          </div>
        </div>
        <div className={isMobileListOpen ? "mobile-navbar-menu" : "display-none"}>
          <button
            className={`mobile-navbar-item ${activeSection === "home" ? "active" : ""}`}
            onClick={() => goToSection("home")}
          >
            Home
          </button>
          <button
            className={`mobile-navbar-item ${activeSection === "about" ? "active" : ""}`}
            onClick={() => goToSection("about")}
          >
            About
          </button>
          <button
            className={`mobile-navbar-item ${activeSection === "contact" ? "active" : ""}`}
            onClick={() => goToSection("contact")}
          >
            Contact
          </button>
         {/*} <div>
      <label htmlFor="language-select">Choisir la langue : </label>
      <select id="language-select"  onChange={onSelectChange}>
        <option value="French">Français</option>
        <option value="English">English</option>
        <option value="Arabic">Arabe</option>
        
      </select>
    </div>*/}
          
        </div>
        
      </div>

      {/* Language Dropdown */}
      {isLanguageDropdownOpen && (
  <div ref={languageDropdownRef} className="language-dropdown">
    <ul>
    <li onClick={() => handleLanguageChange("English")}>
  <img src="/flags/gb.svg" alt="English" style={{ width: "20px", marginRight: "8px" }} />
  English
</li>
<li onClick={() => handleLanguageChange("French")}>
  <img src="/flags/fr.svg" alt="Français" style={{ width: "20px", marginRight: "8px" }} />
  Français
</li>
<li onClick={() => handleLanguageChange("Arabic")}>
  <img src="/flags/sa.svg" alt="العربية" style={{ width: "20px", marginRight: "8px" }} />
  العربية
</li>
    
    </ul>
  </div>
)}
      



    </div>
  );
};

export default App;