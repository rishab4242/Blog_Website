import { useState, useEffect } from "react";
import axios from "axios";
import BlogCard from "../components/BlogCard";
import { useNavigate } from "react-router-dom";

function AllBlogs({ setCartItems }) {
  let [blogs, setBlogs] = useState([]);

  const navigate = useNavigate();

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
        if (!token) {
          navigate("/blogs/login");
        }
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
          </div>
        ))}
      </div>
    </>
  );
}

export default AllBlogs;
