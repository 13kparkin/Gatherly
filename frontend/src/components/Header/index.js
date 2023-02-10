import React from "react";
import { NavLink } from "react-router-dom";
import Navigation from "../Navigation";
import "./Header.css";

function Header() {
  const logo = "";
  return (
    <header>
      <NavLink exact to="/">
        <img src={logo} alt="Logo" />
      </NavLink>
      <h1>Gatherly</h1>
      <Navigation />
    </header>
  );
}

export default Header;
