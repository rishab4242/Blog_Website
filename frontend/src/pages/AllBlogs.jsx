import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import BlogCard from "../components/BlogCard";
import { Link } from "react-router-dom";

function AllBlogs({ setCartItems }) {
  let [blogs, setBlogs] = useState([]);

  const addToCart = (blog) => {
    setCartItems((prev) => [...prev, blog]);
  };

  useEffect(() => {
    const fetchAllBlogs = async () => {
      const token = localStorage.getItem("token");
      try {
        let res = await axios.get("http://localhost:8080/blogs/", {
          headers: {
            Authorization: token,
          },
        });
        setBlogs(res.data);
        // console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllBlogs();
  }, []);

  return (
    <>
      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {blogs.map((blog) => (
          <div key={blog.id}>
            <BlogCard blog={blog} addToCart={addToCart} />

            <Link to={`/blogs/${blog.id}/view`}>View Blog</Link>
          </div>
        ))}
      </div>
    </>
  );
}

export default AllBlogs;
