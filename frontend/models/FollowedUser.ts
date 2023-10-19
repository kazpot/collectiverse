import mongoose from 'mongoose';

const followedUserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, index: true },
    // username is followed by followed
    followed: { type: [String], required: false },
  },
  {
    timestamps: true,
  },
);

const FollowedUser =
  mongoose.models.FollowedUser || mongoose.model('FollowedUser', followedUserSchema);
export default FollowedUser;
