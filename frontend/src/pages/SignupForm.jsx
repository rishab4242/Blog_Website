import * as React from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function SignupForm() {
  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();

  // 🔥 HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // clear error on typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // 🔥 VALIDATION
  const validate = () => {
    let temp = {};

    if (!formData.username) temp.username = "Username is required";

    if (!formData.email) temp.email = "Email is required";

    if (!formData.email.includes("@")) temp.email = "Invalid email format";

    if (!formData.password) temp.password = "Password is required";

    if (formData.password.length < 6)
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
      let res = await axios.post(
        `${import.meta.env.VITE_API_URL}/blogs/signup`,
        formData,
      );

      // 🔥 SUCCESS TOAST
      toast.success(res.data.message || "Account created 🎉", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });

      // reset form
      setFormData({
        username: "",
        email: "",
        password: "",
      });

      navigate("/blogs/login");
    } catch (error) {
      console.log(error);

      // 🔥 SAFE ERROR HANDLING
      toast.error(error?.response?.data?.message || "Signup failed", {
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
    <>
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.25)", // lighter overlay
            backdropFilter: "blur(2px)", // 🔥 modern glass effect
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <CircularProgress size={60} sx={{ color: "#fff" }} />
          <Typography sx={{ mt: 2, color: "#fff" }}>Please Wait...</Typography>
        </Box>
      )}
      <Container
        maxWidth="sm"
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            width: "100%", 
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
            {/* Username */}
            <TextField
              fullWidth
              label="Enter Username"
              name="username"
              margin="normal"
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
            />

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
              {loading ? "Creating..." : "Sign Up"}
            </Button>
          </Box>

          {/* Login link */}
          <Typography align="center" sx={{ mt: 2 }}>
            Already have account?{" "}
            <span
              style={{
                color: "blue",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => navigate("/blogs/login")}
            >
              Login
            </span>
          </Typography>
        </Paper>
      </Container>
    </>
  );
}
