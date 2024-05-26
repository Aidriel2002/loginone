import React, { useState, useEffect } from 'react';
import { auth, db } from './auth/firebase.js';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './AuthDetails.css';
import Modal from './Modal.js';
import SignUp from './auth/SignUp.jsx';
import { collection, onSnapshot, query, where, orderBy, addDoc, Timestamp } from 'firebase/firestore';
import './Messages.css'

const Messages = () => {
  const [authUser, setAuthUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [replies, setReplies] = useState({});
  const [selectedSender, setSelectedSender] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, where('recipient', '==', 'DUlP7zw9fJa64Bmd2BOCCRdmyaD3'), orderBy('createdAt', 'desc'));
  
    const unsubscribeMessages = onSnapshot(q, (querySnapshot) => {
      const messagesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));
      setMessages(messagesData);
    });
  
    const repliesRef = collection(db, 'messages');
    const repliesQuery = query(repliesRef, where('recipient', '==', 'DUlP7zw9fJa64Bmd2BOCCRdmyaD3'), orderBy('createdAt', 'asc'));
  
    const unsubscribeReplies = onSnapshot(repliesQuery, (querySnapshot) => {
      const repliesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));
      setReplies(repliesData);
    });
  
    return () => {
      unsubscribeAuth();
      unsubscribeMessages();
      unsubscribeReplies();
    };
  }, []);

  const handleReplyChange = (e, senderId) => {
    setReplies({ ...replies, [senderId]: e.target.value });
  };

  const sendReply = async (senderId) => {
    const replyMessage = replies[senderId];
    if (replyMessage.trim() !== '' && user) {
      try {
        const messagesRef = collection(db, 'messages');
        await addDoc(messagesRef, {
          text: replyMessage,
          createdAt: Timestamp.fromDate(new Date()),
          sender: user.uid,
          senderName: user.displayName || 'Anonymous',
          recipient: senderId,
          isReply: true,
        });
        setReplies({ ...replies, [senderId]: '' });
      } catch (error) {
        console.error('Error sending reply:', error);
      }
    }
  };

  const openSignUpModal = () => {
    setShowSignUpModal(true);
  };

  const closeSignUpModal = () => {
    setShowSignUpModal(false);
  };

  const messagesTab = () => {
    navigate('/messages');
  };

  const studentListTab = () => {
    navigate('/studentList');
  };

  const dashboard = () => {
    navigate('/admin');
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
        navigate('/');
      })
      .catch((error) => console.log(error));
  };

  const toggleSenderMessages = (senderId) => {
    setSelectedSender(selectedSender === senderId ? null : senderId);
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
            <p onClick={messagesTab}>Messages</p>
            <p onClick={openSignUpModal}>Add Student</p>
          </div>

          <div className="user-right">
            <p className='authName'>{authUser.displayName || 'User'}</p>
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
      ) : null}

      <div>
       
        <h1>Inbox</h1>
        <div className='inbox'>
          
          {messages.reduce((uniqueSenders, message) => {
            if (!uniqueSenders.includes(message.sender)) {
              uniqueSenders.push(message.sender);
            }
            return uniqueSenders;
          }, []).map((senderId) => (
            <div key={senderId}>
              <h4 onClick={() => toggleSenderMessages(senderId)} className="sender-name">
                {messages.find(msg => msg.sender === senderId).senderName || 'Anonymous'}
              </h4>
              {selectedSender === senderId && (
                <div className="message-container">
                  {messages.filter(msg => msg.sender === senderId).map((msg) => (
                    <div key={msg.id} className={`message ${msg.sender === user?.uid ? 'my-message' : ''}`}>
                      <p><strong>{msg.senderName}:</strong> {msg.text}</p>
                      <small>
                        Sent on {msg.createdAt.toLocaleDateString()} at {msg.createdAt.toLocaleTimeString()}
                      </small>
                    </div>
                    
                  ))}
                  <div className="reply-container">
                    <input
                      type="text"
                      value={replies[senderId] || ''}
                      onChange={(e) => handleReplyChange(e, senderId)}
                      placeholder="Type your reply..."
                      className="reply-input"
                    />
                    <button onClick={() => sendReply(senderId)} className="reply-button">Reply</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        

      </div>

      {showSignUpModal && (
        <Modal onClose={closeSignUpModal}>
          <SignUp />
        </Modal>
      )}
    </div>
  );
};

export default Messages;
