import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    address: { type: String, required: true, index: true },
    name: { type: String, required: false },
    username: { type: String, required: false, index: true, unique: true },
    email: { type: String, required: false },
    bio: { type: String, required: false },
    profileImage: { type: String, required: false },
    coverImage: { type: String, required: false },
    webSite: { type: String, required: false },
    discord: { type: String, required: false },
    twitter: { type: String, required: false },
    instagram: { type: String, required: false },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
