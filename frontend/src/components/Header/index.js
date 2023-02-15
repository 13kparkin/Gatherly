import React from "react";
import { Link } from "react-router-dom";
import Navigation from "../Navigation";
import "./Header.css";
import { useSelector } from "react-redux";

function Header() {
  const sessionUser = useSelector((state) => state.session.user);


  return (
    <header>
       {sessionUser ? (
      <>
      <Link className="create-group" to={'/groups/new'} exact={true} >Create a Group </Link>
      <Link exact={true} to={"/"} style={{color:'#ff6560', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.7rem'}}>
        Gatherly
      </Link>
      <Navigation user={sessionUser} />
      </>
    ) : (
      <>
      <Link exact={true} to={"/"} style={{color:'#ff6560', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.7rem'}}>
      Gatherly
    </Link>
    <Navigation user={sessionUser} />
    </>
    )}
    </header>
  );
}

export default Header;
