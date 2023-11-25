import mongoose from 'mongoose';

const listSchema = new mongoose.Schema(
  {
    listId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    desc: { type: String, required: true },
    hash: { type: String, required: true },
    nftAddress: { type: String, required: true },
    tokenId: { type: String, required: true },
    image: { type: String, required: true },
    ipfs: { type: String, required: true },
    maker: { type: String, required: true, index: true },
    minter: { type: String, required: true, index: true },
    auction: { type: Boolean, required: true },
    category: { type: String, required: true },
    tags: { type: [String], required: false },
    price: { type: Number, required: true },
    bestPrice: { type: Number },
    bestBidder: { type: String },
    bestBidHash: { type: String },
    mimeType: { type: String, required: true },
    mintTime: { type: String, required: true },
    listingTime: { type: String, required: true },
    expirationTime: { type: String, required: true },
    status: { type: String, enum: ['Listing', 'Canceled', 'Sold'], required: true },
    tx: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const List = mongoose.models.List || mongoose.model('List', listSchema);
export default List;
