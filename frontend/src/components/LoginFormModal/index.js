import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";


function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
  };
  
  const handleDemoLogin = (e) => {
    e.preventDefault();
    return dispatch(sessionActions.login({ credential: "Demo-lition", password: "password" }))
      .then(closeModal)
  }

  const isButtonDisabled = credential.length < 4 || password.length < 6;

  const button = isButtonDisabled ? 'disabled-login' : 'submit-button-login';

  return (
    <>
    
      
      <form onSubmit={handleSubmit}>
      <div className="login-form">
      <h1>Log In</h1>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <div className="login-form-username">
        <label>
          Username or Email
          </label>
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        
        </div>
        <div className="login-form-password">
        <label>
          Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        
        </div>
        <button
        className={button}
        type="submit"
        disabled={isButtonDisabled}
        >Log In</button>


        <button
        className="demo-button"
        type="button"
        onClick={handleDemoLogin}>Demo User</button> 
        </div>
      </form>
      

    </>
  );
}

export default LoginFormModal;