import React from 'react';

export default function ProfileSection({ user }) {
  const formatName = (name) => {
    const names = name.split(' ');
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

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mt-[20px]">
      <div className="w-[60px] h-[60px] flex-shrink-0 rounded-full bg-white/20 overflow-hidden">
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
      <div className="flex flex-col items-center sm:items-start">
        <span className="text-primary text-sm">{user.id}</span>
        <h2 className="text-primary font-bold text-base">
          {formatName(user.name)}
        </h2>
        <span className="text-white text-sm">{user.progress}</span>
      </div>
    </div>
  );
} 