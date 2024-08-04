"use client";
import { useState, useEffect } from "react";
import ReplyLoading from "../components/ReplyLoader";
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
  Popover,
  TextField,
  InputAdornment,
  Avatar,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import "../globals.css";
import { inter, roboto_mono, kanit } from "../fonts.js";
import { UserAuth } from "../context/UserContext.js";
import Loading from "../components/LoadingPage.js";

const theme = createTheme({
  typography: {
    fontFamily: kanit.style.fontFamily,
  },
});

export default function ShoppingList() {
  const { user, firestore, loading, logOut } = UserAuth();
  const [searchLoading, setSearchLoading] = useState(false);
  const [pantry, setPantry] = useState([]);
  const [itemName, setItemName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [aiLoading, setAILoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  // const open = Boolean(anchorEl);

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
    return <Loading />;
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

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setSearchLoading(true);
  };

  const parseRecipes = (text) => {
    const recipes = text.split(/\n\s*\*\*/).filter(Boolean);

    // Return the processed recipes with title headers
    return recipes.map((recipe) => recipe.trim());
  };

  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

  const fetchRecipeSuggestions = async () => {
    const ingredientsString = formatIngredients(pantry);
    setAILoading(true);

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
      setRecipes(parseRecipe);
      setAILoading(false);
    } catch (error) {
      console.log("Error fetching recipe suggestions:", error.message);
      setAILoading(false);
    }
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box bgcolor={"white"} sx={{ height: "100vh", flex: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: "#AFD9E4" }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              My Pantry
            </Typography>
            <Button
              color="inherit"
              sx={{ fontFamily: roboto_mono }}
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={() => {
                // Delay closing to allow entering the popover
                setTimeout(() => {
                  if (!open) handlePopoverClose();
                }, 200);
              }}
              s
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  alt="Profile Picture"
                  src={user.photoURL}
                  sx={{ marginRight: "10px", width: 30, height: 30 }}
                />
                <Typography variant="p">{user.displayName}</Typography>
              </Box>
            </Button>
            <Popover
              id="mouse-over-popover"
              sx={{
                pointerEvents: "none",
              }}
              open={open}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              onClose={handlePopoverClose}
              disableRestoreFocus
            >
              <Box
                sx={{
                  p: 1,
                  pointerEvents: "auto",
                }}
                onMouseEnter={() => clearTimeout(handlePopoverClose)}
                onMouseLeave={handlePopoverClose}
              >
                <MenuItem onClick={logOut}>Logout</MenuItem>
              </Box>
            </Popover>
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
                  scrollbarColor: "lightgray gray", // For Firefox
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
                      onChange={handleSearch}
                      fullWidth
                    />
                  </Box>
                  {searchLoading && filteredPantry.length === 0 ? (
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
                  <Box align="center">
                    <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                      Recipe Suggestions
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={fetchRecipeSuggestions}
                      disabled={pantry.length === 0}
                    >
                      Ask AI For Recipe Suggestions
                    </Button>
                  </Box>
                  {aiLoading ? (
                    <Box sx={{ marginTop: "1rem" }}>
                      <ReplyLoading />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        marginTop: "1rem",
                        maxHeight: "30rem",
                        overflowY: "scroll",
                        scrollbarColor: "lightgray black",
                        scrollbarWidth: "thin", // For Firefox
                        scrollbarColor: "lightgray gray", // For Firefox
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
                  )}

                  {/* {recipes ? ( */}

                  {/* ) : null} */}
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
