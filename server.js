import express from "express";
import dotenv from "dotenv";
import fileRoutes from "./routes/file.routes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/files", fileRoutes);

app.get("/", (req, res) => {
  res.send("GridFS File Upload API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
