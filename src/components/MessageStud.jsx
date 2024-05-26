import React, { useState, useEffect } from 'react';
import { db, auth } from './auth/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './MessageStud.css'

const MessageStud = () => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recipient, setRecipient] = useState('');
  const navigate = useNavigate();
  const messageIds = new Set(); 

  const dashboard = () => {
    navigate('/student');
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
        setDisplayName(user.displayName);
        setUser(user);
      } else {
        setAuthUser(null);
        setDisplayName(null);
        setShowDropdown(false);
        setUser(null);
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
        console.log('Sign out successful');
        navigate('/');
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (user) {
      const messagesRef = collection(db, 'messages');
      const sentQuery = query(messagesRef, where('sender', '==', user.uid), orderBy('createdAt', 'desc'));
      const receivedQuery = query(messagesRef, where('recipient', '==', user.uid), orderBy('createdAt', 'desc'));

      const handleSnapshot = (querySnapshot) => {
        const newMessages = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
          }))
          .filter((msg) => !messageIds.has(msg.id)); 

        newMessages.forEach((msg) => messageIds.add(msg.id)); 

        setMessages((prevMessages) => [...newMessages, ...prevMessages]);
      };

      const unsubscribeSent = onSnapshot(sentQuery, handleSnapshot);
      const unsubscribeReceived = onSnapshot(receivedQuery, handleSnapshot);

      return () => {
        unsubscribeSent();
        unsubscribeReceived();
      };
    }
  }, [user]);

  const handleMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleRecipientChange = (e) => {
    setRecipient(e.target.value);
  };

  const sendMessage = async () => {
    if (newMessage.trim() !== '' && user && recipient.trim() !== '') {
      try {
        const messagesRef = collection(db, 'messages');
        const createdAt = new Date();
        const messageData = {
          text: newMessage,
          createdAt: createdAt,
          sender: user.uid,
          senderName: user.displayName || 'Anonymous',
          recipient: recipient,
        };
        const docRef = await addDoc(messagesRef, messageData);

    
        messageIds.add(docRef.id);
        setNewMessage('');
        setRecipient('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
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
            <p>Message</p>
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

      <div className='messaging'>
        <h1>Messages</h1>

        <p>Admin UID:  DUlP7zw9fJa64Bmd2BOCCRdmyaD3</p>
        <div>
          <input className='SDinput'
            type="text"
            value={recipient}
            onChange={handleRecipientChange}
            placeholder="Recipient UID"
          /> <br/>
          <input className='SDinput'
            type="text"
            value={newMessage}
            onChange={handleMessageChange}
            placeholder="Type your message..."
          /><br/>
          <button className='sbttn' onClick={sendMessage}>Send</button>
        </div>
        <div>
          <h4>Inbox</h4>
          {messages.map((message) => (
            <div key={message.id} style={{ textAlign: message.sender === user.uid ? 'right' : 'left' }}>
              <p><strong>{message.senderName}:</strong> {message.text}</p>
              <small>{message.createdAt.toLocaleString()}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessageStud;
