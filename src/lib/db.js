// Mock user database
const users = [
  {
    id: 'RRS25-1',
    email: 'test@example.com',
    password: 'password123',
    name: 'Hello',
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
  },
  {
    id: 'RRS25-6',
    email: 'lisa.patel@example.com',
    password: 'password123',
    name: 'Lisa Patel',
    progress: 'Silver Medal',
    totalDistance: '115KM',
    totalTime: '12:10:30',
    averagePace: '5:20',
    best5km: '25:45',
    best10km: '52:20'
  },
  {
    id: 'RRS25-7',
    email: 'james.lee@example.com',
    password: 'password123',
    name: 'James Lee',
    progress: 'Bronze Medal',
    totalDistance: '108KM',
    totalTime: '12:25:15',
    averagePace: '5:25',
    best5km: '26:00',
    best10km: '53:45'
  },
  {
    id: 'RRS25-8',
    email: 'ana.silva@example.com',
    password: 'password123',
    name: 'Ana Silva',
    progress: 'Bronze Medal',
    totalDistance: '95KM',
    totalTime: '12:45:30',
    averagePace: '5:35',
    best5km: '26:30',
    best10km: '54:15'
  },
  {
    id: 'RRS25-9',
    email: 'tom.wright@example.com',
    password: 'password123',
    name: 'Tom Wright',
    progress: 'Bronze Medal',
    totalDistance: '87KM',
    totalTime: '13:00:00',
    averagePace: '5:45',
    best5km: '27:00',
    best10km: '55:30'
  }
];

// Helper functions to get sorted leaderboard data
const getOverallLeaderboard = () => {
  return [...users]
    .sort((a, b) => parseInt(b.totalDistance) - parseInt(a.totalDistance))
    .map((user, index) => ({
      rank: index + 1,
      name: user.name,
      distance: user.totalDistance,
      avgPace: user.averagePace,
      best5km: user.best5km,
      best10km: user.best10km
    }));
};

const get5KMLeaderboard = () => {
  return [...users]
    .sort((a, b) => {
      const timeA = a.best5km.split(':').reduce((acc, time) => acc * 60 + parseInt(time), 0);
      const timeB = b.best5km.split(':').reduce((acc, time) => acc * 60 + parseInt(time), 0);
      return timeA - timeB;
    })
    .filter(user => user.best5km !== '00:00')
    .map((user, index) => ({
      rank: index + 1,
      name: user.name,
      avgPace: user.averagePace,
      time: user.best5km
    }));
};

const get10KMLeaderboard = () => {
  return [...users]
    .sort((a, b) => {
      const timeA = a.best10km.split(':').reduce((acc, time) => acc * 60 + parseInt(time), 0);
      const timeB = b.best10km.split(':').reduce((acc, time) => acc * 60 + parseInt(time), 0);
      return timeA - timeB;
    })
    .filter(user => user.best10km !== '00:00')
    .map((user, index) => ({
      rank: index + 1,
      name: user.name,
      avgPace: user.averagePace,
      time: user.best10km
    }));
};

export const db = {
  users,
  findUser: (email) => users.find(user => user.email === email),
  validatePassword: (user, password) => user.password === password,
  getOverallLeaderboard,
  get5KMLeaderboard,
  get10KMLeaderboard
}; 