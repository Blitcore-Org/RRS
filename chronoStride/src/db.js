// db.js
import mongoose from 'mongoose';
import logger   from '../utils/logger.js';

export default async function connectDb() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI, {
    bufferCommands: false,
    useNewUrlParser:  true,
    useUnifiedTopology: true,
  });
  logger.info('✅ Connected to MongoDB');
}
