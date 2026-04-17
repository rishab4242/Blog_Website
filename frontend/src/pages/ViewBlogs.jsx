import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Ratings from "../components/Ratings";
import { Box, Rating, Stack, Paper } from "@mui/material";

function ViewBlogs() {
  let [viewblog, setViewblog] = useState(null);
  let [ratings, setRatings] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  // FETCH BLOG
  useEffect(() => {
    const fetchViewBlog = async () => {
      const token = localStorage.getItem("token");

      try {
        let res = await axios.get(`http://localhost:8080/blogs/${id}/view`, {
          headers: { Authorization: token },
        });

        setViewblog(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchViewBlog();
  }, [id]);

  // FETCH RATINGS
  useEffect(() => {
    const fetchViewBlogRatings = async () => {
      try {
        let res = await axios.get(`http://localhost:8080/blogs/${id}/rating`);

        setRatings(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchViewBlogRatings();
  }, [id]);

  const navigateToeditpage = (id) => {
    navigate(`/blogs/${id}`);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    const confirmAction = window.confirm(
      "Are you sure you want to delete this Blog?",
    );

    if (!confirmAction) return;

    try {
      let res = await axios.delete(`http://localhost:8080/blogs/${id}/delete`, {
        headers: { Authorization: token },
      });

      alert(res.data.message);
      navigate("/blogs");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteRating = async (id) => {
    const confirmAction = window.confirm(
      "Are you sure you want to delete this Rating?",
    );

    if (!confirmAction) return;

    try {
      let res = await axios.delete(
        `http://localhost:8080/blogs/${id}/rating/delete`,
      );

      setRatings((prev) => prev.filter((rating) => rating.id !== id));

      alert(res.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {viewblog && (
        <Card sx={{ maxWidth: 345, m: 2, borderRadius: 3, boxShadow: 3 }}>
          <CardMedia
            component="img"
            sx={{ padding: "10px" }}
            height="200"
            image={`http://localhost:8080/uploads/${viewblog.image}`}
            alt={viewblog.title}
          />

          <CardContent>
            <Typography gutterBottom variant="h5">
              {viewblog.title}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {viewblog.content}
            </Typography>

            <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: "bold" }}>
              ₹ {viewblog.price}
            </Typography>
          </CardContent>

          {/* OWNER BUTTONS */}
          {viewblog.isOwner && (
            <CardActions>
              <Button
                size="small"
                variant="contained"
                color="success"
                onClick={() => navigateToeditpage(viewblog.id)}
              >
                Edit
              </Button>

              <Button
                size="small"
                variant="contained"
                color="error"
                onClick={() => handleDelete(viewblog.id)}
              >
                Delete
              </Button>
            </CardActions>
          )}

          {/* RATINGS */}
          <Ratings blogId={viewblog.id} />

          <Box sx={{ mt: 2, px: 2, pb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              User Reviews
            </Typography>

            <Stack spacing={2}>
              {ratings.map((rating) => (
                <Paper key={rating.id} elevation={2} sx={{ p: 2 }}>
                  <Rating
                    value={rating.rating}
                    readOnly
                    sx={{ color: "#FFD700", fontSize: "35px" }}
                  />

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "18px", ml: 1 }}
                  >
                    {rating.description}
                  </Typography>

                  {/* DELETE RATING (ONLY OWNER) */}
                  {viewblog.isOwner && (
                    <Button
                      sx={{
                        mt: 1,
                        ml: 1,
                        fontSize: "14px",
                        bgcolor: "black",
                        color: "white",
                        textTransform: "capitalize",
                        "&:hover": { bgcolor: "#333" },
                      }}
                      size="small"
                      onClick={() => handleDeleteRating(rating.id)}
                    >
                      Delete
                    </Button>
                  )}
                </Paper>
              ))}
            </Stack>
          </Box>
        </Card>
      )}
    </div>
  );
}

export default ViewBlogs;
