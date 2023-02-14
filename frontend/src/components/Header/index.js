import React from "react";
import { NavLink } from "react-router-dom";
import Navigation from "../Navigation";
import "./Header.css";

function Header() {
  // todo need to add create a group button to the right side next to profile button
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
