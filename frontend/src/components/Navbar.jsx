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
  pointerEvents: "auto",
  cursor: "pointer",
  zIndex: 1,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  // paddingRight: theme.spacing(6),
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 2),
  },
}));



export default function Navbar() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const navigate = useNavigate();

  const NavigatetoCreateblog = () => {
    navigate("/blogs/create");
  };

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      navigate("/blogs");
    } else {
      navigate(`/blogs/search/${searchTerm}`);
    }
  };

  const OpenSignupform = () => {
    navigate("/blogs/signup");
  };

  const OpenLoginform = () => {
    navigate("/blogs/login");
  };

  const isLoggedIn = !!localStorage.getItem("token");

  const handleClick = () => {
    if (!isLoggedIn) {
      alert("Please Signup First");
      navigate("/blogs/signup");
    } else {
      navigate("/blogs/create");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("You Logout Successfully!");
    navigate("/blogs/login");
  };

  const goToCart = () => {
  navigate("/blogs/add_to_cart");
};

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ fontWeight: "bold", cursor: "pointer" }}
          >
            <Link to="/blogs">My Blog</Link>
          </Typography>

          {/* Search Bar */}
          <Search>
            <StyledInputBase
              placeholder="Search blogs…"
              inputProps={{ "aria-label": "search" }}
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerm(value);

                if (value.trim() === "") {
                  navigate("/blogs");
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />

            <SearchIconWrapper onClick={handleSearch}>
              <SearchIcon />
            </SearchIconWrapper>
          </Search>

          <Box sx={{ flexGrow: 1 }} />

          {/* Buttons */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {/* Cart */}
            <IconButton color="inherit" onClick={goToCart}>
              <Badge badgeContent={0} color="error">
                <ShoppingCartIcon sx={{ fontSize: 32 }} />
              </Badge>
            </IconButton>

            {isLoggedIn ? (
              <>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleClick}
                >
                  Add New Blog
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleClick}
                >
                  Add New Blog
                </Button>

                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={OpenLoginform}
                >
                  Login
                </Button>

                <Button
                  variant="contained"
                  color="success"
                  onClick={OpenSignupform}
                >
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
