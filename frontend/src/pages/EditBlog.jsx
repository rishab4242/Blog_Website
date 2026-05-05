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
  CircularProgress,
} from "@mui/material";

import toast from "react-hot-toast";
import { isTokenExpired } from "../utils/auth.js";
import ImageUpload from "../components/ImageUpload";

function EditBlog() {
  const [editblog, setEditblog] = useState({
    title: "",
    price: "",
    content: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (editblog?.image) {
      setPreview(editblog.image);
    }
  }, [editblog.image]);

  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  const { id } = useParams();
  const navigate = useNavigate();

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

    // validate instantly
    const error = validateField(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // 🔥 FILE
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setErrors((prev) => ({ ...prev, img: "" }));
  };

  // 🔥 VALIDATION
  const validateForm = () => {
    let temp = {};

    Object.keys(editblog).forEach((key) => {
      const error = validateField(key, editblog[key] || "");
      if (error) temp[key] = error;
    });

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

  // 🔥 SUBMIT
  const handleEdit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

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
    formData.append("title", editblog.title);
    formData.append("price", editblog.price);
    formData.append("content", editblog.content);
    formData.append("description", editblog.description);

    if (file) {
      formData.append("img", file);
    }

    try {
      setLoading(true);
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
    } finally {
      setLoading(false); // 🔥 STOP LOADING (IMPORTANT)
    }
  };

  return (
    <>
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.25)", // lighter overlay
            backdropFilter: "blur(2px)", // 🔥 modern glass effect
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <CircularProgress size={60} sx={{ color: "#fff" }} />
          <Typography sx={{ mt: 2, color: "#fff" }}>
            Updating blog...
          </Typography>
        </Box>
      )}

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
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={
                loading || // 🔥 prevent re-click during API call
                !editblog.title?.trim() ||
                !editblog.price ||
                !editblog.content?.trim() ||
                Object.values(errors).some((err) => err)
              }
              sx={{
                textTransform: "none",
                position: "relative",
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  Updating...
                </Box>
              ) : (
                "Update Blog"
              )}
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default EditBlog;
