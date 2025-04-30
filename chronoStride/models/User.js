import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  stravaId: { type: Number, unique: true, sparse: true },
  name: String,
  stravaAccessToken: String,
  stravaRefreshToken: String,
  stravaExpiresAt: Number,
  totalDistance: { type: String, default: '0KM' },
  totalTime: { type: String, default: '00:00:00' },
  averagePace: { type: String, default: '0:00' },
  lastCronFetch: Date,
  lastPosition:       { type: Number, default: null },
  currentPosition:    { type: Number, default: null },
});
export default mongoose.model('User', userSchema);