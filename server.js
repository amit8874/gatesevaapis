import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import profileRoutes from "./routes/profileRoutes.js";

const app = express();

// ✅ Enable CORS
app.use(cors());

// ✅ Parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Serve uploaded files (to access via browser or frontend)
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use("/api/profile", profileRoutes);

// ✅ Default test route
app.get("/", (req, res) => {
  res.send("GatiSeva API is running...");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
