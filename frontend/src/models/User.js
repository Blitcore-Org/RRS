const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  progress: {
    type: String,
    default: 'OKM To Bronze'
  },
  totalDistance: {
    type: String,
    default: '0KM'
  },
  totalTime: {
    type: String,
    default: '00:00:00'
  },
  averagePace: {
    type: String,
    default: '0:00'
  },
  best5km: {
    type: String,
    default: '00:00'
  },
  best10km: {
    type: String,
    default: '00:00'
  },
  forcePasswordChange: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  stravaAccessToken: {
    type: String
  },
  stravaExpiresAt: {
    type: Date
  },
  stravaRefreshToken: {
    type: String
  },
  lastCronFetch : {
    type: Date
  },
  profileImage: {
    type: String,
    default: ""        // store a URL or path here
  },
}, {
  timestamps: true
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema); 