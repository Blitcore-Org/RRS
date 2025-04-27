import React from 'react';

export default function ProfileSection({ user, editable = false, onImageClick }) {
  const formatName = (name) => {
    const names = name?.split(' ');
    if (names.length > 1 && name.length > 12) {
      return (
        <div className="flex flex-col leading-tight text-center sm:text-left">
          <span>{names[0]}</span>
          <span className="text-sm">{names.slice(1).join(' ')}</span>
        </div>
      );
    }
    return name;
  };

  const getProgressText = () => {
    // Extract the numeric value from totalDistance (e.g., "0.42KM" -> 0.42)
    const currentDistance = parseFloat(user.totalDistance?.replace('KM', '')) || 0;
    
    if (currentDistance < 50) {
      return `${(50 - currentDistance).toFixed(2)}KM To Bronze`;
    } else if (currentDistance < 100) {
      return `${(100 - currentDistance).toFixed(2)}KM To Silver`;
    } else if (currentDistance < 150) {
      return `${(150 - currentDistance).toFixed(2)}KM To Gold`;
    } else {
      return '0.00KM To Gold';
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-[20px]">
      <div
        onClick={editable ? onImageClick : undefined}
        className={
          `w-[60px] h-[60px] flex-shrink-0 rounded-full bg-white/20 overflow-hidden ` +
          (editable ? 'cursor-pointer hover:opacity-80' : '')
        }
      >
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt={`${user.name}'s profile`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300"></div>
        )}
      </div>
      <div className="flex flex-col items-center">
        <span className="text-white/60 text-[10px] font-normal font-dm-sans leading-3">
          {user.id}
        </span>
        <h2 className="text-primary text-xl font-bold font-dm-sans leading-normal">
          {formatName(user.name)}
        </h2>
        {!user.isAdmin && (
          <span className="text-primary text-xs font-normal font-dm-sans leading-none">
            {getProgressText()}
          </span>
        )}
      </div>
    </div>
  );
}
