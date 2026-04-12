import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function EditBlog() {
  const [editblog, setEditblog] = useState({
    title: "",
    price: "",
    content: "",
    description: "",
  });
  const { id } = useParams();

  const navigate = useNavigate();

  const [file, setFile] = useState(null);

  useEffect(() => {
    const editData = async () => {
      const token = localStorage.getItem("token");
      try {
        let res = await axios.get(`http://localhost:8080/blogs/${id}`, {
          headers: {
            Authorization: token,
          },
        });
        setEditblog(res.data[0]);
      } catch (error) {
        console.log(error);
      }
    };
    if (id) {
      editData();
    }
  }, [id]);

  const handleEditchange = (e) => {
    setEditblog((curreditblog) => {
      return { ...curreditblog, [e.target.name]: e.target.value };
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // save file object
  };

  const handleEdit = async (e) => {
    const token = localStorage.getItem("token");
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", editblog.title);
    formData.append("price", editblog.price);
    formData.append("content", editblog.content);
    formData.append("description", editblog.description);
    formData.append("img", file); // must match Multer field name

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

      alert(res.data.message); // success message

      // Reset form
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
      alert("Something went wrong");
    }
  };

  return (
    <>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 4, marginTop: 5 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Edit Youre Blog
          </Typography>

          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            onSubmit={handleEdit}
          >
            {/* Blog Title */}
            <TextField
              label="Blog Title"
              name="title"
              value={editblog.title}
              onChange={handleEditchange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />

            <Typography variant="h5" align="left">
              Original Blog Image
            </Typography>
            <Card sx={{ maxWidth: 250, m: 0.1, borderRadius: 2, boxShadow: 3 }}>
              <CardMedia
                component="img"
                height="200"
                image={`http://localhost:8080/uploads/${editblog.image}`}
                alt={editblog.title}
              />
            </Card>

            {/* Image Upload */}
            <Button variant="outlined" component="label">
              Upload Image
              <input
                type="file"
                name="existingImage"
                onChange={handleFileChange}
                hidden
              />
            </Button>

            {/* Price */}
            <TextField
              label="Price"
              type="number"
              name="price"
              value={editblog.price}
              fullWidth
              required
              onChange={handleEditchange}
              InputLabelProps={{ shrink: true }}
            />

            {/* Content */}
            <TextField
              label="Content"
              multiline
              rows={4}
              name="content"
              value={editblog.content}
              fullWidth
              required
              onChange={handleEditchange}
              InputLabelProps={{ shrink: true }}
            />

            {/* Description */}
            <TextField
              label="Description"
              multiline
              rows={3}
              name="description"
              onChange={handleEditchange}
              value={editblog.description}
              fullWidth
              InputLabelProps={{ shrink: true }}
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
    </>
  );
}

export default EditBlog;
