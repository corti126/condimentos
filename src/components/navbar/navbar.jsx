import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src="logo-final.png" alt="Logo EspeciasApp" className="logo-img" />
        </Link>
      </div>
      <ul className="navbar-links">
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">Lista</Link>
        </li>
        <li className={location.pathname === '/clientes' ? 'active' : ''}>
          <Link to="/clientes">Clientes</Link>
        </li>
        <li className={location.pathname === '/remitos' ? 'active' : ''}>
          <Link to="/remitos">Crear Remito</Link>
        </li>
        <li className={location.pathname === '/historial' ? 'active' : ''}>
          <Link to="/historial">Historial</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;