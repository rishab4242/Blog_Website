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
import toast from "react-hot-toast";

export default function LoginForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  // 🔥 HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // 🔥 VALIDATION
  const validate = () => {
    let temp = {};

    if (!formData.email) temp.email = "Email is required";

    if (!formData.email.includes("@")) temp.email = "Invalid email format";

    if (!formData.password) temp.password = "Password is required";

    if (formData.password.length < 3)
      temp.password = "Password must be at least 6 characters";

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

  // 🔥 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix form errors", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }

    setLoading(true);

    try {
      let res = await axios.post("http://localhost:8080/blogs/login", formData);

      // save token
      localStorage.setItem("token", res.data.token);

      // 🔥 SUCCESS TOAST
      toast.success(res.data.message || "Login successful 🎉", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });

      // reset form
      setFormData({
        email: "",
        password: "",
      });

      navigate("/blogs");
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || "Login failed", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } finally {
      setLoading(false);
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
          {/* Email */}
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />

          {/* Password */}
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />

          {/* Submit */}
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{
              mt: 3,
              py: 1.5,
              fontSize: "16px",
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Box>

        {/* Signup link */}
        <Typography align="center" sx={{ mt: 2 }}>
          Don't have account?{" "}
          <span
            style={{
              color: "blue",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={() => navigate("/blogs/signup")}
          >
            Signup
          </span>
        </Typography>
      </Paper>
    </Container>
  );
}
