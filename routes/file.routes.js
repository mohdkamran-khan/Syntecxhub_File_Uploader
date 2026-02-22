import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import { GridFSBucket, ObjectId } from "mongodb";

const router = express.Router();

/* === MongoDB Connection === */

const mongoURI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/file_upload_db";

  mongoose.connect(mongoURI);

const conn = mongoose.connection;

let bucket;

conn.once("open", () => {
  bucket = new GridFSBucket(conn.db, {
    bucketName: "uploads",
  });
  console.log("MongoDB connected & GridFSBucket initialized");
});

/* === Multer Configuration === */

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file.mimetype) {
    return cb(new Error("Invalid file type"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});

/* === Upload File === */

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    if (!bucket) {
      return res
        .status(500)
        .json({ success: false, message: "GridFS not initialized" });
    }

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on("error", (err) => {
      return res.status(500).json({ success: false, message: err.message });
    });

    uploadStream.on("finish", () => {
      return res.status(201).json({
        success: true,
        message: "File uploaded successfully",
        fileId: uploadStream.id,
        filename: uploadStream.filename,
      });
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/* === Get File Metadata === */

router.get("/file/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid file ID" });
    }

    const file = await conn.db
      .collection("uploads.files")
      .findOne({ _id: new ObjectId(id) });

    if (!file) {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }

    return res.status(200).json({ success: true, file });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/* === Stream File === */

router.get("/file/stream/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid file ID",
      });
    }

    const file = await conn.db
      .collection("uploads.files")
      .findOne({ _id: new ObjectId(id) });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    const downloadStream = bucket.openDownloadStream(new ObjectId(id));

    // Set headers BEFORE piping
    res.writeHead(200, {
      "Content-Type": file.contentType || "application/octet-stream",
      "Content-Length": file.length,
      "Content-Disposition": `inline; filename="${file.filename}"`,
    });

    downloadStream.pipe(res);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* === Delete File === */

router.delete("/file/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid file ID" });
    }

    await bucket.delete(new ObjectId(id));

    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
