import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './data/users.js';

dotenv.config();

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

const seedUsers = async () => {
  try {
    await connectDB();

    // Clear existing users
    await User.deleteMany({});

    // Seed initial users
    const users = [
      {
        id: 1,
        image: "https://example.com/amit.jpg",
        fullName: "Amit Maurya",
        contact: "8874614138",
        email: "amitmaurya123@gmail.com"
      },
      {
        id: 2,
        fullName: "Rohit Sharma",
        contact: "9988776655",
        image: "https://example.com/rohit.jpg",
        email: "amitmaurya123@gmail.com"
      }
    ];

    await User.insertMany(users);
    console.log("✅ Users seeded successfully");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    process.exit(1);
  }
};

seedUsers();
