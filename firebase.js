// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsnwltfaVLnga8Ts-QthvZjekEOvY8rEw",
  authDomain: "pantry-app-1de27.firebaseapp.com",
  projectId: "pantry-app-1de27",
  storageBucket: "pantry-app-1de27.appspot.com",
  messagingSenderId: "534227855949",
  appId: "1:534227855949:web:5ea25244b9888a8b5e0a04",
  measurementId: "G-7WN2F4VG8S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { app, firestore };
// const analytics = getAnalytics(app);
