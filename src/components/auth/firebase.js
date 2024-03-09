import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyD3pWYWH0RA_Fn9Pu1ZlqqGlJiUWigYybs",
    authDomain: "nieldo-1ef3a.firebaseapp.com",
    projectId: "nieldo-1ef3a",
    storageBucket: "nieldo-1ef3a.appspot.com",
    messagingSenderId: "410082067433",
    appId: "1:410082067433:web:d9cb3920d9f0cb3b2a0178"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Use getFirestore to get Firestore instance
const db = getFirestore(app);

// Use getAuth to get Auth instance
const auth = getAuth(app);

export { app, db, auth };