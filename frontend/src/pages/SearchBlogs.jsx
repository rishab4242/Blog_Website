import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Navbar from "../components/Navbar";
import BlogCard from "../components/BlogCard";
import toast from "react-hot-toast";
import NoBlogsFound from "../components/NoBlogsFound";


function SearchBlogs({ setCartItems }) {
  const { query } = useParams();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchSearch = async () => {
      const token = localStorage.getItem("token");
      try {
        let res = await axios.get(
          `${import.meta.env.VITE_API_URL}/blogs/search?title=${query}`,
          {
            headers: {
              Authorization: token,
            },
          },
        );

        setBlogs(res.data || []);
      } catch (err) {
        console.log(err);
        setBlogs([]);
      }
    };

    fetchSearch();
  }, [query]);

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

  return (
    <>
      <>
        {Array.isArray(blogs) && blogs.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 300px))",
              gap: "30px",
              margin: "35px",
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
          <NoBlogsFound />
        )}
      </>
    </>
  );
}

export default SearchBlogs;
