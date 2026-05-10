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
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import toast from "react-hot-toast";
import CloseIcon from "@mui/icons-material/Close";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: "100%",
  maxWidth: "400px",

  [theme.breakpoints.down("md")]: {
    maxWidth: "100%",
    marginTop: theme.spacing(1),
  },
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
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");

  // 🔥 SEARCH
  const handleSearch = () => {
    setMobileOpen(false); // 🔥 CLOSE DRAWER FIRST
    if (!isLoggedIn) {
      toast.error("Please login first 🔐", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      setSearchTerm("");

      navigate("/blogs/login");
      return;
    }

    setTimeout(() => {
      if (searchTerm.trim() === "") {
        navigate("/blogs");
        return;
      }

      setSearchTerm("");

      navigate(`/blogs/search/${searchTerm}`);
    }, 200);
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

  const toggleDrawer = (open) => () => {
    setMobileOpen(open);
  };

  const mobileMenu = (
    <Box
      sx={{
        width: 280,
        height: "100%",
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        backgroundColor: "#1976d2",
        color: "white",
      }}
      role="presentation"
    >
      {/* TOP BAR */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* LOGO */}
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          <Link
            to="/blogs"
            style={{ textDecoration: "none", color: "inherit" }}
            onClick={() => setMobileOpen(false)}
          >
            My Blog
          </Link>
        </Typography>

        {/* CLOSE BUTTON */}
        <IconButton color="inherit" onClick={() => setMobileOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ backgroundColor: "rgba(255,255,255,0.3)" }} />

      {/* SEARCH */}
      <Search sx={{ margin: 0, maxWidth: "100%" }}>
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
            if (e.key === "Enter") {
              setTimeout(() => {
                handleSearch();
              }, 100);
            }
          }}
        />

        <SearchIconWrapper
          onClick={() => {
            setTimeout(() => {
              handleSearch();
            }, 100);
          }}
        >
          <SearchIcon />
        </SearchIconWrapper>
      </Search>

      {/* CART */}
      <Button
        variant="outlined"
        color="inherit"
        startIcon={
          <Badge badgeContent={0} color="error">
            <ShoppingCartIcon />
          </Badge>
        }
        onClick={() => {
          goCart();
          setMobileOpen(false);
        }}
        fullWidth
        sx={{
          borderColor: "white",
          color: "white",
        }}
      >
        Cart
      </Button>

      {/* CREATE BLOG */}
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          handleCreateBlog();
          setMobileOpen(false);
        }}
        fullWidth
      >
        Add New Blog
      </Button>

      {/* AUTH BUTTONS */}
      {isLoggedIn ? (
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            handleLogout();
            setMobileOpen(false);
          }}
          fullWidth
        >
          Logout
        </Button>
      ) : (
        <>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => {
              goLogin();
              setMobileOpen(false);
            }}
            fullWidth
            sx={{
              borderColor: "white",
              color: "white",
            }}
          >
            Login
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={() => {
              goSignup();
              setMobileOpen(false);
            }}
            fullWidth
          >
            Signup
          </Button>
        </>
      )}
    </Box>
  );
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: { xs: "nowrap", md: "nowrap" },
            px: { xs: 1, md: 2 },
          }}
        >
          {/* LEFT SECTION */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flex: 1,
              minWidth: 0,
            }}
          >
            {/* LOGO */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              <Link
                to="/blogs"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                ɌĐ
              </Link>
            </Typography>

            {/* MOBILE MENU BUTTON */}
            <IconButton
              color="inherit"
              sx={{
                display: { xs: "flex", md: "none" },
                ml: "auto",
              }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>

            {/* SEARCH DESKTOP/TABLET */}
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                flex: 1,
                maxWidth: "400px",
              }}
            >
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
            </Box>
          </Box>

          {/* DESKTOP ACTIONS */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 2,
              alignItems: "center",
            }}
          >
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

      {/* MOBILE DRAWER */}
      <Drawer anchor="left" open={mobileOpen} onClose={toggleDrawer(false)}>
        {mobileMenu}
      </Drawer>
    </Box>
  );
}
