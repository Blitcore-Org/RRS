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
        <span className="text-primary text-xs font-normal font-dm-sans leading-none">
          {user.progress || '0KM To Bronze'}
        </span>
      </div>
    </div>
  );
}
