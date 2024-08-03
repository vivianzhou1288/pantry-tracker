"use client";
import { useState, useEffect } from "react";
// import { auth, firestore } from "../../firebase.js";
// import { firestore } from "../../firebase";
import {
  collection,
  doc,
  query,
  getDocs,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import {
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Box,
  List,
  ListItem,
  Button,
  Card,
  CardContent,
  Stack,
  CssBaseline,
  createTheme,
  ThemeProvider,
  Input,
  TextField,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import "../globals.css";
import { inter, roboto_mono, kanit } from "../fonts.js";
import { UserAuth } from "../context/UserContext.js";

const theme = createTheme({
  typography: {
    fontFamily: kanit.style.fontFamily,
  },
});

export default function ShoppingList() {
  const { user, firestore, loading } = UserAuth();
  console.log(user);
  const [userDetails, setUserDetails] = useState(null);
  const [pantry, setPantry] = useState([]);
  const [itemName, setItemName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState("");

  const updatePantry = async () => {
    console.log(user);
    const pantryCollectionRef = collection(
      firestore,
      "users",
      user.uid,
      "pantry"
    );
    const pantryQuery = query(pantryCollectionRef);
    const querySnapshot = await getDocs(pantryQuery);
    // const docs = await getDocs(snapshoot);
    const pantryList = [];
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      pantryList.push({ name: doc.id, ...doc.data() });
    });
    console.log(pantryList);
    setPantry(pantryList);
  };

  useEffect(() => {
    if (!loading && user) {
      updatePantry(user);
    }
  }, [user, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to access the pantry.</div>;
  }

  const addItem = async (item) => {
    const docRef = doc(
      collection(firestore, "users", user.uid, "pantry"),
      item
    );
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1 });
      await updatePantry();
    } else {
      await setDoc(docRef, { count: 1 });
    }
    await updatePantry();
  };

  const incrementItem = async (item) => {
    const docRef = doc(
      collection(firestore, "users", user.uid, "pantry"),
      item
    );
    const docSnap = await getDoc(docRef);
    const { count } = docSnap.data();
    await setDoc(docRef, { count: count + 1 });
    await updatePantry();
  };

  const removeItem = async (item) => {
    const docRef = doc(
      collection(firestore, "users", user.uid, "pantry"),
      item
    );
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await deleteDoc(docRef);
    }
    await updatePantry();
  };

  const decrementItem = async (item) => {
    const docRef = doc(
      collection(firestore, "users", user.uid, "pantry"),
      item
    );
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - 1 });
      }
    }
    await updatePantry();
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      addItem(itemName, user.uid);
      setItemName("");
    }
  };

  const filteredPantry = pantry.filter(({ name }) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatIngredients = (ingredients) => {
    return ingredients.map((item) => item.name).join(", ");
  };

  const parseRecipes = (text) => {
    // Use a regex to split the text at each instance of `**`, while preserving the recipes
    const recipes = text.split(/\n\s*\*\*/).filter(Boolean);

    // Return the processed recipes with title headers
    return recipes.map((recipe) => recipe.trim());
  };

  const OPENROUTER_API_KEY =
    "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";

  const fetchRecipeSuggestions = async () => {
    const ingredientsString = formatIngredients(pantry);

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3.1-8b-instruct:free",
            messages: [
              {
                role: "user",
                content: `I have the following ingredients in my pantry: ${ingredientsString}. Can you suggest some recipes I can make with these ingredients? Begin each recipe on a new line. For each recipe, write down the ingredients needed, and then the recipe itself.`,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      console.log(data.choices[0].message.content);
      const parseRecipe = parseRecipes(data.choices[0].message.content);
      const recipes = parseRecipe.map((recipe) => recipe.trim());
      setRecipes(recipes);
      // setRecipes(data.choices[0].message.content);

      // setRecipes(data.choices[0].message.content);
    } catch (error) {
      console.error("Error fetching recipe suggestions:", error);
    }
  };

  // useEffect(() => {
  //   if (pantry.length > 0) {
  //     fetchRecipeSuggestions();
  //   }
  // }, [pantry]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box bgcolor={"white"} sx={{ height: "100vh", flex: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: "#AFD9E4" }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Shopping List
            </Typography>
            <Button color="inherit" sx={{ fontFamily: roboto_mono }}>
              {user.displayName}
            </Button>
          </Toolbar>
        </AppBar>
        <Grid
          container
          spacing={5}
          sx={{ paddingLeft: 10, paddingRight: 10, paddingTop: 5 }}
        >
          <Grid item xs={12} md={8}>
            <Box>
              <TextField
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => {
                          addItem(itemName);
                          setItemName("");
                        }}
                      ></Button>
                    </InputAdornment>
                  ),
                }}
                fullWidth
                sx={{ marginBottom: "10px" }}
                placeholder="Add Item here"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                onKeyPress={handleKeyPress}
              />

              <Stack
                sx={{
                  width: "100%",
                  height: "300px",
                  border: "1px solid gray",
                  overflowY: "scroll",
                  scrollbarColor: "lightgray black",
                  scrollbarWidth: "thin", // For Firefox
                  scrollbarColor: "lightgray black", // For Firefox
                  "&::-webkit-scrollbar": {
                    width: "12px", // Width of the scrollbar
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "lightgray", // Background color of the scrollbar track
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "black", // Color of the scrollbar thumb
                    borderRadius: "6px", // Border radius for the thumb
                    border: "3px solid lightgray", // Optional: border around the thumb
                  },
                }}
              >
                <List>
                  <Typography
                    variant="h6"
                    align="center"
                    sx={{ color: "black", fontWeight: "600" }}
                  >
                    Your Pantry Items:
                  </Typography>
                  <Box sx={{ margin: "10px" }}>
                    <TextField
                      placeholder="Search for item"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      fullWidth
                    />
                  </Box>
                  {filteredPantry.length === 0 ? (
                    <Typography
                      variant="h6"
                      align="center"
                      sx={{ color: "black" }}
                    >
                      No items found
                    </Typography>
                  ) : (
                    filteredPantry.map(({ name, count }) => (
                      <ListItem
                        key={name}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Button onClick={() => removeItem(name)}>
                            <DeleteOutlineIcon sx={{ color: "red" }} />
                          </Button>
                          <Typography
                            variant="h7"
                            sx={{
                              color: "black",
                              marginLeft: "10px",
                            }}
                          >
                            {name.charAt(0).toUpperCase() + name.slice(1)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "15px",
                          }}
                        >
                          <RemoveCircleIcon
                            color="secondary"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              decrementItem(name);
                            }}
                          />
                          <Typography
                            color="black"
                            sx={{ marginLeft: "15px", marginRight: "15px" }}
                          >
                            {count}
                          </Typography>
                          <AddCircleIcon
                            color="secondary"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              incrementItem(name);
                            }}
                          />
                        </Box>
                      </ListItem>
                    ))
                  )}
                </List>
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box>
              <Card sx={{ marginBottom: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                    Recipe Suggestions
                  </Typography>
                  <Button variant="contained" onClick={fetchRecipeSuggestions}>
                    Ask AI For Recipe Suggestions
                  </Button>
                  {recipes ? (
                    <Box
                      sx={{
                        marginTop: "1rem",
                        height: "30rem",
                        overflowY: "scroll",
                      }}
                    >
                      {recipes.map((recipe, index) => (
                        <Box key={index} style={{ marginBottom: "1rem" }}>
                          <Box>
                            <Typography variant="h5">
                              {recipe.split("\n")[0]}
                            </Typography>{" "}
                            <Typography variant="p">
                              {recipe.slice(recipe.indexOf("\n") + 1)}
                            </Typography>{" "}
                            {/* Rest of the recipe */}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  ) : null}
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
