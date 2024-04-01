import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "./firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './SignUp.css'


const SignUp = () => {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const resetForm = () => {
    setName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setMessage("");
  };

  const handleNameChange = (event) => {
    const enteredName = event.target.value;
    setName(enteredName);
    validateName(enteredName);
  };
  
  const handleLastNameChange = (event) => {
    const enteredLastName = event.target.value;
    setLastName(enteredLastName);
    validateName(enteredLastName);
  };
  
  const validateName = (enteredValue) => {
    const containsNumber = /\d/.test(enteredValue);
    if (containsNumber) {
      setMessage("Name cannot contain numbers.");
      const errorMessageElement = document.getElementById("screated");
      errorMessageElement.style.color = "red";
      errorMessageElement.style.padding = "5px 40px";
      return false;
    } else {
      setMessage("");
      return true; 
    }
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  const userEmail = email;

  if (password !== confirmPassword) {
    setMessage("Password do not match.");
    const errorMessageElement = document.getElementById("screated");
    errorMessageElement.style.color = "red";
    errorMessageElement.style.padding = "5px 40px";
    return;
  }
  if (password.length < 8) {
    setMessage("Passwords must have at least 8 characters.");
    const errorMessageElement = document.getElementById("screated");
    errorMessageElement.style.color = "red";
    errorMessageElement.style.padding = "5px 40px";
    return;
  }

  const isNameValid = validateName(name);
  const isLastNameValid = validateName(lastName);

  if (!isNameValid || !isLastNameValid) {
    return;
  }

  createUserWithEmailAndPassword(auth, userEmail, password)
    .then((userCredential) => {
      const user = userCredential.user;
      updateProfile(user, {
        displayName: name,
      })
        .then(() => {
          resetForm();
          setMessage("Account successfully created.");
          const errorMessageElement = document.getElementById("screated");
          errorMessageElement.style.color = "green";
          errorMessageElement.style.padding = "5px 40px";

        })
        .catch((updateProfileError) => {
          console.error("Error updating profile:", updateProfileError);
          setMessage("An error occurred. Please try again.");
          const errorMessageElement = document.getElementById("screated");
          errorMessageElement.style.color = "red";
          errorMessageElement.style.padding = "5px 40px";
        });
    })
    .catch((err) => {
      if (err.code === "auth/invalid-email") {
        setMessage("Invalid Email.");
      } else if (err.code === "auth/email-already-in-use") {
        setMessage("Email already in use.");
      } else {
        setMessage("An error occurred. Please try again.");
      }

      const errorMessageElement = document.getElementById("screated");
      errorMessageElement.style.color = "red";
      errorMessageElement.style.padding = "5px 40px";
      console.log(err);
    });
};


        return (
            <div className="sform-container">
              <div className="loginForm">
                <h3 className="signUp">Create Account</h3>
                <p className="scaption">I'm happy to see you here!</p>
                <form onSubmit={(e) => handleSubmit(e)}>
          
                    <div className="inputBoxs">
                      <input name="fname" value={name} className="name" onChange={handleNameChange} required />
                      <span>First Name</span>
                    </div>
                    <div className="inputBoxs">
                      <input name="fname" value={lastName} className="name" onChange={handleLastNameChange} required/>
                      <span>Last Name</span>
                    </div>
                    <div className="inputBoxs">
                      <input className="semail-box" value={email} onChange={(e) => setEmail(e.target.value)} required />
                      <span>Enter email</span>
                    </div>
                  <div style={{display: "flex"}}>
                      <div className="inputBoxs">
                        <input name="password" type={showPassword ? 'text' : 'password'} className="spw-box" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                        <span>Password</span>
                      </div>
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="eye-icon" style={{ position: 'absolute', margin: '27px 330px', cursor: 'pointer'}} onClick={() => setShowPassword(!showPassword)} />
                  </div>
                    <div className="inputBoxs">
                      <input type={showPassword ? 'text' : 'password'} name="fname" value={confirmPassword} className="spw-box" onChange={(e) => setConfirmPassword(e.target.value)} required/>
                      <span>Confirm Password</span>
                    </div>
                    <button type="submit"  className="signup-button"><b>Create Account</b></button>    
                </form>
              </div>
                <p id="screated">{message}</p>
            </div>
  );
};

export default SignUp;