import React from "react";
import { useNavigate} from "react-router-dom";
import "./login.css";
import Footer from "../Footer";

const Login = () => {
  const navigate= useNavigate();
  return (
    <div>
    <div className="login-container">
        
        <div className="login-overlay">
        <div className="logo-container-login">
        <img className="logo-login" src="/logo.png"/>
    </div>
            <div className="login-card">

        <h2>Login</h2>
        <form>
          <div className="card-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" />
          </div>
          <div className="card-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" />
          </div>
          <button type="submit" className="login-button" onClick={() => navigate("/update")}>Login</button>
        </form>
        <p className="signup-prompt">
          Don’t have an account? <a href="https://wa.me/your-number" target="_blank" rel="noopener noreferrer">Call us</a>
        </p>
       
      </div>

    </div>
    </div>
    <Footer/>
    </div>
  );
};

export default Login;