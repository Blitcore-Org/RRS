// Helper function to generate random pace
const generateRandomPace = (minMinutes, maxMinutes) => {
  const minutes = Math.floor(Math.random() * (maxMinutes - minMinutes) + minMinutes);
  const seconds = Math.floor(Math.random() * 59);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Helper function to calculate 5KM time from pace
const calculate5KMTime = (pace) => {
  const [minutes, seconds] = pace.split(':').map(Number);
  const totalSeconds = (minutes * 60 + seconds) * 5;
  const resultMinutes = Math.floor(totalSeconds / 60);
  const resultSeconds = totalSeconds % 60;
  return `${resultMinutes}:${resultSeconds.toString().padStart(2, '0')}`;
};

// Helper function to calculate 10KM time from pace
const calculate10KMTime = (pace) => {
  const [minutes, seconds] = pace.split(':').map(Number);
  const totalSeconds = (minutes * 60 + seconds) * 10;
  const resultMinutes = Math.floor(totalSeconds / 60);
  const resultSeconds = totalSeconds % 60;
  return `${resultMinutes}:${resultSeconds.toString().padStart(2, '0')}`;
};

// Generate 50 runners with realistic data
const generateRunners = (count = 50) => {
  const firstNames = ['Sarah', 'Mike', 'Emma', 'James', 'Sophia', 'Lucas', 'Isabella', 'Oliver', 'Ava', 'Ethan', 
    'Mia', 'Alexander', 'Charlotte', 'William', 'Sofia', 'Benjamin', 'Amelia', 'Daniel', 'Victoria', 'Henry',
    'Luna', 'Jack', 'Lily', 'Noah', 'Zoe', 'Leo', 'Grace', 'David', 'Chloe', 'Mason',
    'Eva', 'Owen', 'Alice', 'Felix', 'Ruby', 'Oscar', 'Hannah', 'Arthur', 'Lucy', 'Max'];

  const lastNames = ['Chen', 'Ross', 'Wilson', 'Rodriguez', 'Lee', 'Martinez', 'Kim', 'Wang', 'Thompson', 'Patel',
    'Johnson', 'Liu', 'Davis', 'Zhang', 'Garcia', 'Park', 'Brown', 'Nguyen', 'Smith', 'Anderson',
    'Taylor', 'Moore', 'Jackson', 'Martin', 'White', 'Harris', 'Clark', 'Lewis', 'Young', 'Walker',
    'Hall', 'Allen', 'King', 'Wright', 'Lopez', 'Hill', 'Scott', 'Green', 'Adams', 'Baker'];

  const runners = [];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const avgPace = generateRandomPace(4, 7); // Paces between 4:00 and 7:00 min/km
    const best5kmTime = calculate5KMTime(avgPace);
    const best10kmTime = calculate10KMTime(avgPace);
    const distance = Math.floor(Math.random() * (150 - 50) + 50); // Distance between 50-150 KM

    runners.push({
      rank: i + 1, // Will be updated when sorted
      name: `${firstName} ${lastName}`,
      distance: `${distance}KM`,
      avgPace,
      best5km: best5kmTime,
      best10km: best10kmTime,
      time: best5kmTime, // For 5KM leaderboard
    });
  }

  return runners;
};

// Generate the data
const runnersData = generateRunners(50);

// Sort functions
const sortByDistance = (data) => {
  return [...data].sort((a, b) => {
    const distA = parseInt(a.distance);
    const distB = parseInt(b.distance);
    return distB - distA;
  }).map((runner, index) => ({ ...runner, rank: index + 1 }));
};

const sortBy5KM = (data) => {
  return [...data].sort((a, b) => {
    const [minA, secA] = a.best5km.split(':').map(Number);
    const [minB, secB] = b.best5km.split(':').map(Number);
    return (minA * 60 + secA) - (minB * 60 + secB);
  }).map((runner, index) => ({ ...runner, rank: index + 1 }));
};

const sortBy10KM = (data) => {
  return [...data].sort((a, b) => {
    const [minA, secA] = a.best10km.split(':').map(Number);
    const [minB, secB] = b.best10km.split(':').map(Number);
    return (minA * 60 + secA) - (minB * 60 + secB);
  }).map((runner, index) => ({ ...runner, rank: index + 1 }));
};

export const leaderboardData = {
  overall: sortByDistance(runnersData),
  fastest5km: sortBy5KM(runnersData),
  fastest10km: sortBy10KM(runnersData)
}; 