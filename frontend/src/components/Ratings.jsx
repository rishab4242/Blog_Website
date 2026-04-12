import * as React from "react";
import { Box, Rating, Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Ratings({ blogId }) {
  const [value, setValue] = React.useState(0);
  const [desc, setDesc] = React.useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      let res = await axios.post(
        `http://localhost:8080/blogs/${blogId}/rating`,
        {
          rating: value,
          description: desc,
        },
      );

      alert(res.data.message);
      setValue(0);
      setDesc("");
      navigate("/blogs");
    } catch (err) {
      console.log(err);
      alert(res.data.error.message);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography component="legend">Give Your Rating</Typography>

      <Rating
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
        sx={{ color: "#FFD700", fontSize: 30 }}
      />

      <TextField
        fullWidth
        multiline
        rows={2}
        placeholder="Write your review..."
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        sx={{ mt: 1 }}
      />

      <Button
        variant="contained"
        size="small"
        sx={{ mt: 1 }}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </Box>
  );
}

export default Ratings;
