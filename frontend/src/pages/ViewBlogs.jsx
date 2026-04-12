import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Ratings from "../components/Ratings";
import { Box, Rating, Stack, Paper, Divider } from "@mui/material";

function ViewBlogs() {
  let [viewblog, setViewblog] = useState([]);
  let [ratings, setRatings] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchViewBlog = async () => {
      const token = localStorage.getItem("token");
      try {
        let res = await axios.get(`http://localhost:8080/blogs/${id}/view`, {
          headers: {
            Authorization: token,
          },
        });
        // console.log(res.data);
        setViewblog(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchViewBlog();
  }, []);

  useEffect(() => {
    const fetchViewBlogRatings = async () => {
      try {
        let res = await axios.get(`http://localhost:8080/blogs/${id}/rating`);
        // console.log(res.data);
        setRatings(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchViewBlogRatings();
  }, []);

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
        headers: {
          Authorization: token,
        },
      });
      setViewblog((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
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
      setRatings((prevRatings) =>
        prevRatings.filter((rating) => rating.id !== id),
      );
      alert(res.data.message);
    } catch (error) {
      console.log(error);
      alert(res.data.error.message);
    }
  };

  return (
    <div
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
    >
      {viewblog.map((blog) => (
        <Card
          key={blog.id}
          sx={{ maxWidth: 345, m: 2, borderRadius: 3, boxShadow: 3 }}
        >
          <CardMedia
            component="img"
            height="200"
            image={`http://localhost:8080/uploads/${blog.image}`}
            alt={blog.title}
          />

          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {blog.title}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {blog.content}
            </Typography>

            <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: "bold" }}>
              ₹ {blog.price}
            </Typography>
          </CardContent>

          <CardActions>
            <Button
              size="small"
              variant="contained"
              color="success"
              onClick={() => navigateToeditpage(blog.id)}
            >
              Edit
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={() => handleDelete(blog.id)}
            >
              Delete
            </Button>
          </CardActions>

          <Ratings blogId={blog.id} />

          <Box sx={{ mt: 2, px: 2, pb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              User Reviews
            </Typography>

            <Stack spacing={2}>
              {ratings.map((rating) => (
                <Paper
                  key={rating.id}
                  elevation={2}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  {/* Top Section */}
                  <Box>
                    <Rating
                      value={rating.rating}
                      readOnly
                      sx={{ color: "#FFD700", fontSize: "35px" }}
                    />

                    {/* Description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "20px", marginLeft: "8px" }}
                    >
                      {rating.description}
                    </Typography>

                    <Button
                      sx={{
                        mt: 1,
                        ml: 1,
                        fontSize: "14px",
                        bgcolor: "black",
                        color: "white",
                        textTransform: "capitalize",
                        "&:hover": {
                          bgcolor: "#333", // Optional: slightly lighter black on hover
                        },
                      }}
                      size="small"
                      onClick={() => handleDeleteRating(rating.id)}
                    >
                      Delete
                    </Button>
                  </Box>

                  {/* <Divider sx={{ my: 1 }} /> */}
                </Paper>
              ))}
            </Stack>
          </Box>
        </Card>
      ))}
    </div>
  );
}

export default ViewBlogs;
