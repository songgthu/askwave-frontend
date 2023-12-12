import React, { useState } from 'react';
import Logo from '../images/AskWaveLogo.png';
import LoginForm from '../login/loginForm';
import '../login/login.css';

function Login() {

  const handleLogin = (username: string, password: string) => {
    // Perform login logic here
    console.log('Logging credentials:', { username, password });
  };

  return (
    <div className="Login">
      <div className="LogoContainer">
        <img src={Logo} className="Logo" style={{ width: '200px', height: '200px' }} />
      </div>
      
      <LoginForm onLogin={handleLogin} />

    </div>
    
  );
}

export default Login;