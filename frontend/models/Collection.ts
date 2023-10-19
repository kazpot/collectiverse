import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema(
  {
    collectionId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, unique: true },
    createdBy: { type: String, required: true, index: true },
    description: { type: String, required: false },
    coverImage: { type: String, required: false },
    cardImage: { type: String, required: false },
    webSite: { type: String, required: false },
    discord: { type: String, required: false },
    twitter: { type: String, required: false },
    instagram: { type: String, required: false },
    // array of listId
    items: { type: [String], required: false },
  },
  {
    timestamps: true,
  },
);

const Collection = mongoose.models.Collection || mongoose.model('Collection', collectionSchema);
export default Collection;
