import React from "react";
import { NavLink } from "react-router-dom";
import Navigation from "../Navigation";
import "./Header.css";

function Header() {

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
