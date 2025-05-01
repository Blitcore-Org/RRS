import dbConnect from './mongodb';
import User from '../models/User';

export const db = {
  findUser: async (email) => {
    await dbConnect();
    return await User.findOne({ email });
  },

  findUserById: async (id) => {
    await dbConnect();
    return await User.findById(id);
  },

  validatePassword: (user, password) => user.password === password,

  getOverallLeaderboard: async () => {
    await dbConnect();
    const users = await User.find({ isAdmin: false }, '-password').lean();
  
    users.sort((a, b) =>
      parseFloat(b.totalDistance) - parseFloat(a.totalDistance)
    );
  
    return users.map((user, index) => ({
      rank:           index + 1,
      name:           user.name,
      distance:       user.totalDistance,
      avgPace:        user.averagePace,
      best5km:        user.best5km,
      best10km:       user.best10km,
      time:           user.totalTime,
      profileImage:   user.profileImage,
      currentPosition:user.currentPosition,
      lastPosition:   user.lastPosition
    }));
  },  

  get5KMLeaderboard: async () => {
    await dbConnect();
    const users = await User.find({ best5km: { $ne: '00:00' } }, '-password');
    return users
      .sort((a, b) => {
        const timeA = a.best5km.split(':').reduce((acc, time) => acc * 60 + parseInt(time), 0);
        const timeB = b.best5km.split(':').reduce((acc, time) => acc * 60 + parseInt(time), 0);
        return timeA - timeB;
      })
      .map((user, index) => ({
        rank: index + 1,
        name: user.name,
        avgPace: user.averagePace,
        time: user.best5km
      }));
  },

  get10KMLeaderboard: async () => {
    await dbConnect();
    const users = await User.find({ best10km: { $ne: '00:00' } }, '-password');
    return users
      .sort((a, b) => {
        const timeA = a.best10km.split(':').reduce((acc, time) => acc * 60 + parseInt(time), 0);
        const timeB = b.best10km.split(':').reduce((acc, time) => acc * 60 + parseInt(time), 0);
        return timeA - timeB;
      })
      .map((user, index) => ({
        rank: index + 1,
        name: user.name,
        avgPace: user.averagePace,
        time: user.best10km
      }));
  }
}; 