"use client";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
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
// import Input from "@mui/joy/Input";
import "./globals.css";
import { Delete } from "@mui/icons-material";

const theme = createTheme({
  fontFamily: "Inter",
  body1: {
    fontSmooth: "always", // Ensure font smoothing is applied
    WebkitFontSmoothing: "antialiased", // Chrome/Safari
    MozOsxFontSmoothing: "grayscale", // Firefox
  },
});

export default function ShoppingList() {
  const [pantry, setPantry] = useState([]);
  const [itemName, setItemName] = useState("");

  const recommendedItems = [
    {
      time: "Added 1 week ago",
      items: [
        "Maple Syrup",
        "Ice Cream",
        "Muffins",
        "Jam",
        "Fabric Softener",
        "Detergent",
      ],
    },
    {
      time: "Added 2 weeks ago",
      items: [
        "Honey",
        "Napkins",
        "Toilet Paper",
        "Yogurt",
        "Fish",
        "Perogies",
        "Crackers",
      ],
    },
    {
      time: "Popular Items",
      items: ["Apple", "Banana", "Broccoli", "Butter", "Tomato"],
    },
  ];

  const updatePantry = async () => {
    const snapshoot = query(collection(firestore, "pantry"));
    const docs = await getDocs(snapshoot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({ name: doc.id, ...doc.data() });
    });
    console.log(pantryList);
    setPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);
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

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count === 1) {
        await deleteDoc(docRef);
      }
    } else {
      await setDoc(docRef, { count: count - 1 });
    }
    await updatePantry();
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      addItem(itemName);
      setItemName("");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box bgcolor={"white"}>
        <AppBar position="static" sx={{ backgroundColor: "#AFD9E4" }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: "Inter" }}>
              Shopping List
            </Typography>
            <Button color="inherit" sx={{ fontFamily: "Inter" }}>
              John Smith
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
                  {pantry.map((name, count, index) => (
                    <ListItem
                      key={index}
                      sx={{ display: "flex", justifyContent: "space-between" }}
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
                          sx={{
                            color: "black",
                            fontFamily: "Inter",
                            marginLeft: "10px",
                          }}
                        >
                          {name.charAt(0).toUpperCase() + name.slice(1)}
                        </Typography>
                      </Box>
                      <Button>{count}</Button>
                    </ListItem>
                  ))}
                </List>
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box>
              <Card sx={{ marginBottom: 2 }}>
                <CardContent>
                  <Typography variant="h6">
                    Collaborate on your shopping list
                  </Typography>
                  <Button variant="contained" color="primary" fullWidth>
                    Share Invite Link
                  </Button>
                </CardContent>
              </Card>
              {recommendedItems.map((group, index) => (
                <Card key={index} sx={{ marginBottom: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{group.time}</Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {group.items.map((item, idx) => (
                        <Button
                          key={idx}
                          variant="outlined"
                          sx={{ margin: 0.5 }}
                        >
                          {item}
                        </Button>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
