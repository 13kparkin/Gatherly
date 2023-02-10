import React from "react";
import { NavLink } from "react-router-dom";
import Navigation from "../Navigation";
import "./Header.css";

function Header() {
  const logo = "";
  return (
    <header>
      <NavLink exact to="/">
        Gatherly
      </NavLink>
      <Navigation />
    </header>
  );
}

export default Header;