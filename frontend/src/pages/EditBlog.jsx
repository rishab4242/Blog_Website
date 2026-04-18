import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Card,
  CardMedia,
} from "@mui/material";

import toast from "react-hot-toast";
import { isTokenExpired } from "../utils/auth.js";


function EditBlog() {
  const [editblog, setEditblog] = useState({
    title: "",
    price: "",
    content: "",
    description: "",
  });

  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  const { id } = useParams();
  const navigate = useNavigate();

  // 🔥 FETCH BLOG
  useEffect(() => {
    const editData = async () => {
      const token = localStorage.getItem("token");

      if (!token || isTokenExpired(token)) {
        localStorage.removeItem("token");
        navigate("/blogs/login");
        return;
      }

      try {
        const res = await axios.get(`http://localhost:8080/blogs/${id}`, {
          headers: { Authorization: token },
        });

        setEditblog(res.data[0]);
      } catch (error) {
        console.log(error);
      }
    };

    if (id) editData();
  }, [id]);

  // 🔥 HANDLE INPUT
  const handleEditchange = (e) => {
    const { name, value } = e.target;

    setEditblog((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // 🔥 FILE
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setErrors((prev) => ({ ...prev, img: "" }));
  };

  // 🔥 VALIDATION
  const validate = () => {
    let temp = {};

    if (!editblog.title) temp.title = "Title is required";
    if (!editblog.price) temp.price = "Price is required";
    if (!editblog.content) temp.content = "Content is required";

    if (editblog.content?.length > 255)
      temp.content = "Content max 255 characters allowed";

    if (editblog.description?.length > 255)
      temp.description = "Description max 255 characters allowed";

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

  // 🔥 SUBMIT
  const handleEdit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!validate()) {
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
    formData.append("title", editblog.title);
    formData.append("price", editblog.price);
    formData.append("content", editblog.content);
    formData.append("description", editblog.description);

    if (file) {
      formData.append("img", file);
    }

    try {
      const res = await axios.put(
        `http://localhost:8080/blogs/${id}/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        },
      );

      // 🔥 SUCCESS TOAST
      toast.success(res.data.message || "Blog updated successfully!", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });

      // reset
      setEditblog({
        title: "",
        price: "",
        content: "",
        description: "",
      });

      setFile(null);

      navigate("/blogs");
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || "Something went wrong", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 5 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Edit Your Blog
        </Typography>

        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          onSubmit={handleEdit}
        >
          {/* Title */}
          <TextField
            label="Blog Title"
            name="title"
            value={editblog.title}
            onChange={handleEditchange}
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
          />

          {/* Current Image */}
          <Typography variant="subtitle1">Current Image</Typography>

          {editblog.image && (
            <Card sx={{ maxWidth: 250, borderRadius: 2 }}>
              <CardMedia
                component="img"
                height="180"
                image={`http://localhost:8080/uploads/${editblog.image}`}
              />
            </Card>
          )}

          {/* Upload */}
          <Button variant="outlined" component="label">
            Upload New Image
            <input
              type="file"
              hidden
              onChange={handleFileChange}
              accept="image/*"
            />
          </Button>

          {/* Price */}
          <TextField
            label="Price"
            type="number"
            name="price"
            value={editblog.price}
            onChange={handleEditchange}
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
            value={editblog.content}
            onChange={handleEditchange}
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
            value={editblog.description}
            onChange={handleEditchange}
            error={!!errors.description}
            helperText={errors.description || "Max 255 characters allowed"}
            inputProps={{ maxLength: 255 }}
            fullWidth
          />

          {/* Submit */}
          <Button type="submit" variant="contained" size="large">
            Update Blog
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default EditBlog;
