import React from "react";
import { NavLink } from "react-router-dom";
import Navigation from "../Navigation";
import "./Header.css";

function Header() {
  // todo need to add create a group button to the right side next to profile button
  return (
    <header>
      <NavLink exact to="/" style={{color:'#ff6560', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.7rem'}}>
        Gatherly
      </NavLink>
      <Navigation />
    </header>
  );
}

export default Header;
