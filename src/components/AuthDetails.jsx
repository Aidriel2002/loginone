import React, { useState, useEffect } from 'react';
import { auth } from './auth/firebase.js';
import {signOut, onAuthStateChanged } from 'firebase/auth'; 
import { useNavigate } from 'react-router-dom';
import './AuthDetails.css';
import Modal from './Modal.js';
import SignUp from './auth/SignUp.jsx';

const AuthDetails = () => {
  const [authUser, setAuthUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const history = useNavigate();
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const openSignUpModal = () => {
    setShowSignUpModal(true);
  };

  const closeSignUpModal = () => {
    setShowSignUpModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
    history('/');
  };
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);

      } else {
        setAuthUser(null);

        setShowDropdown(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Sign out successful");
        history('/');
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="user-container">
      {authUser ? (
        <div className="user">
          <h2>DW System</h2>
          <div className="navbtn">
            <p>Students</p>
            <p>Courses</p>
            <p>Subjects</p>
            <p onClick={openSignUpModal}>Add Student</p>
          </div>       
          
          <div className="user-right">
            <p className='authName'>Dexter</p>
            <span className="dropdown-icon" onClick={toggleDropdown}>
              &#9660;
            </span>
            {showDropdown && (
              <div className="dropdown-content">
                <button onClick={userSignOut}>Logout</button>
              </div>
            )}
          </div>
          
        </div>
      ) : (
        <p>
          
        </p>
      )}
      
      <p className='greet'>Admin<br/> Welcome <span>Dexter</span></p>
       <div className="modalss">
          {showSignUpModal && (
            <Modal onClose={closeSignUpModal}>
              <SignUp />
            </Modal>
          )}
          {showModal && (
            <Modal onClose={closeModal}>
            </Modal>
          )}
      </div>
    </div>
  );
};

export default AuthDetails;
