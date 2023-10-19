import mongoose from 'mongoose';

const followingUserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, index: true },
    // username follows following
    following: { type: [String], required: false },
  },
  {
    timestamps: true,
  },
);

const FollowingUser =
  mongoose.models.FollowingUser || mongoose.model('FollowingUser', followingUserSchema);
export default FollowingUser;
