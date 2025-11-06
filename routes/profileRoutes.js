import express from "express";
import { users } from "../data/users.js";

const router = express.Router();

// ✅ Fetch user profile by ID
router.get("/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

// ✅ Update user profile (edit & save)
router.put("/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  const { fullName, contact, image } = req.body;
  users[userIndex] = { ...users[userIndex], fullName, contact, image };

  res.json({
    message: "Profile updated successfully",
    user: users[userIndex]
  });
});

export default router;
