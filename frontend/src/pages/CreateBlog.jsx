import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ImageUpload from "../components/ImageUpload";

function CreateBlog() {
  const [blogs, setBlogs] = useState({
    title: "",
    price: "",
    content: "",
    description: "",
  });
  const [preview, setPreview] = useState(null);

  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  // 🔥 basic validation errors state
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = "";

    if (name === "title") {
      if (!value.trim()) error = "Title is required";
    }

    if (name === "price") {
      if (!value) error = "Price is required";
    }

    if (name === "content") {
      if (!value.trim()) error = "Content is required";
      else if (value.length > 255) error = "Content max 255 characters allowed";
    }

    if (name === "description") {
      if (value.length > 255) error = "Description max 255 characters allowed";
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // update state
    setBlogs((prev) => ({
      ...prev,
      [name]: value,
    }));

    // live validation clear
    const error = validateField(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setErrors((prev) => ({ ...prev, img: "" }));
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile); // ✅ actual file
      setPreview(URL.createObjectURL(selectedFile)); // preview
    }
  };

  // 🔥 FRONTEND VALIDATION (IMPORTANT)
  const validateForm = () => {
    let temp = {};

    Object.keys(blogs).forEach((key) => {
      const error = validateField(key, blogs[key] || "");
      if (error) temp[key] = error;
    });

    if (!file) {
      temp.img = "Image is required";
    }

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/blogs/login");
      return;
    }

    // 🔥 STOP if validation fails
    if (!validateForm()) {
      toast.error("Please fix errors in form", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", blogs.title);
    formData.append("price", blogs.price);
    formData.append("content", blogs.content);
    formData.append("description", blogs.description);
    formData.append("img", file);

    try {
      const res = await axios.post(
        "http://localhost:8080/blogs/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        },
      );

      // 🔥 SUCCESS TOAST (no alert anymore)
      toast.success("Blog created successfully 🎉", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });

      // reset
      setBlogs({
        title: "",
        price: "",
        content: "",
        description: "",
      });
      setFile(null);

      navigate("/blogs");
    } catch (error) {
      console.log(error);

      // 🔥 CLEAN ERROR MESSAGE
      toast.error(error?.response?.data?.message || "Something went wrong", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/blogs/login");
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 5 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Create New Blog
        </Typography>

        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          onSubmit={handleSubmit}
        >
          {/* Title */}
          <TextField
            label="Blog Title"
            name="title"
            value={blogs.title}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
          />

          {/* Image */}
          <ImageUpload
            file={file}
            setFile={setFile}
            preview={preview}
            setPreview={setPreview}
          />

          {/* Price */}
          <TextField
            label="Price"
            type="number"
            name="price"
            value={blogs.price}
            onChange={handleChange}
            error={!!errors.price}
            helperText={errors.price}
            fullWidth
          />

          {/* Content */}
          <TextField
            label="Content"
            multiline
            rows={4}
            name="content"
            value={blogs.content}
            onChange={handleChange}
            error={!!errors.content}
            helperText={errors.content || "Max 255 characters allowed"}
            inputProps={{ maxLength: 255 }}
            fullWidth
          />

          {/* Description */}
          <TextField
            label="Description"
            multiline
            rows={3}
            name="description"
            value={blogs.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description || "Max 255 characters allowed"}
            inputProps={{ maxLength: 255 }}
            fullWidth
          />

          {/* Submit */}
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{ textTransform: "none" }}
          >
            Submit Blog
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default CreateBlog;
