import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { Link, Links } from "react-router-dom";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import StarIcon from "@mui/icons-material/Star";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useState } from "react";

const BlogCard = ({ blog, addToCart }) => {
  const [expanded, setExpanded] = useState(false);

  const limit = 21;
  const isLong = blog.content.length > limit;

  const displayText = expanded ? blog.content : blog.content.slice(0, limit);

  return (
    <Card
      sx={{
        width: 320,
        maxWidth: "300px",
        borderRadius: 3,
        boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
        transition: "0.3s",
        overflow: "hidden",
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: 8,
        },
        bgcolor: "#fff",
      }}
    >
      <Link to={`/blogs/${blog.id}/view`}>
        <CardMedia
          component="img"
          image={`http://localhost:8080/${blog.image}`}
          alt={blog.title}
          sx={{ height: 160, objectFit: "cover", padding: "15px" }}
        />
      </Link>

      {/* Content */}
      <CardContent sx={{ pb: 0, pt: 1.5, px: 2, flexGrow: 1 }}>
        {/* Title + Rating Row */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ fontSize: "1.1rem" }}
          >
            {blog.title}
          </Typography>

          {blog.average_rating ? (
            <Chip
              icon={
                <StarIcon
                  sx={{ fontSize: "0.95rem", color: "#fff !important" }}
                />
              }
              label={blog.average_rating}
              size="small"
              sx={{
                bgcolor: "#4caf50",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "0.82rem",
                height: 26,
                borderRadius: "6px",
                "& .MuiChip-icon": { color: "#fff" },
              }}
            />
          ) : null}
        </Stack>

        {/* Cuisine tags + Price Row */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mt: 0.5 }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: "0.8rem" }}
          >
            {displayText}

            {isLong && (
              <span
                onClick={() => setExpanded(!expanded)}
                style={{
                  color: "#ff6b6b",
                  cursor: "pointer",
                  fontWeight: "bold",
                  marginLeft: "4px",
                }}
              >
                {expanded ? " Show Less" : "...Read More"}
              </span>
            )}
          </Typography>

          <Typography
            variant="body1"
            fontWeight="bold"
            sx={{
              color: "#222",
              fontSize: "0.95rem",
              whiteSpace: "nowrap",
              ml: 1,
            }}
          >
            ₹ {blog.price}
          </Typography>
        </Stack>
      </CardContent>

      {/* Actions */}
      <CardActions
        sx={{
          px: 1,
          pb: 2,
          pt: 1.5,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left: trending icon */}
        <IconButton
          size="small"
          sx={{
            color: "#7c6af7",
            bgcolor: "#ede9fe",
            borderRadius: "50%",
            p: 0.8,
          }}
        >
          <TrendingUpIcon fontSize="small" />
        </IconButton>

        {/* Center: Add to Cart button */}
        <Button
          variant="contained"
          onClick={() => addToCart(blog)}
          sx={{
            width: "130px",
            mx: 1.5,
            borderRadius: "24px",
            bgcolor: "#ff6b6b",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "0.95rem",
            textTransform: "none",
            boxShadow: "none",
            py: 0.9,
            "&:hover": { bgcolor: "#e55a5a", boxShadow: "none" },
          }}
        >
          Add TO Cart
        </Button>

        {/* Right: Max Safety Delivery badge */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "#f5f5f5",
            borderRadius: "8px",
            px: 0.8,
            py: 0.4,
            border: "1px solid #e0e0e0",
            minWidth: 54,
          }}
        >
          <LocalShippingOutlinedIcon
            sx={{ fontSize: "1rem", color: "#4caf50" }}
          />
          <Typography
            sx={{
              fontSize: "0.45rem",
              color: "#4caf50",
              fontWeight: "bold",
              lineHeight: 1.2,
              textAlign: "center",
              textTransform: "uppercase",
            }}
          >
            Max Safety
            <br />
            Delivery
          </Typography>
        </Box>
      </CardActions>
    </Card>
  );
};

export default BlogCard;
