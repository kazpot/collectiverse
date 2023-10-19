import mongoose from 'mongoose';

export const bidSchema = new mongoose.Schema(
  {
    parentId: { type: String, required: true, index: true },
    hash: { type: String, required: true },
    price: { type: String, required: true },
    taker: { type: String, required: true, index: true },
    createTime: { type: String, required: true },
    active: { type: Boolean, rquired: true },
    tx: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const Bid = mongoose.models.Bid || mongoose.model('Bid', bidSchema);
export default Bid;
