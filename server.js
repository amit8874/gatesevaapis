import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import profileRoutes from "./routes/profileRoutes.js";

const app = express();

app.use(cors());

// ✅ Needed for JSON body parsing
app.use(bodyParser.json());

// ✅ Serve uploaded files
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use("/api/profile", profileRoutes);

// ✅ Default route
app.get("/", (req, res) => {
  res.send("GatiSeva API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
