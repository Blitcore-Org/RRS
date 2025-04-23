import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: Date,
    distance: String,
    time: Number,
    pace: String,
  });
  export default mongoose.model('Leaderboard', leaderboardSchema);