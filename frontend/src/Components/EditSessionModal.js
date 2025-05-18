'use client';

import { useState, useEffect } from 'react';

export default function EditSessionModal({ session, isOpen, onClose, onSave }) {
  const [distance, setDistance] = useState('');
  const [time, setTime] = useState('');
  const [calculatedPace, setCalculatedPace] = useState('');
  const [originalPace, setOriginalPace] = useState('');

  useEffect(() => {
    if (session) {
      setDistance(session.distance);
      setTime(new Date(session.time * 1000).toISOString().substr(11, 8));
      setOriginalPace(session.pace);
    }
  }, [session]);

  useEffect(() => {
    if (distance && originalPace) {
      // First calculate new time based on original pace and new distance
      const [origPaceMinutes, origPaceSeconds] = originalPace.split(':').map(Number);
      const totalPaceSeconds = origPaceMinutes * 60 + origPaceSeconds;
      const newTotalSeconds = Math.floor(totalPaceSeconds * parseFloat(distance));
      
      const hours = Math.floor(newTotalSeconds / 3600);
      const minutes = Math.floor((newTotalSeconds % 3600) / 60);
      const seconds = newTotalSeconds % 60;
      
      const newTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      setTime(newTime);

      // Then calculate new pace based on new time and new distance
      const newPaceSeconds = Math.floor(newTotalSeconds / parseFloat(distance));
      const newPaceMinutes = Math.floor(newPaceSeconds / 60);
      const newPaceSecs = newPaceSeconds % 60;
      setCalculatedPace(`${newPaceMinutes}:${newPaceSecs.toString().padStart(2, '0')}`);
    }
  }, [distance, originalPace]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    onSave({
      distance: parseFloat(distance),
      time: totalSeconds,
      pace: calculatedPace
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-primary rounded-[24px] p-6 w-full max-w-[402px]">
        <h2 className="text-secondary font-semibold mb-4">Edit Session</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-secondary text-sm mb-1">Distance (KM)</label>
            <input
              type="number"
              step="0.01"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="w-full bg-white/10 rounded p-2 text-secondary"
              required
            />
          </div>
          <div>
            <label className="block text-secondary text-sm mb-1">Calculated Time (HH:MM:SS)</label>
            <div className="w-full bg-white/10 rounded p-2 text-secondary">
              {time}
            </div>
          </div>
          <div>
            <label className="block text-secondary text-sm mb-1">Original Pace</label>
            <div className="w-full bg-white/10 rounded p-2 text-secondary">
              {originalPace}
            </div>
          </div>
          <div>
            <label className="block text-secondary text-sm mb-1">Calculated Pace</label>
            <div className="w-full bg-white/10 rounded p-2 text-secondary">
              {calculatedPace}
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-secondary hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-secondary text-primary rounded hover:bg-secondary/80"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 