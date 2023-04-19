const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { Readable } = require("stream");

// configure multer to handle file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// app.get("/", (req, res) => {
//   res.status("hello from backend");
// });

// upload a video file
app.post("/upload", upload.single("video"), (req, res) => {
  res.status(200).json({ message: "File uploaded successfully." });
});

// stream a video file
app.get("/stream/:filename", (req, res) => {
  const filepath = path.join(__dirname, "uploads", req.params.filename);

  if (!fs.existsSync(filepath)) {
    res.status(404).json({ message: "File not found." });
    return;
  }

  const videoStream = fs.createReadStream(filepath);

  // set content type headers
  res.setHeader("Content-Type", "video/mp4");

  // stream video to client
  videoStream.pipe(res);
});

// download a video file
app.get("/download/:filename", (req, res) => {
  const filepath = path.join(__dirname, "uploads", req.params.filename);

  if (!fs.existsSync(filepath)) {
    res.status(404).json({ message: "File not found." });
    return;
  }

  const videoStream = fs.createReadStream(filepath);

  // set content disposition header to force download
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${req.params.filename}"`
  );

  // stream video to client
  videoStream.pipe(res);
});

// start server
app.listen(5000, () => {
  console.log("Server started on port 5000");
});
