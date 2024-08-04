"use client";
import React from "react";
import CircularProgress from "@mui/joy/CircularProgress";
import { Box } from "@mui/material";

const Loading = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress size="lg" color="neutral" />
    </Box>
  );
};

export default Loading;
