import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "./firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import Modal from '../Modal.js';
import ForgotPassword from "./ForgotPassword.js";
import './SignIn.css'
import ReCAPTCHA from "react-google-recaptcha";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const history = useNavigate();

  const onChange = (value) => {
    setIsCaptchaVerified(!!value);
  }; 
  const openModal = () => {
    setShowModal(true);
  };
 
  const closeModal = () => {
    setShowModal(false);
    history("/");
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const userEmail = email;
  
    if (!isCaptchaVerified) {
      setMessage("Please verify reCAPTCHA.");
      const errorMessageElement = document.getElementById("created");
      errorMessageElement.style.color = "red";
      return;
    }
  
    if (password.length < 8) {
      setMessage("Passwords must have at least 8 characters.");
      const errorMessageElement = document.getElementById("created");
      errorMessageElement.style.color = "red";
      return;
    }
  
    signInWithEmailAndPassword(auth, userEmail, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user) {
          console.log(userCredential);
          if (user.email.toLowerCase() === 'dexterbasergo@gmail.com') {
            history('/admin'); 
          } else {
            history('/student');
          }
        } 
      })
      .catch((error) => {
        setMessage("Invalid Email or Password.");
        const errorMessageElement = document.getElementById("created");
        errorMessageElement.style.color = "red";
        console.log(error);
      });
  };
  
    
  return (
    <>
      <div className="big-box">
        <div className="left-box">
          <div className="leftContent">
            <p className="tagline">Nice to see you again</p>
            <h3 className="tagLine">Welcome Back!</h3>
            <img src="../../../rightimg.png" alt="pic" draggable="false"/>
          </div>
        </div>
        <div className="right-box">
          <div className="form-container">
            <div className="loginForm">
              <h3 className="login">Login</h3>
              <p className="caption">Hello! Let's get started</p>
              <form onSubmit={(e) => handleSubmit(e)}>
                <div className="space">
                  <div className="inputBox">
                    <input
                      className="email-box"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <span>Enter your email</span>
                  </div>
                </div>
                <div style={{display: "flex"}}>
                  <div className="space">
                    <div className="inputBox">
                      <input 
                        name="password" 
                        type={showPassword ? 'text' : 'password'} 
                        className="pw-box" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                      />
                      <span>Password</span>
                    </div>
                  </div>
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    className="eye-icon"
                    style={{ position: 'absolute', margin: '45px 268px', cursor: 'pointer'}}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
                <div className="spaceTwo adjustTwo">
                  <p className="adjust-forgot-pw"  onClick={openModal}>Forgot Password?</p>
                </div>
                <ReCAPTCHA className="recaptcha-container"  sitekey="6LfN0pIpAAAAAJOIyc9phZoQnjvz-RO_2k86HoXJ" onChange={onChange}/>
                <div className="space">
                  <button type="submit"  className="login-button"><b>Log In</b></button>    
                </div>
  
              </form>
            </div>
            <p id="created">{message}</p>
          </div>
        
          {showModal && (
            <Modal onClose={closeModal}>
              <ForgotPassword />
            </Modal>
          )}
        </div>
      </div>
    </>
  );
};

export default SignIn; 
