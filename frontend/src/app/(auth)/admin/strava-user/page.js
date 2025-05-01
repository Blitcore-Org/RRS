'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/axiosInstance';
import Button from '@/Components/button';
import BottomNavigation from '@/Components/BottomNavigation';

export default function ManualActivity() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [activityDate, setActivityDate] = useState('');
  const [session, setSession] = useState('06:30-07:40');
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const [manualData, setManualData] = useState({ distance: '', time: '', pace: '' });

  useEffect(() => {
    axiosInstance.get('/api/admin/users')
      .then(res => setUsers(res.data))
      .catch(() => setError('Failed to load users'));
  }, []);

  const fetchDetails = async (e) => {
    e.preventDefault();
    setError(''); setDetails(null);
    if (!selectedUser || !activityDate) {
      setError('Please select a user and pick a date.');
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.post('/api/admin/manual-activity/fetch', {
        userId: selectedUser,
        date:   activityDate,
        session,
      });
      setDetails(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch activity');
    } finally { setLoading(false); }
  };

  const confirmEntry = async () => {
    setError(''); setConfirming(true);
    try {
      const payload = isManual
        ? { userId: selectedUser, date: activityDate, session, ...manualData }
        : { userId: selectedUser, date: activityDate, session, ...details };
      await axiosInstance.post('/api/admin/manual-activity/confirm', payload);
      router.push('/admin/users');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to confirm entry');
    } finally { setConfirming(false); }
  };

  return (
    <main className="w-full min-h-screen bg-background bg-no-repeat bg-center bg-cover flex items-center justify-center">
      <div className="flex w-full max-w-md flex-col bg-white/10 p-6 rounded-xl">
        <h1 className="text-xl text-white mb-2">Manual Activity Entry</h1>
        <h2 className="text-sm text-yellow-300 mb-4">Please only use this if necessary</h2>

        <div className="flex items-center mb-4">
          <label className="text-white mr-2">Manual Input</label>
          <input
            type="checkbox"
            checked={isManual}
            onChange={() => setIsManual(prev => !prev)}
            className="form-checkbox h-5 w-5 text-primary"
          />
        </div>

        <form onSubmit={isManual ? (e => { e.preventDefault(); confirmEntry(); }) : fetchDetails} className="flex flex-col gap-4">
          <label className="text-white">Select User</label>
          <select
            value={selectedUser}
            onChange={e => setSelectedUser(e.target.value)}
            className="w-full px-3 py-2 rounded bg-white/20 text-white appearance-none"
          >
            <option value="" className="text-black">-- Select a user --</option>
            {users.map(u => (
              <option key={u._id} value={u._id} className="text-black">
                {u.name} (Strava: {u.stravaId})
              </option>
            ))}
          </select>

          <label className="text-white">Select Date</label>
          <input
            type="date"
            value={activityDate}
            onChange={e => setActivityDate(e.target.value)}
            className="w-full px-3 py-2 rounded bg-white/20 text-white focus:outline-none"
          />

          <label className="text-white">Session</label>
          <select
            value={session}
            onChange={e => setSession(e.target.value)}
            className="w-full px-3 py-2 rounded bg-white/20 text-white appearance-none"
          >
            <option value="06:30-07:40" className="text-black">Morning (06:30 - 07:40)</option>
            <option value="18:30-19:40" className="text-black">Evening (18:30 - 19:40)</option>
          </select>

          {isManual ? (
            <> 
              <label className="text-white">Distance (km)</label>
              <input
                type="number"
                step="0.01"
                value={manualData.distance}
                onChange={e => setManualData({...manualData, distance: e.target.value})}
                className="w-full px-3 py-2 rounded bg-white/20 text-white focus:outline-none"
              />
              <label className="text-white">Time (seconds)</label>
              <input
                type="number"
                value={manualData.time}
                onChange={e => setManualData({...manualData, time: e.target.value})}
                className="w-full px-3 py-2 rounded bg-white/20 text-white focus:outline-none"
              />
              <label className="text-white">Pace (MM:SS)</label>
              <input
                type="text"
                value={manualData.pace}
                onChange={e => setManualData({...manualData, pace: e.target.value})}
                className="w-full px-3 py-2 rounded bg-white/20 text-white focus:outline-none"
                placeholder="e.g. 6:40"
              />
            </>
          ) : (
            <Button type="submit" className="w-full" loading={loading}>
              Fetch Activity
            </Button>
          )}

          {error && <div className="text-red-500 text-sm">{error}</div>}

          {details && !isManual && (
            <div className="mt-4 bg-white/20 p-4 rounded">
              <h2 className="text-white mb-2">Fetched Details</h2>
              <p className="text-white">Distance: {details.distance} km</p>
              <p className="text-white">Time: {details.time} s</p>
              <p className="text-white">Pace: {details.pace} min/km</p>
            </div>
          )}

          {isManual || details ? (
            <Button
              type="button"
              className="mt-4 w-full"
              onClick={confirmEntry}
              loading={confirming}
            >
              Confirm Entry
            </Button>
          ) : null}
        </form>
      </div>
      <BottomNavigation />
    </main>
  );
}
