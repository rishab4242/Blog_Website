import * as React from "react";
import { Box, Rating, Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import dotenv from "dotenv";

dotenv.config();

function Ratings({ blogId, refreshRatings }) {
  const [value, setValue] = React.useState(0);
  const [desc, setDesc] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    // 🔥 VALIDATION
    if (!value) {
      toast.error("Please give rating ⭐", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }

    setLoading(true);

    try {
      let res = await axios.post(
        `${import.meta.env.VITE_API_URL}/blogs/${blogId}/rating`,
        {
          rating: value,
          description: desc,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );
      refreshRatings();
      // 🔥 SUCCESS TOAST
      toast.success(res.data.message || "Rating submitted 🎉", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });

      // reset form
      setValue(0);
      setDesc("");
    } catch (err) {
      console.log(err);

      // 🔥 SAFE ERROR HANDLING
      toast.error(err?.response?.data?.message || "Failed to submit rating", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography component="legend">Give Your Rating</Typography>

      {/* STAR RATING */}
      <Rating
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
        sx={{ color: "#FFD700", fontSize: 30 }}
      />

      {/* DESCRIPTION */}
      <TextField
        fullWidth
        multiline
        rows={2}
        placeholder="Write your review..."
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        sx={{ mt: 1 }}
        inputProps={{ maxLength: 255 }}
        helperText="Max 255 characters"
      />

      {/* SUBMIT BUTTON */}
      <Button
        variant="contained"
        size="small"
        sx={{
          mt: 1,
          textTransform: "none",
        }}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </Button>
    </Box>
  );
}

export default Ratings;
