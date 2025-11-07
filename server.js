import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

// Get directory name (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer config for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// In-memory user profile
let userProfile = {
  fullname: "",
  contact: "",
  email: "",
  image: "",
};

// ---------------- ROUTES ----------------

// ✅ GET profile
app.get("/api/profile", (req, res) => {
  res.json(userProfile);
});

// ✅ PUT profile (edit + image upload)
app.put("/api/profile", upload.single("image"), (req, res) => {
  const { fullname, contact, email } = req.body;

  if (fullname) userProfile.fullname = fullname;
  if (contact) userProfile.contact = contact;
  if (email) userProfile.email = email;
  if (req.file) {
    userProfile.image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  }

  res.json({ message: "Profile updated successfully", profile: userProfile });
});

// ✅ Default route
app.get("/", (req, res) => {
  res.send("User Profile API is running 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
