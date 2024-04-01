import React, { useState, useEffect } from 'react';
import { auth } from './auth/firebase.js';
import {signOut, onAuthStateChanged } from 'firebase/auth'; 
import { useNavigate } from 'react-router-dom';
import './AuthDetails.css';
import Modal from './Modal.js';
import SignUp from './auth/SignUp.jsx';
import ForgotPassword from "./auth/ForgotPassword.js";
import './StudentList.css'

const StudentList = () => {
  const [authUser, setAuthUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const history = useNavigate();
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const openSignUpModal = () => {
    setShowSignUpModal(true);
  };
  const openModal = () => {
    setShowModal(true);
  };
  const studentListTab = () => {
    history('/studentList');
  }
  const dashboard = () => {
    history('/admin')
  }

  const closeSignUpModal = () => {
    setShowSignUpModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
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
          <h2 onClick={dashboard}>DW System</h2>
          <div className="navbtn">
            <p onClick={studentListTab}>Students</p>
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
      
      <h3>Student List</h3>
      <p className="recpass">Student Account Recovery <span   onClick={openModal}>Click Here!</span> </p>

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
          {showModal && (
            <Modal onClose={closeModal}>
              <ForgotPassword />
            </Modal>
          )}
      </div>

    </div>
  );
};

export default StudentList;
