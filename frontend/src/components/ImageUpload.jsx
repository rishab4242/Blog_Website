import { useDropzone } from "react-dropzone";
import { Box, Typography, Button } from "@mui/material";

const ImageUpload = ({ file, setFile, preview, setPreview, error,setErrors, }) => {
  const onDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];

    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  const removeImage = (e) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  return (
    <Box>
      <Box
        {...getRootProps()}
        sx={{
          border: "1px solid #ccc",
          borderRadius: 2,
          height: 60,
          position: "relative",
          overflow: "hidden",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "&:hover": { borderColor: "#1976d2" },
        }}
      >
        <input {...getInputProps()} />

        {/* No image */}
        {!preview && (
          <Typography variant="body2" color="text.secondary">
            {isDragActive
              ? "Drop image here..."
              : "Drag & drop or click to upload"}
          </Typography>
        )}

        {/* Existing or new image preview */}
        {preview && (
          <img
            src={preview}
            alt="preview"
            style={{
              width: "80%",
              height: "80%",
              objectFit: "contain",
            }}
          />
        )}

        {/* Hover overlay */}
        {preview && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              opacity: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              color: "#fff",
              transition: "0.2s",
              "&:hover": { opacity: 1 },
            }}
          >
            <Typography variant="body2">
              {file?.name || "Current Image"}
            </Typography>

            <Button
              size="small"
              color="error"
              variant="contained"
              onClick={removeImage}
            >
              Remove
            </Button>
          </Box>
        )}
      </Box>
      {error && (
        <Typography
          variant="caption"
          sx={{ color: "red", mt: 1, display: "block" }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default ImageUpload;
