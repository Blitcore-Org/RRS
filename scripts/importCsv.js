const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

const calculateProgress = (totalDistance) => {
  const distance = parseFloat(totalDistance);
  if (distance >= 150) return 'Gold Medal';
  if (distance >= 100) return 'Silver Medal';
  if (distance >= 50) return 'Bronze Medal';
  return 'OKM To Bronze';
};

const standardizeTime = (timeStr) => {
  if (!timeStr || timeStr === 'N/A') return '00:00';
  return timeStr.trim();
};

const cleanDistance = (distance) => {
  if (!distance) return '0';
  return distance.toString().replace(/[^\d.]/g, '');
};

const importUsers = async (csvPath) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const users = [];
    let isFirstRow = true;

    await new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => {
          // Log headers from first row
          if (isFirstRow) {
            console.log('CSV Headers:', Object.keys(row));
            isFirstRow = false;
          }

          // Generate ID from name if not present
          const runnerId = row['ID'] || row['Id'] || row['id'] || 
                          `RRS25-${row['Runner Name ']?.trim()?.substring(0, 3)?.toUpperCase()}`;

          const user = {
            id: runnerId,
            email: `${runnerId.toLowerCase().replace(/\s+/g, '')}@rrs25.com`,
            password: 'password123',
            name: row['Runner Name ']?.trim() || row['Runner Name']?.trim() || row['Name']?.trim(),
            progress: calculateProgress(row['Total Distance (KM)'] || row['Distance'] || '0'),
            totalDistance: `${row['Total Distance (KM)'] || row['Distance'] || '0'}KM`,
            totalTime: standardizeTime(row['Total Time'] || row['Time']),
            averagePace: standardizeTime(row['Average Pace '] || row['Average Pace'] || row['Pace']),
            best5km: standardizeTime(row['5KM Best Time'] || row['5KM']),
            best10km: standardizeTime(row['10KM Best Time'] || row['10KM']),
            forcePasswordChange: true
          };

          if (user.name) {
            console.log(`Adding user: ${user.name} (${user.id})`);
            users.push(user);
          } else {
            console.warn('Invalid user data:', { id: user.id, name: user.name });
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    // Clear existing users except admin
    await User.deleteMany({ isAdmin: { $ne: true } });
    console.log('Cleared existing non-admin users');

    if (users.length === 0) {
      throw new Error('No valid users found in CSV');
    }

    // Insert new users
    await User.insertMany(users);
    console.log(`Imported ${users.length} users`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

    process.exit(0);
  } catch (error) {
    console.error('Import error:', error);
    process.exit(1);
  }
};

// Usage: node scripts/importCsv.js <path-to-csv>
const csvPath = process.argv[2];
if (!csvPath) {
  console.error('Please provide path to CSV file');
  process.exit(1);
}

importUsers(csvPath); 