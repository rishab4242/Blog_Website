import { useState, useEffect } from "react";
import axios from "axios";
import BlogCard from "../components/BlogCard";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { isTokenExpired } from "../utils/auth.js";

function AllBlogs({ setCartItems }) {
  let [blogs, setBlogs] = useState([]);

  const navigate = useNavigate();

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
        <p className="text-red-500 text-center relative top-70 ">No Blog Found!!</p>
      )}
    </>
  );
}

export default AllBlogs;
