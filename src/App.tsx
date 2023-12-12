import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import About from './pages/about';
import Register from './pages/register';
import { Link } from 'react-router-dom';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/register" className="nav-link">Register</Link>
          <Link to="/login" className="nav-link">Login</Link>
        </nav>

        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
