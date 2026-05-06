import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f9fafb",
        textAlign: "center",
        px: 2,
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 80, color: "#ff6b6b", mb: 2 }} />

      <Typography variant="h3" fontWeight="bold" gutterBottom>
        404 - Page Not Found
      </Typography>

      <Typography variant="body1" color="text.secondary" mb={3}>
        Sorry, the page you are looking for doesn’t exist or has been moved.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/blogs")}
        sx={{ textTransform: "none", px: 4, py: 1 }}
      >
        Go Back Home
      </Button>
    </Box>
  );
};

export default NotFound;
