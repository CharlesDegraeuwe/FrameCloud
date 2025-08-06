const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());

const baseDir = path.join(__dirname, "clientdata");

// Helper om bestanden en mappen in een map te lezen
function readFiles(dirPath) {
  const fullPath = path.join(baseDir, dirPath);
  const items = fs.readdirSync(fullPath, { withFileTypes: true });

  return items.map((item) => {
    const itemPath = path.join(dirPath, item.name);
    const stats = fs.statSync(path.join(baseDir, itemPath));

    return {
      name: item.name,
      size: stats.size,
      type: item.isDirectory() ? "folder" : getMimeType(item.name),
      modified: stats.mtime,
      path: itemPath.replace(/\\/g, "/"),
    };
  });
}

// Eenvoudige mime type detectie op basis van extensie
function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".heic":
      return "image/heic";
    case ".mp4":
      return "video/mp4";
    case ".mov":
      return "video/quicktime";
    case ".pdf":
      return "application/pdf";
    case ".zip":
      return "application/zip";
    default:
      return "application/octet-stream";
  }
}

// betandlezer
app.get("/api/files", (req, res) => {
  const client = req.query.client;
  if (!client) {
    return res.status(400).json({ error: "client parameter is required" });
  }

  try {
    const files = readFiles(client);
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: "Error reading files: " + err.message });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
