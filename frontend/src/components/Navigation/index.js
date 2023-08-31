import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import logo from '../../assets/logo.png';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav>
      <div className="navigation-container">
        <div className="logo-container">
          <NavLink exact to="/">
            <img src={logo} alt="Logo" className="logo-image" />
          </NavLink>
        </div>
        <ul className="nav-links">
          {isLoaded && sessionUser && (
            <li>
              <NavLink to="/spots/new">Create New Spot</NavLink>
            </li>
          )}
        </ul>
        <ProfileButton user={sessionUser} />
      </div>
    </nav>
  );
}

export default Navigation;
