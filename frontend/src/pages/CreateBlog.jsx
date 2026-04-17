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

function CreateBlog() {
  const [blogs, setBlogs] = useState({
    title: "",
    price: "",
    content: "",
    description: "",
  });

  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  // 🔥 basic validation errors state
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    // update state
    setBlogs((prev) => ({
      ...prev,
      [name]: value,
    }));

    // live validation clear
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setErrors((prev) => ({ ...prev, img: "" }));
  };

  // 🔥 FRONTEND VALIDATION (IMPORTANT)
  const validate = () => {
    let tempErrors = {};

    if (!blogs.title) tempErrors.title = "Title is required";
    if (!blogs.price) tempErrors.price = "Price is required";
    if (!blogs.content) tempErrors.content = "Content is required";
    if (blogs.content.length > 255)
      tempErrors.content = "Content max 255 characters allowed";

    if (blogs.description.length > 255)
      tempErrors.description = "Description max 255 characters allowed";

    if (!file) tempErrors.img = "Image is required";

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/blogs/login");
      return;
    }

    // 🔥 STOP if validation fails
    if (!validate()) {
      toast.error("Please fix form errors", {
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
          <Button variant="outlined" component="label">
            Upload Image
            <input
              type="file"
              name="img"
              onChange={handleFileChange}
              hidden
              accept="image/*"
            />
          </Button>

          {errors.img && (
            <Typography color="error" fontSize="0.8rem">
              {errors.img}
            </Typography>
          )}

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
