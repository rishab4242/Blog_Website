import { useState, useEffect } from "react";
import axios from "axios";
import BlogCard from "../components/BlogCard";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { isTokenExpired } from "../utils/auth.js";
import { Paper, Typography, Button, Box } from "@mui/material";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import NotFound from "../components/NotFound.jsx";

function AllBlogs({ setCartItems }) {
  let [blogs, setBlogs] = useState([]);

  const navigate = useNavigate();

  const { id } = useParams();

  const addToCart = (blog) => {
    setCartItems((prev) => [...prev, blog]);

    toast.success("Added to cart 🛒", {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };

  useEffect(() => {
    const fetchAllBlogs = async () => {
      const token = localStorage.getItem("token");

      if (!token || isTokenExpired(token)) {
        localStorage.removeItem("token");
        navigate("/blogs/login");
        return;
      }

      if (!token) {
        navigate("/blogs/login");
        return;
      }

      try {
        const res = await axios.get("http://localhost:8080/blogs/", {
          headers: {
            Authorization: token,
          },
        });

        setBlogs(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllBlogs();
  }, [navigate]);

  return (
    <>
      {blogs.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 300px))",
            gap: "30px",
            margin: "30px",
            justifyContent: "center",
          }}
        >
          {blogs.map((blog) => (
            <div key={blog.id}>
              <BlogCard blog={blog} addToCart={addToCart} />
            </div>
          ))}
        </div>
      ) : (
        <Box
          sx={{
            height: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 5,
              textAlign: "center",
              maxWidth: 300,
              borderRadius: 3,
            }}
          >
            {/* Icon */}
            <ArticleOutlinedIcon
              sx={{ fontSize: 70, color: "#9e9e9e", mb: 1 }}
            />

            {/* Title */}
            <Typography variant="h6" gutterBottom>
              No Blogs Found
            </Typography>

            {/* Subtitle */}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start creating your first blog and it will appear here.
            </Typography>

            {/* Button */}
            <Button
              variant="contained"
              onClick={() => navigate("/blogs/create")}
              sx={{ textTransform: "none" }}
            >
              Create Blog
            </Button>
          </Paper>
        </Box>
      )}
    </>
  );
}

export default AllBlogs;
