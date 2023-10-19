import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema(
  {
    value: { type: String, required: true, index: true },
  },
  {
    timestamps: true,
  },
);

const Tag = mongoose.models.Tag || mongoose.model('Tag', tagSchema);
export default Tag;
