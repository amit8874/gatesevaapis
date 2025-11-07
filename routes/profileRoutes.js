import express from "express";
import { users } from "../data/users.js";
import multer from "multer";

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder to save images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// ✅ Fetch user profile by ID
router.get("/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
});

// ✅ Update user profile (edit & upload photo)
router.put("/:id", upload.single("image"), (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) return res.status(404).json({ message: "User not found" });

  const { fullName, contact, email } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : users[userIndex].image;

  users[userIndex] = { ...users[userIndex], fullName, contact, email, image };

  res.json({
    message: "Profile updated successfully",
    user: users[userIndex],
  });
});

export default router;
