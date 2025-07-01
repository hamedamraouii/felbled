import React, { useState ,useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import './users.css';
import Footer from "../Footer";
import Search from "./Search";




  const UsersFilter = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    // Get search parameters and gouvernorat data from location.state
    const searchParams = location.state?.searchParams || {};
    const selectedGouvernorat = location.state?.gouvernoratData || { name: "", delegations: [] };
  
    // State to track selected delegations
    const [selectedDelegations, setSelectedDelegations] = useState([]);
    
    // State to track how many users to show
    const [usersToShow, setUsersToShow] = useState(12); // Start with 8 items displayed
    useEffect(() => {
      fetch("/data/users.json")
        .then((response) => response.json())
        .then((json) => setUsers(json))
        .catch((error) => console.error("Erreur lors du chargement du fichier JSON:", error));
        console.log(users);
    }, []);
  
    // Filter users based on search parameters and selected delegations
    const filteredUsers = users.filter((user) => {
      console.log( user);
      //const matchesCountry = searchParams.country
     //   ? user.pays.toLowerCase().includes(searchParams.country.toLowerCase())
    //    : true;
      const matchesRegion = searchParams.region
        ? user.gouvernorat.toLowerCase().includes(searchParams.region.toLowerCase())
        : true;
      const matchesCategory = searchParams.category
        ? user.activité.toLowerCase().includes(searchParams.category.toLowerCase())
        : true;
      const matchesActivity =  searchParams.activity
       ? user.etiquette?.some(e => e.name.toLowerCase().includes(searchParams.activity.toLowerCase()))
       : true;
     
    

       console.log(user.etiquette);
       console.log(searchParams.activity.toLowerCase())
       
      const matchesDelegation = selectedDelegations.length > 0
        ? selectedDelegations.includes(user.delegation)
        : true;
  
     // return matchesCountry && matchesRegion && matchesCategory && matchesActivity && matchesDelegation;
      return   matchesRegion  && matchesDelegation && matchesCategory && matchesActivity;
    });
  
  
  
 
    // Handle delegation selection
    const handleCheckboxChange = (delegation) => {
      setSelectedDelegations((prev) =>
        prev.includes(delegation)
          ? prev.filter((item) => item !== delegation)
          : [...prev, delegation]
      );
    };
  
    // Redirect to the search page if no state is provided
    if (!location.state) {
      navigate("/"); // Redirect to the home or search page
      return null; // Render nothing while redirecting
    }
  
    // Function to handle "See More" click
    const handleSeeMore = () => {
      setUsersToShow((prev) => prev + 12); // Show 8 more users
    };
  
    return (
      <div className="container-column">
        <div className="container-user">
          {/* Left Section (Delegations List) */}
          <div className="left-section-user">
            <div className="gouvernaurat-container-user">
              <h3 className="gouvernaurat-title-user">{selectedGouvernorat.name}</h3>
              <ul className="delegation-list-user">
                {selectedGouvernorat.delegations.map((delegation, index) => (
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
  
          {/* Middle Section (Background, categories List) */}
          <div className="middle-section">
            <Search />
            
            {/* Categories List Section */}
            <div className="users-list-container">
              <div className="users-grid">
                {filteredUsers.slice(0, usersToShow).map((user, index) => (
                  <div
                    key={index}
                    className="users-item-user cursor-pointer"
                    
                    onClick={() => {
                console.log("test2:");
              // navigate('/tunisie/tunis/électricien/lindini');}}
                
                      navigate("/tunisie/d/search/"+`${user.name.toLowerCase()}`, { state: { user, selectedGouvernorat } })}}
                  >
                    {/* White Container for Each Item */}
                    <div className="user-item-container">
                      {/* Image Container */}
                      <div className="image-container-user">
                        <img
                          src={user.logo_url}
                          alt={user.name}
                          className="image-user"
                        />
                        
                      </div>
  
                      {/* Text Container */}
                      <div className="text-container-user">
                        <p className="user-name">{user.name}</p>
                        <p className="user-delegation">{user.delegation}</p>
                        <p className="user-address">{user.address}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
  
              {/* "See More" Button */}
              {filteredUsers.length > usersToShow && (
                <div className="see-more-container">
                  <button className="see-more-button" onClick={handleSeeMore}>
                    See More
                  </button>
                </div>
              )}
            </div>
          </div>
  
          {/* Right Section (Empty for Ads) */}
          <div className="right-section-user">
            {/* Placeholder for right ad */}
          </div>
        </div>
        <Footer />
      </div>
    );
  };
  
  export default UsersFilter;