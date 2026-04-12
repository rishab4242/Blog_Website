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

function CreateBlog() {
  const [blogs, setBlogs] = useState({
    title: "",
    price: "",
    content: "",
    description: "",
  });

  const navigate = useNavigate();

  const [file, setFile] = useState(null); // separate state for file

  const handleChange = (e) => {
    setBlogs((currBlogs) => ({
      ...currBlogs,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // save file object
  };

  const handleSubmit = async (e) => {
    const token = localStorage.getItem("token");
    e.preventDefault();

    if (!file) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("title", blogs.title);
    formData.append("price", blogs.price);
    formData.append("content", blogs.content);
    formData.append("description", blogs.description);
    formData.append("img", file); // must match Multer field name

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

      alert(res.data); // success message

      // Reset form
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
      alert("Something went wrong");
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
          {/* Blog Title */}
          <TextField
            label="Blog Title"
            name="title"
            value={blogs.title}
            onChange={handleChange}
            fullWidth
            required
          />

          {/* Image Upload */}
          <Button variant="outlined" component="label">
            Upload Image
            <input type="file" name="img" onChange={handleFileChange} hidden />
          </Button>

          {/* Price */}
          <TextField
            label="Price"
            type="number"
            name="price"
            value={blogs.price}
            onChange={handleChange}
            fullWidth
            required
          />

          {/* Content */}
          <TextField
            label="Content"
            multiline
            rows={4}
            name="content"
            value={blogs.content}
            onChange={handleChange}
            fullWidth
            required
          />

          {/* Description */}
          <TextField
            label="Description"
            multiline
            rows={3}
            name="description"
            value={blogs.description}
            onChange={handleChange}
            fullWidth
          />

          {/* Submit */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            Submit Blog
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default CreateBlog;
