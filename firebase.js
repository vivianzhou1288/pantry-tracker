// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDsnwltfaVLnga8Ts-QthvZjekEOvY8rEw",
//   authDomain: "pantry-app-1de27.firebaseapp.com",
//   projectId: "pantry-app-1de27",
//   storageBucket: "pantry-app-1de27.appspot.com",
//   messagingSenderId: "534227855949",
//   appId: "1:534227855949:web:5ea25244b9888a8b5e0a04",
//   measurementId: "G-7WN2F4VG8S",
// };
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();
export { app, firestore, auth, googleAuthProvider };
