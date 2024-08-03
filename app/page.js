"use client";
import React, { useEffect, useState } from "react";
import { Button, Typography, Container, Box } from "@mui/material";
import { auth, firestore, googleAuthProvider } from "../firebase";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { doc, setDoc, getDoc } from "firebase/firestore";
import GoogleLoginButton from "./components/GoogleLoginButton";
import { UserAuth } from "./context/UserContext";
import { toast } from "react-toastify";

const Homepage = () => {
  // const { setUser } = useUser();
  const router = useRouter();
  const [checkingAuthState, setCheckingAuthState] = useState(false);
  const { googleLogin } = UserAuth();
  // const [user, setUser] = useState(null);
  // const googleAuth = new GoogleAuthProvider();

  // useEffect(() => {
  //   const clearAuthState = async () => {
  //     await signOut(auth);
  //     setCheckingAuthState(false);
  //   };
  //   clearAuthState();
  // }, []);

  // const login = async () => {
  //   try {
  //     const result = await signInWithPopup(auth, googleAuthProvider);
  //     console.log(result);
  //     const user = result.user;
  //     if (user) {
  //       const userDocRef = doc(firestore, "users", user.uid);
  //       const userDocSnap = await getDoc(userDocRef);
  //       if (!userDocSnap.exists()) {
  //         await setDoc(userDocRef, {
  //           uid: user.uid,
  //           email: user.email,
  //           displayName: user.displayName,
  //           photoURL: user.photoURL,
  //         });
  //       }
  //       toast.success("User logged in Successfully", {
  //         position: "top-center",
  //       });
  //       setUser(user);
  //       router.push("/pantry");
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //     toast.error("Login failed. Please try again.", {
  //       position: "top-center",
  //     });
  //   }
  // };

  // const googleLogin = () => {
  //   setPersistence(auth, browserLocalPersistence)
  //     .then(() => {
  //       login();
  //     })
  //     .catch((error) => {
  //       console.log(error.message);
  //     });
  // };

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       setUser(user);
  //       router.push("/pantry");
  //     } else {
  //       setUser(null);
  //       setCheckingAuthState(false);
  //     }
  //   });

  //   return () => unsubscribe();
  // }, [router]);

  // if (checkingAuthState) {
  //   return <div>Loading...</div>; // You can replace this with a loader component if you want
  // }

  return (
    <Container
      maxWidth="xl"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Full viewport height
      }}
    >
      <Box>
        <Typography variant="h4" gutterBottom>
          Welcome to Food Pantry Tracker.
        </Typography>
        <Box>
          <GoogleLoginButton onClick={googleLogin} />
        </Box>
      </Box>
    </Container>
  );
};

export default Homepage;
