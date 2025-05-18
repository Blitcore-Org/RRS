'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import LoadingSpinner from '@/Components/LoadingSpinner';
import ProfileSection from '@/Components/ProfileSection';
import EditSessionModal from '@/Components/EditSessionModal';
import axiosInstance from '@/utils/axiosInstance';

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function AdminUserDetail() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sessions, setSessions] = useState([]);
  const [deletingSession, setDeletingSession] = useState(null);
  const [editingSession, setEditingSession] = useState(null);
  const [applyingStats, setApplyingStats] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [statsToApply, setStatsToApply] = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError('');
    
    // Fetch user data
    axiosInstance.get(`/api/admin/users?id=${userId}`)
      .then(res => {
        setUser(res.data);
        // After getting user data, fetch their sessions
        return axiosInstance.get(`/api/admin/users/${userId}/sessions`);
      })
      .then(res => {
        setSessions(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Failed to fetch data');
        setLoading(false);
      });
  }, [userId]);

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this session? This will recalculate the user\'s totals.')) {
      return;
    }

    setDeletingSession(sessionId);
    try {
      const response = await axiosInstance.delete(`/api/admin/users/${userId}/sessions/${sessionId}`);
      // Update user data with new totals
      setUser(prev => ({
        ...prev,
        totalDistance: response.data.user.totalDistance,
        totalTime: response.data.user.totalTime,
        averagePace: response.data.user.averagePace
      }));
      // Remove the deleted session from the list
      setSessions(prev => prev.filter(s => s._id !== sessionId));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete session');
    } finally {
      setDeletingSession(null);
    }
  };

  const handleEditSession = async (sessionId) => {
    const session = sessions.find(s => s._id === sessionId);
    setEditingSession(session);
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      const response = await axiosInstance.put(
        `/api/admin/users/${userId}/sessions/${editingSession._id}`,
        updatedData
      );
      
      // Update user data with new totals
      setUser(prev => ({
        ...prev,
        totalDistance: response.data.user.totalDistance,
        totalTime: response.data.user.totalTime,
        averagePace: response.data.user.averagePace
      }));

      // Update the session in the list
      setSessions(prev => prev.map(s => 
        s._id === editingSession._id 
          ? { ...s, ...updatedData }
          : s
      ));

      setEditingSession(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update session');
    }
  };

  const calculateSessionTotals = () => {
    if (!sessions.length) return { totalTime: 0, averagePace: '0:00' };

    let totalTime = 0;
    let totalDistance = 0;

    sessions.forEach(session => {
      totalTime += session.time;
      totalDistance += parseFloat(session.distance);
    });

    const paceSeconds = totalDistance ? Math.floor(totalTime / totalDistance) : 0;
    const paceMinutes = Math.floor(paceSeconds / 60);
    const paceSecs = paceSeconds % 60;
    const averagePace = `${paceMinutes}:${paceSecs.toString().padStart(2, '0')}`;

    return {
      totalTime,
      averagePace
    };
  };

  const handleApplyStats = async (type) => {
    const sessionTotals = calculateSessionTotals();
    setStatsToApply({
      type,
      totalTime: formatTime(sessionTotals.totalTime),
      averagePace: sessionTotals.averagePace
    });
    setShowConfirmDialog(true);
  };

  const confirmApplyStats = async () => {
    if (!statsToApply) return;
    
    setApplyingStats(true);
    try {
      const response = await axiosInstance.put(
        `/api/admin/users/${userId}/update-stats`,
        {
          totalTime: statsToApply.totalTime,
          averagePace: statsToApply.averagePace
        }
      );
      
      setUser(prev => ({
        ...prev,
        totalTime: response.data.user.totalTime,
        averagePace: response.data.user.averagePace
      }));
      
      setShowConfirmDialog(false);
      setStatsToApply(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update stats');
    } finally {
      setApplyingStats(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  const sessionTotals = calculateSessionTotals();

  return (
    <main className="w-full min-h-screen bg-background bg-no-repeat bg-center bg-cover flex items-center justify-center pb-16">
      <div className="flex w-full h-full max-w-[402px] min-h-[600px] flex-col items-center rounded-[44px]">
        <div className="flex flex-col flex-1 w-full justify-between items-center gap-[20px] px-[20px] pt-[20px]">
          {/* Profile Row with Back Button and Spacer */}
          <div className="w-full flex flex-row items-center mb-2">
            {/* Back Button */}
            <button
              className="flex items-center text-primary hover:text-secondary focus:outline-none"
              onClick={() => router.back()}
              aria-label="Back to Users"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="sr-only">Back</span>
            </button>
            {/* Profile Section Centered */}
            <div className="flex-1 flex justify-center">
              <ProfileSection user={user} />
            </div>
            {/* Spacer to balance the row */}
            <div className="w-6" />
          </div>

          {/* Accumulated Data */}
          <div className="w-full p-6 bg-primary rounded-[24px] text-white">
            <div className="flex justify-between items-center mb-4">
              <span className="text-secondary font-normal font-dm-sans leading-normal">Total Distance</span>
              <span className="text-secondary">{user.totalDistance}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-secondary font-normal font-dm-sans leading-normal">Total Time</span>
              <span className="text-secondary font-bold font-dm-sans leading-normal">{user.totalTime}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-secondary font-normal font-dm-sans leading-normal">Average Pace</span>
              <span className="text-secondary font-bold font-dm-sans leading-normal">{user.averagePace}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-secondary font-normal font-dm-sans leading-normal">Total Sessions</span>
              <span className="text-secondary font-bold font-dm-sans leading-normal">{sessions.length}</span>
            </div>
            <div className="border-t border-white/10 mt-4 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-secondary text-sm">Combined Session Time</span>
                <div className="flex items-center gap-2">
                  <span className="text-secondary text-sm font-bold">{formatTime(sessionTotals.totalTime)}</span>
                  <button
                    onClick={() => handleApplyStats('time')}
                    disabled={applyingStats}
                    className="text-blue-400 hover:text-blue-300 disabled:opacity-50"
                    title="Apply to user stats"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary text-sm">Combined Session Pace</span>
                <div className="flex items-center gap-2">
                  <span className="text-secondary text-sm font-bold">{sessionTotals.averagePace}</span>
                  <button
                    onClick={() => handleApplyStats('pace')}
                    disabled={applyingStats}
                    className="text-blue-400 hover:text-blue-300 disabled:opacity-50"
                    title="Apply to user stats"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Activities/Sessions */}
          <div className="w-full p-6 bg-primary rounded-[24px] text-white">
            <h2 className="text-secondary font-semibold mb-4">Activities / Sessions</h2>
            {sessions.length === 0 ? (
              <div className="bg-white/10 rounded p-2 text-xs text-secondary">No sessions found</div>
            ) : (
              <div className="space-y-2">
                {sessions.map((session) => (
                  <div key={session._id} className="bg-white/10 rounded p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-secondary text-sm">
                        {new Date(session.date).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-secondary text-sm">{session.distance}KM</span>
                        <button
                          onClick={() => handleEditSession(session._id)}
                          className="text-blue-400 hover:text-blue-300"
                          title="Edit session"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteSession(session._id)}
                          disabled={deletingSession === session._id}
                          className="text-red-400 hover:text-red-300 disabled:opacity-50"
                          title="Delete session"
                        >
                          {deletingSession === session._id ? (
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-secondary text-xs">Time: {new Date(session.time * 1000).toISOString().substr(11, 8)}</span>
                      <span className="text-secondary text-xs">Pace: {session.pace}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Admin Actions */}
          <div className="w-full p-6 bg-primary rounded-[24px] text-white">
            <h2 className="text-secondary font-semibold mb-2">Admin Actions</h2>
            <div className="bg-white/10 rounded p-2 text-xs text-secondary">(To be implemented: fetch, manual entry)</div>
          </div>
        </div>
      </div>

      {/* Edit Session Modal */}
      <EditSessionModal
        session={editingSession}
        isOpen={!!editingSession}
        onClose={() => setEditingSession(null)}
        onSave={handleSaveEdit}
      />

      {/* Confirm Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-primary rounded-[24px] p-6 w-full max-w-[402px]">
            <h2 className="text-secondary font-semibold mb-4">Confirm Update</h2>
            <p className="text-secondary mb-4">
              This will update the user's {statsToApply.type === 'time' ? 'total time' : 'average pace'} in the database.
              Are you sure you want to proceed?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  setStatsToApply(null);
                }}
                className="px-4 py-2 text-secondary hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={confirmApplyStats}
                disabled={applyingStats}
                className="px-4 py-2 bg-secondary text-primary rounded hover:bg-secondary/80 disabled:opacity-50"
              >
                {applyingStats ? 'Applying...' : 'Apply Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
} 