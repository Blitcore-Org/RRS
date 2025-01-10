'use client'

import LoadingSpinner from './LoadingSpinner';

export default function FastestLeaderboard({ title, data, isLoading }) {
  const getColumnWidth = (column) => {
    switch (column.toLowerCase()) {
      case '#':
        return 'w-[10%]';
      case 'name':
        return 'w-[50%]';
      case 'avgpace':
        return 'w-[20%]';
      case 'time':
        return 'w-[20%]';
      default:
        return 'w-[15%]';
    }
  };

  const formatName = (name) => {
    const names = name.split(' ');
    if (names.length > 1 && name.length > 12) {
      return (
        <div className="flex flex-col leading-tight text-center">
          <span>{names[0]}</span>
          <span>{names.slice(1).join(' ')}</span>
        </div>
      );
    }
    return name;
  };

  const columns = ['#', 'Name', 'Avg Pace', 'Time'];

  if (isLoading) {
    return (
      <div className="w-full bg-[rgba(73,81,89,0.35)] backdrop-blur-sm rounded-2xl p-4 h-[360px]">
        <h2 className="text-white text-lg font-semibold mb-4 text-center">{title}</h2>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-full bg-[rgba(73,81,89,0.35)] backdrop-blur-sm rounded-2xl p-4">
      <h2 className="text-white text-lg font-semibold mb-4 text-center">{title}</h2>
      <div className="flex w-full">
        {columns.map((column, index) => (
          <div 
            key={index} 
            className={`text-[#8FFF00] text-[8px] px-2 py-2 ${getColumnWidth(column)} text-center`}
          >
            {column}
          </div>
        ))}
      </div>
      <div className="h-[240px] overflow-y-auto">
        {data.map((row, index) => (
          <div key={index} className="flex w-full border-b border-white/10 py-2 h-[48px] items-center">
            {columns.map((column, colIndex) => {
              const key = column.toLowerCase().replace(/\s+/g, '');
              let value = row[key];
              
              // Handle special cases
              if (key === '#') value = row['rank'];
              if (key === 'avgpace') value = row['avgPace'];
              
              return (
                <div 
                  key={colIndex} 
                  className={`text-white text-[8px] px-2 ${getColumnWidth(column)} ${
                    column.toLowerCase() === 'name' ? 'overflow-visible' : 'truncate'
                  } flex items-center justify-center`}
                >
                  {column.toLowerCase() === 'name' ? formatName(value) : value}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
} 