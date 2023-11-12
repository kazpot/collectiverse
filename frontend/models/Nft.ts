import mongoose from 'mongoose';

const nftSchema = new mongoose.Schema(
  {
    nftAddress: { type: String, required: true },
    tokenId: { type: Number, required: true },
    owner: { type: String, required: true, index: true },
    tokenUri: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    mimeType: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const Nft = mongoose.models.Nft || mongoose.model('Nft', nftSchema);
export default Nft;
