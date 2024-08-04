"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Container,
  Box,
  Grid,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import { useRouter } from "next/navigation";
import GoogleLoginButton from "./components/GoogleLoginButton";
import { UserAuth } from "./context/UserContext";
import { inter, roboto_mono, kanit } from "./fonts.js";
// import foodImage from "./public/food.jpeg";

const theme = createTheme({
  typography: {
    fontFamily: kanit.style.fontFamily,
  },
});

const Homepage = () => {
  // const { setUser } = useUser();
  const router = useRouter();
  const [checkingAuthState, setCheckingAuthState] = useState(false);
  const { googleLogin } = UserAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        maxWidth="xl"
        sx={{
          backgroundImage:
            'url("https://i.pinimg.com/564x/50/93/fa/5093faa7f2774ccb048fb74fc7b85edb.jpg")',
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "white",
          color: "black",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Box textAlign="center">
          <Typography
            variant="h4"
            gutterBottom
            sx={{ textAlign: "center", marginBottom: "10px" }}
          >
            Welcome to the Tracker.
          </Typography>
          <Typography sx={{ textAlign: "center", marginBottom: "20px" }}>
            Keep track of what is in your pantry with the Tracker. Get recipe
            suggestions based on what is your pantry.
          </Typography>
          <Box sx={{ marginBottom: "20px" }}>
            <GoogleLoginButton onClick={googleLogin} />
          </Box>
          {/* <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Typography variant="h6">
              Keep track of what is in your pantry
            </Typography>
            <Typography variant="p">
              Add items into a list to keep track of your pantry
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Get Recipe Suggestions</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">
              
            </Typography>
          </Grid>
        </Grid> */}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Homepage;
