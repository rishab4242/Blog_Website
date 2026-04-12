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

export default function LoginForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res = await axios.post("http://localhost:8080/blogs/login", formData);

      localStorage.setItem("token", res.data.token);

      console.log(res.data.token);

      alert(res.data.message);
      navigate("/blogs");
      setFormData({
        email: "",
        password: "",
      });
    } catch (error) {
      console.log(error);
      alert(error.res?.data?.message || "Login failed");
      setFormData({
        email: "",
        password: "",
      });
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
          Login
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            margin="normal"
            value={formData.password}
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
            Login
          </Button>
        </Box>
        <Typography align="center" sx={{ mt: 2 }}>
                  Don't have account?{" "}
                  <span
                    style={{ color: "blue", cursor: "pointer", fontWeight: "bold" }}
                    onClick={() => navigate("/blogs/signup")}
                  >
                    Signup
                  </span>
                </Typography>
      </Paper>
    </Container>
  );
}
