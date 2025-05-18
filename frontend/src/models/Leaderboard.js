const mongoose = require('mongoose');

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
    type: String,
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

module.exports = mongoose.models.Leaderboard || mongoose.model('Leaderboard', leaderboardSchema); 