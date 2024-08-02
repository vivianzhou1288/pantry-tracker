// "use client";
// import { useState, useEffect } from "react";
// import { firestore } from "../firebase.js";
// import {
//   collection,
//   doc,
//   query,
//   getDocs,
//   setDoc,
//   deleteDoc,
//   getDoc,
// } from "firebase/firestore";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Grid,
//   Box,
//   List,
//   ListItem,
//   Button,
//   Card,
//   CardContent,
//   Stack,
//   CssBaseline,
//   createTheme,
//   ThemeProvider,
//   Input,
//   TextField,
//   InputAdornment,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import AddCircleIcon from "@mui/icons-material/AddCircle";
// import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
// import "./globals.css";
// import { inter, roboto_mono, kanit } from "./fonts.js";

// const theme = createTheme({
//   typography: {
//     fontFamily: kanit.style.fontFamily,
//   },
// });

// export default function ShoppingList() {
//   const [pantry, setPantry] = useState([]);
//   const [itemName, setItemName] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [recipes, setRecipes] = useState("");

//   const updatePantry = async () => {
//     const snapshoot = query(collection(firestore, "pantry"));
//     const docs = await getDocs(snapshoot);
//     const pantryList = [];
//     docs.forEach((doc) => {
//       pantryList.push({ name: doc.id, ...doc.data() });
//     });
//     console.log(pantryList);
//     setPantry(pantryList);
//   };

//   useEffect(() => {
//     updatePantry();
//   }, []);

//   const addItem = async (item) => {
//     const docRef = doc(collection(firestore, "pantry"), item);
//     const docSnap = await getDoc(docRef);
//     if (docSnap.exists()) {
//       const { count } = docSnap.data();
//       await setDoc(docRef, { count: count + 1 });
//       await updatePantry();
//     } else {
//       await setDoc(docRef, { count: 1 });
//     }
//     await updatePantry();
//   };

//   const incrementItem = async (item) => {
//     const docRef = doc(collection(firestore, "pantry"), item);
//     const docSnap = await getDoc(docRef);
//     const { count } = docSnap.data();
//     await setDoc(docRef, { count: count + 1 });
//     await updatePantry();
//   };

//   const removeItem = async (item) => {
//     const docRef = doc(collection(firestore, "pantry"), item);
//     const docSnap = await getDoc(docRef);
//     if (docSnap.exists()) {
//       await deleteDoc(docRef);
//     }
//     await updatePantry();
//   };

//   const decrementItem = async (item) => {
//     const docRef = doc(collection(firestore, "pantry"), item);
//     const docSnap = await getDoc(docRef);
//     if (docSnap.exists()) {
//       const { count } = docSnap.data();
//       if (count === 1) {
//         await deleteDoc(docRef);
//       } else {
//         await setDoc(docRef, { count: count - 1 });
//       }
//     }
//     await updatePantry();
//   };

//   const handleKeyPress = (event) => {
//     if (event.key === "Enter") {
//       addItem(itemName);
//       setItemName("");
//     }
//   };

//   const filteredPantry = pantry.filter(({ name }) =>
//     name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const formatIngredients = (ingredients) => {
//     return ingredients.map((item) => item.name).join(", ");
//   };

//   const OPENROUTER_API_KEY =
//     "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";

//   const fetchRecipeSuggestions = async () => {
//     const ingredientsString = formatIngredients(pantry);

//     try {
//       const response = await fetch(
//         "https://openrouter.ai/api/v1/chat/completions",
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${OPENROUTER_API_KEY}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             model: "meta-llama/llama-3.1-8b-instruct:free",
//             messages: [
//               {
//                 role: "user",
//                 content: `I have the following ingredients in my pantry: ${ingredientsString}. Can you suggest some recipes I can make with these ingredients? Please return just a JSON format where you will have a name, ingredients, and recipe area, with no introduction or conclusion.`,
//               },
//             ],
//           }),
//         }
//       );

//       const data = await response.json();
//       console.log(data.choices[0].message.content);
//       const recipes = JSON.parse(data.choices[0].message.content);
//       console.log(recipes);
//       setRecipes(recipes);
//       // setRecipes(data.choices[0].message.content);
//     } catch (error) {
//       console.error("Error fetching recipe suggestions:", error);
//     }
//   };

//   useEffect(() => {
//     if (pantry.length > 0) {
//       fetchRecipeSuggestions();
//     }
//   }, [pantry]);

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <Box bgcolor={"white"} sx={{ height: "100vh", flex: 1 }}>
//         <AppBar position="static" sx={{ backgroundColor: "#AFD9E4" }}>
//           <Toolbar>
//             <Typography variant="h6" sx={{ flexGrow: 1 }}>
//               Shopping List
//             </Typography>
//             <Button color="inherit" sx={{ fontFamily: roboto_mono }}>
//               John Smith
//             </Button>
//           </Toolbar>
//         </AppBar>
//         <Grid
//           container
//           spacing={5}
//           sx={{ paddingLeft: 10, paddingRight: 10, paddingTop: 5 }}
//         >
//           <Grid item xs={12} md={8}>
//             <Box>
//               <TextField
//                 variant="outlined"
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <Button
//                         color="primary"
//                         startIcon={<AddIcon />}
//                         onClick={() => {
//                           addItem(itemName);
//                           setItemName("");
//                         }}
//                       ></Button>
//                     </InputAdornment>
//                   ),
//                 }}
//                 fullWidth
//                 sx={{ marginBottom: "10px" }}
//                 placeholder="Add Item here"
//                 value={itemName}
//                 onChange={(e) => setItemName(e.target.value)}
//                 onKeyPress={handleKeyPress}
//               />

//               <Stack
//                 sx={{
//                   width: "100%",
//                   height: "300px",
//                   border: "1px solid gray",
//                   overflowY: "scroll",
//                   scrollbarColor: "lightgray black",
//                   scrollbarWidth: "thin", // For Firefox
//                   scrollbarColor: "lightgray black", // For Firefox
//                   "&::-webkit-scrollbar": {
//                     width: "12px", // Width of the scrollbar
//                   },
//                   "&::-webkit-scrollbar-track": {
//                     background: "lightgray", // Background color of the scrollbar track
//                   },
//                   "&::-webkit-scrollbar-thumb": {
//                     backgroundColor: "black", // Color of the scrollbar thumb
//                     borderRadius: "6px", // Border radius for the thumb
//                     border: "3px solid lightgray", // Optional: border around the thumb
//                   },
//                 }}
//               >
//                 <List>
//                   <Typography
//                     variant="h6"
//                     align="center"
//                     sx={{ color: "black", fontWeight: "600" }}
//                   >
//                     Your Pantry Items:
//                   </Typography>
//                   <Box sx={{ margin: "10px" }}>
//                     <TextField
//                       placeholder="Search for item"
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                       fullWidth
//                     />
//                   </Box>
//                   {filteredPantry.length === 0 ? (
//                     <Typography
//                       variant="h6"
//                       align="center"
//                       sx={{ color: "black" }}
//                     >
//                       No items found
//                     </Typography>
//                   ) : (
//                     filteredPantry.map(({ name, count }) => (
//                       <ListItem
//                         key={name}
//                         sx={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                         }}
//                       >
//                         <Box
//                           sx={{
//                             display: "flex",
//                             alignItems: "center",
//                           }}
//                         >
//                           <Button onClick={() => removeItem(name)}>
//                             <DeleteOutlineIcon sx={{ color: "red" }} />
//                           </Button>
//                           <Typography
//                             variant="h7"
//                             sx={{
//                               color: "black",
//                               marginLeft: "10px",
//                             }}
//                           >
//                             {name.charAt(0).toUpperCase() + name.slice(1)}
//                           </Typography>
//                         </Box>
//                         <Box
//                           sx={{
//                             display: "flex",
//                             flexDirection: "row",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             marginRight: "15px",
//                           }}
//                         >
//                           <RemoveCircleIcon
//                             color="secondary"
//                             style={{ cursor: "pointer" }}
//                             onClick={() => {
//                               decrementItem(name);
//                             }}
//                           />
//                           <Typography
//                             color="black"
//                             sx={{ marginLeft: "15px", marginRight: "15px" }}
//                           >
//                             {count}
//                           </Typography>
//                           <AddCircleIcon
//                             color="secondary"
//                             style={{ cursor: "pointer" }}
//                             onClick={() => {
//                               incrementItem(name);
//                             }}
//                           />
//                         </Box>
//                       </ListItem>
//                     ))
//                   )}
//                 </List>
//               </Stack>
//             </Box>
//           </Grid>

//           <Grid item xs={12} md={4}>
//             <Box>
//               <Card sx={{ marginBottom: 2 }}>
//                 <CardContent>
//                   <Typography variant="h6">Recipe Suggestions</Typography>
//                 </CardContent>
//               </Card>
//             </Box>
//           </Grid>
//         </Grid>
//       </Box>
//     </ThemeProvider>
//   );
// }

"use client";
import React, { useEffect, useState } from "react";
import { Button, Typography, Container, Box } from "@mui/material";
import { auth, firestore, googleAuthProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { doc, setDoc, getDoc } from "firebase/firestore";
import GoogleLoginButton from "./components/GoogleLoginButton";
import { useUser } from "./context/UserContext";

const Homepage = () => {
  const { setUser } = useUser();
  const router = useRouter();
  // const [user, setUser] = useState(null);
  // const googleAuth = new GoogleAuthProvider();
  const login = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const userData = result.user;
      console.log(userData);

      const userDocRef = doc(firestore, "users", userData.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          uid: userData.uid,
          email: userData.email,
          displayName: userData.displayName,
          photoURL: userData.photoURL,
        });
      }

      setUser(userData);
      router.push("/pantry");
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        router.push("/pantry");
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [router]);

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
          <GoogleLoginButton onClick={login} />
        </Box>
      </Box>
    </Container>
  );
};

export default Homepage;
