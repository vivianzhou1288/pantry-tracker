"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth, firestore, googleAuthProvider } from "../../firebase.js";
import { toast } from "react-toastify";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      console.log(result);
      const user = result.user;
      if (user) {
        const userDocRef = doc(firestore, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (!userDocSnap.exists()) {
          await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          });
        }
        toast.success("User logged in Successfully", {
          position: "top-center",
        });
        router.push("/pantry");
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Login failed. Please try again.", {
        position: "top-center",
      });
    }
  };

  const googleLogin = () => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        login();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const logOut = () => {
    signOut(auth);
    setUser(null);
    router.push("/");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log("User:", user);
      } else {
        setUser(null);
        // setCheckingAuthState(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider
      value={{
        googleLogin,
        logOut,
        user,
        auth,
        firestore,
        googleAuthProvider,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => useContext(UserContext);
