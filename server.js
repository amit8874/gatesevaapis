import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import profileRoutes from "./routes/profileRoutes.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());

// ✅ Routes
app.use("/api/profile", profileRoutes);

// ✅ Default route
app.get("/", (req, res) => {
  res.send("GatiSeva API is running...");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
