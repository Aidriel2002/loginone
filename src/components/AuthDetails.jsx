import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './auth/firebase';
import { useNavigate } from 'react-router-dom';
import './AuthDetails.css'

const AuthDetails = () => {
  const [displayName, setDisplayName] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const history = useNavigate();

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
        setDisplayName(user.displayName);
      } else {
        setAuthUser(null);
        setDisplayName(null);
        setShowDropdown(false);
      }
    }); 

    return () => {
      listen();
    };
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("sign out successful");
        history('/');
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="user-container">
      {authUser ? (
        <div className="user">
          <img src="logoW.png" alt="logoW" />
          
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
           <p className='greet'> Welcome <span>{` ${displayName}`}</span>!</p>

    </div>
  );
};

export default AuthDetails;
