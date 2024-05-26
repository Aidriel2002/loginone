import React, { useState, useEffect } from 'react';
import { auth } from './auth/firebase.js';
import {signOut, onAuthStateChanged } from 'firebase/auth'; 
import { useNavigate } from 'react-router-dom';



const StudentDetails = () => {
  const [displayName, setDisplayName] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const history = useNavigate();
  
  const messagesTab = () => {
    history('/messagestud')
  }
  const dashboard = () => {
    history('/student')
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
        setDisplayName(user.displayName);
      } else {
        setAuthUser(null);
        setDisplayName(null);
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
            <p>Evaluation</p>
            <p>Registration</p>
            <p>Account Subledger</p>
            <p>Enlistment</p>
            <p onClick={messagesTab}>Message</p>
            
          </div>    

          <div className="user-right">
            <p className='authName'>{`${displayName}`}</p>
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
        <p></p>
      )}
      
      <p className='greet'>Student<br/> Welcome <span>{` ${displayName}`}</span>!</p>
 

    </div>
  );
};

export default StudentDetails;
