import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  distance: {
    type: Number,
    required: true
  },
  time: {
    type: Number,
    required: true
  },
  pace: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Leaderboard || 
  mongoose.model('Leaderboard', leaderboardSchema);