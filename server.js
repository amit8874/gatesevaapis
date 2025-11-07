import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const app = express();
app.use(cors());
app.use(express.json());

// Directory setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Serve images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// In-memory user profile
let userProfile = {
  id: randomUUID(),
  fullname: "",
  contact: "",
  email: "",
  image: "",
};

// ✅ Email and Contact Validation Regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const contactRegex = /^[0-9]{10}$/; // exactly 10 digits

// ---------------- ROUTES ----------------

// ✅ Get Profile
app.get("/api/profile", (req, res) => {
  res.json(userProfile);
});

// ✅ Update Profile
app.put("/api/profile", upload.single("image"), (req, res) => {
  const { fullname, contact, email } = req.body;

  // Validation
  if (!fullname || fullname.trim() === "") {
    return res.status(400).json({ error: "Full name is required" });
  }
  if (email && !emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  if (contact && !contactRegex.test(contact)) {
    return res.status(400).json({ error: "Invalid contact number (must be 10 digits)" });
  }

  // Update profile fields
  if (fullname) userProfile.fullname = fullname;
  if (contact) userProfile.contact = contact;
  if (email) userProfile.email = email;
  if (req.file) {
    userProfile.image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  }

  res.json({
    message: "Profile updated successfully",
    profile: userProfile,
  });
});

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("✅ User Profile API with Validation is running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
