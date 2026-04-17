import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import toast from "react-hot-toast";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(3),
  width: "100%",
  maxWidth: "400px",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  right: 0,
  top: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 2),
  },
}));

export default function Navbar() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");

  // 🔥 SEARCH
  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      navigate("/blogs");
      return;
    }
    navigate(`/blogs/search/${searchTerm}`);
  };

  // 🔥 NAV HELPERS
  const goSignup = () => navigate("/blogs/signup");
  const goLogin = () => navigate("/blogs/login");
  const goCart = () => navigate("/blogs/add_to_cart");

  // 🔥 CREATE BLOG PROTECTION
  const handleCreateBlog = () => {
    if (!isLoggedIn) {
      toast.error("Please login first 🔐", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });

      navigate("/blogs/login");
      return;
    }

    navigate("/blogs/create");
  };

  // 🔥 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");

    toast.success("Logged out successfully 👋", {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });

    navigate("/blogs/login");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* LOGO */}
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", cursor: "pointer" }}
          >
            <Link
              to="/blogs"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              My Blog
            </Link>
          </Typography>

          {/* SEARCH */}
          <Search>
            <StyledInputBase
              placeholder="Search blogs…"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);

                if (e.target.value.trim() === "") {
                  navigate("/blogs");
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />

            <SearchIconWrapper onClick={handleSearch}>
              <SearchIcon />
            </SearchIconWrapper>
          </Search>

          <Box sx={{ flexGrow: 1 }} />

          {/* ACTIONS */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {/* CART */}
            <IconButton color="inherit" onClick={goCart}>
              <Badge badgeContent={0} color="error">
                <ShoppingCartIcon sx={{ fontSize: 30 }} />
              </Badge>
            </IconButton>

            {/* CREATE BLOG */}
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCreateBlog}
            >
              Add New Blog
            </Button>

            {/* AUTH BUTTONS */}
            {isLoggedIn ? (
              <Button variant="contained" color="error" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Button variant="outlined" color="inherit" onClick={goLogin}>
                  Login
                </Button>

                <Button variant="contained" color="success" onClick={goSignup}>
                  Signup
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
