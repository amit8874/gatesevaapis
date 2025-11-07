import express from "express";
import multer from "multer";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

const upload = multer({ dest: "uploads/" });

// --- In-memory user profiles (temporary DB) ---
let userProfiles = {};

// --- Email & Phone Validation ---
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone); // 10 digits, starts 6–9

// --- Create or Update Profile ---
app.put("/api/profile/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { fullname, email, contact } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  // ✅ Validation
  if (!fullname || !email || !contact) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (!isValidPhone(contact)) {
    return res.status(400).json({ error: "Invalid mobile number" });
  }

  // ✅ Save or Update Profile
  userProfiles[id] = {
    id,
    fullname,
    email,
    contact,
    image: image || userProfiles[id]?.image || null,
  };

  return res.json({
    message: "Profile updated successfully",
    profile: userProfiles[id],
  });
});

// --- Get Single Profile by ID ---
app.get("/api/profile/:id", (req, res) => {
  const { id } = req.params;

  if (!userProfiles[id]) {
    return res.status(404).json({ error: "Profile not found" });
  }

  res.json(userProfiles[id]);
});

// --- Get All Profiles ---
app.get("/api/profile", (req, res) => {
  // If no profiles yet
  if (Object.keys(userProfiles).length === 0) {
    return res.status(200).json({ message: "No profiles found yet." });
  }

  res.json(userProfiles);
});

// --- Default route ---
app.get("/", (req, res) => {
  res.send("User Profile API is running 🚀");
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
