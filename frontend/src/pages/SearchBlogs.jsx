import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Navbar from "../components/Navbar";

function SearchBlogs() {
  const { query } = useParams();
  const [blog, setBlog] = useState({});

  useEffect(() => {
    const fetchSearch = async () => {
      const token = localStorage.getItem("token");
      try {
        let res = await axios.get(
          `http://localhost:8080/blogs/search?title=${query}`,
          {
            headers: {
              Authorization: token,
            },
          },
        );

        if (res.data && res.data.id) {
          setBlog(res.data);
        } else {
          setBlog(null);
        }
      } catch (err) {
        console.log(err);
        setBlog(null);
      }
    };

    fetchSearch();
  }, [query]);

  return (
    <>
      {blog && blog.id ? (
        <Card sx={{ maxWidth: 345, m: 2, borderRadius: 3, boxShadow: 3 }}>
          <Link to={`/blogs/${blog.id}/view`}>
            <CardMedia
              component="img"
              height="200"
              image={`${blog.image}`}
              alt={blog.title}
            />
          </Link>

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
        </Card>
      ) : (
        <p>No blog found</p>
      )}
    </>
  );
}

export default SearchBlogs;
