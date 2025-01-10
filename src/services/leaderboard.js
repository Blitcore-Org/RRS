const BASE_URL = '/api/leaderboards';

export const leaderboardService = {
  async getOverallLeaderboard() {
    const response = await fetch(`${BASE_URL}/overall`);
    if (!response.ok) {
      throw new Error('Failed to fetch overall leaderboard');
    }
    return response.json();
  },

  async get5KMLeaderboard() {
    const response = await fetch(`${BASE_URL}/5km`);
    if (!response.ok) {
      throw new Error('Failed to fetch 5KM leaderboard');
    }
    return response.json();
  },

  async get10KMLeaderboard() {
    const response = await fetch(`${BASE_URL}/10km`);
    if (!response.ok) {
      throw new Error('Failed to fetch 10KM leaderboard');
    }
    return response.json();
  }
}; 