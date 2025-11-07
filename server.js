import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import profileRoutes from "./routes/profileRoutes.js";

dotenv.config();

const app = express();

// ✅ Enable CORS
app.use(cors());

// ✅ Parse JSON and URL-encoded data (increased limits for base64 images)
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// ✅ Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/gateseva";
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

connectDB();

// ✅ Routes
app.use("/api/profile", profileRoutes);

// ✅ Default test route
app.get("/", (req, res) => {
  res.send("GatiSeva API is running...");
});

// ✅ Health check route
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is healthy" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
