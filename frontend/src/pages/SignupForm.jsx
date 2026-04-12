import * as React from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignupForm() {
  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await axios.post(
        "http://localhost:8080/blogs/signup",
        formData,
      );
      alert(res.data.message);
      setFormData({
        username: "",
        email: "",
        password: "",
      });
      navigate("/blogs/login");
    } catch (error) {
      console.log(error);
      alert(res.data.error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          marginTop: 8,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Create Account
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Enter Username"
            name="username"
            margin="normal"
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            margin="normal"
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            margin="normal"
            onChange={handleChange}
            required
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{
              mt: 3,
              py: 1.5,
              fontSize: "16px",
              borderRadius: 2,
            }}
          >
            Sign Up
          </Button>
        </Box>
        <Typography align="center" sx={{ mt: 2 }}>
          Already have account?{" "}
          <span
            style={{ color: "blue", cursor: "pointer", fontWeight: "bold" }}
            onClick={() => navigate("/blogs/login")}
          >
            Login
          </span>
        </Typography>
      </Paper>
    </Container>
  );
}
