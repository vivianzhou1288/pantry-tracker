import { Button, Typography, Box } from "@mui/material";
import { Google } from "@mui/icons-material"; // Google icon from Material-UI

const GoogleLoginButton = ({ onClick }) => {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      sx={{
        backgroundColor: "#4285F4", // Google blue color
        color: "#fff",
        borderRadius: 2,
        boxShadow: "none",
        "&:hover": {
          backgroundColor: "#357ae8",
        },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mx: "auto",
      }}
    >
      <Google sx={{ mr: 1 }} />
      <Typography variant="button">Sign in with Google</Typography>
    </Button>
  );
};

export default GoogleLoginButton;
