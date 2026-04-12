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

const BlogCard = ({ blog, addToCart }) => {
  return (
    <Card
      sx={{
        maxWidth: 320,
        m: 2,
        borderRadius: 3,
        boxShadow: 4,
        transition: "0.3s",
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: 8,
        },
      }}
    >
      {/* Image */}
      <CardMedia
        component="img"
        height="200"
        image={`http://localhost:8080/uploads/${blog.image}`}
        alt={blog.title}
      />

      {/* Content */}
      <CardContent>
        <Typography gutterBottom variant="h6" fontWeight="bold">
          {blog.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ height: 40, overflow: "hidden" }}
        >
          {blog.content}
        </Typography>

        {/* Rating */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
          <Rating value={blog.rating || 4} precision={0.5} readOnly />
          <Typography variant="caption">(120)</Typography>
        </Stack>

        {/* Price */}
        <Typography
          variant="h6"
          color="primary"
          sx={{ mt: 1, fontWeight: "bold" }}
        >
          ₹ {blog.price}
        </Typography>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
        <Button
          variant="contained"
          startIcon={<ShoppingCartIcon />}
          onClick={() => addToCart(blog)}
        >
          Add to Cart
        </Button>

        <IconButton color="error">
          <FavoriteBorderIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default BlogCard;
