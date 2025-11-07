import express from "express";
import User from "../data/users.js";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ✅ Fetch user profile by ID
router.get("/:id", async (req, res) => {
  try {
    console.log(`[GET] Fetching user profile for ID: ${req.params.id}`);
    const userId = parseInt(req.params.id);
    const user = await User.findOne({ id: userId });

    if (!user) {
      console.log(`[GET] User not found for ID: ${userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`[GET] User found: ${user.fullName}`);
    res.json(user);
  } catch (error) {
    console.error(`[GET] Error fetching user: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Update user profile (edit & upload photo)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    console.log(`[PUT] Updating user profile for ID: ${req.params.id}`);
    const userId = parseInt(req.params.id);
    const { fullName, contact, email } = req.body;

    console.log(`[PUT] Request body:`, { fullName, contact, email, hasImage: !!req.file });

    const user = await User.findOne({ id: userId });
    if (!user) {
      console.log(`[PUT] User not found for ID: ${userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    // Handle image upload
    let image = user.image;
    if (req.file) {
      console.log(`[PUT] Processing image upload for user ${userId}`);

      try {
        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'gateseva-profiles',
              public_id: `user-${userId}-${Date.now()}`,
              resource_type: 'auto'
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(req.file.buffer);
        });

        image = result.secure_url;
        console.log(`[PUT] Image uploaded to Cloudinary successfully: ${image}`);
      } catch (uploadError) {
        console.error(`[PUT] Cloudinary upload error: ${uploadError.message}`);
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    // Update user data
    user.fullName = fullName || user.fullName;
    user.contact = contact || user.contact;
    user.email = email || user.email;
    user.image = image;

    await user.save();

    console.log(`[PUT] Profile updated successfully for user ${userId}`);
    res.json({
      message: "Profile updated successfully",
      user: user,
    });
  } catch (error) {
    console.error(`[PUT] Error updating user: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
