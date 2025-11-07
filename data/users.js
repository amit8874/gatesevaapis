import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  image: { type: String }, // Store as base64 string
  fullName: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

export default User;
