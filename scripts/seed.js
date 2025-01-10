const mongoose = require('mongoose');
const User = require('../src/models/User');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const users = [
  {
    id: 'RRS25-1',
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
    progress: 'OKM To Bronze',
    totalDistance: '0KM',
    totalTime: '00:00:00',
    averagePace: '0:00',
    best5km: '00:00',
    best10km: '00:00'
  },
  {
    id: 'RRS25-2',
    email: 'sarah.chen@example.com',
    password: 'password123',
    name: 'Sarah Chen',
    progress: 'Gold Medal',
    totalDistance: '142KM',
    totalTime: '11:15:30',
    averagePace: '4:45',
    best5km: '23:15',
    best10km: '48:30'
  },
  {
    id: 'RRS25-3',
    email: 'mike.ross@example.com',
    password: 'password123',
    name: 'Mike Ross',
    progress: 'Gold Medal',
    totalDistance: '135KM',
    totalTime: '11:30:45',
    averagePace: '4:52',
    best5km: '24:05',
    best10km: '49:45'
  },
  {
    id: 'RRS25-4',
    email: 'emma.wilson@example.com',
    password: 'password123',
    name: 'Emma Wilson',
    progress: 'Silver Medal',
    totalDistance: '128KM',
    totalTime: '11:45:20',
    averagePace: '5:05',
    best5km: '24:30',
    best10km: '50:15'
  },
  {
    id: 'RRS25-5',
    email: 'david.kim@example.com',
    password: 'password123',
    name: 'David Kim',
    progress: 'Silver Medal',
    totalDistance: '120KM',
    totalTime: '12:00:00',
    averagePace: '5:15',
    best5km: '25:10',
    best10km: '51:30'
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Insert new users
    await User.insertMany(users);
    console.log('Inserted users');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed(); 