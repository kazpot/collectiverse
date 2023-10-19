import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    value: { type: String, required: true, index: true },
  },
  {
    timestamps: true,
  },
);

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
export default Category;
