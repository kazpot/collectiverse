import mongoose from 'mongoose';

const MONGO_URI: string = process.env.NEXT_PUBLIC_MONGODB_URI || '';

export const connect = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  await mongoose.connect(MONGO_URI);
};

function convertDocToObj(doc: any) {
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  return doc;
}

const db = { connect, convertDocToObj };

export default db;
