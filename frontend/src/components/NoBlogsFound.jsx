import React from "react";
import { Link } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import SearchOffIcon from "@mui/icons-material/SearchOff";

function NoBlogsFound() {
  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: 2,
      }}
    >
      {/* ICON */}
      <SearchOffIcon
        sx={{
          fontSize: { xs: 80, md: 120 },
          color: "gray",
          mb: 2,
        }}
      />

      {/* TITLE */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          mb: 1,
          fontSize: { xs: "28px", md: "40px" },
        }}
      >
        No Blogs Found
      </Typography>

      {/* DESCRIPTION */}
      <Typography
        variant="body1"
        sx={{
          color: "text.secondary",
          maxWidth: "500px",
          mb: 4,
          fontSize: { xs: "15px", md: "18px" },
        }}
      >
        We couldn&apos;t find any blogs matching your search. Try searching with
        another keyword.
      </Typography>

      {/* BUTTON */}
      <Button component={Link} to="/blogs" variant="contained" size="large">
        Back To Blogs
      </Button>
    </Box>
  );
}

export default NoBlogsFound;
