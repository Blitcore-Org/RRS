import useSWR from 'swr';

const BASE_URL = '/api/leaderboards';

const fetcher = (url) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error('Failed to fetch');
    }
    return res.json();
  });

export const leaderboardService = {
  useOverallLeaderboard() {
    return useSWR(`${BASE_URL}/overall`, fetcher);
  },
  use5KMLeaderboard() {
    return useSWR(`${BASE_URL}/5km`, fetcher);
  },
  use10KMLeaderboard() {
    return useSWR(`${BASE_URL}/10km`, fetcher);
  },
};