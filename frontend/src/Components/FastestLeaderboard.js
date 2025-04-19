'use client'

import LoadingSpinner from './LoadingSpinner';

export default function FastestLeaderboard({ title, data, isLoading }) {
  const formatName = (name) => {
    const maxLength = 20;
    const names = name.split(' ');
    
    if (name.length > maxLength) {
      // If name is too long, show first name and truncate the rest
      const firstName = names[0];
      const rest = names.slice(1).join(' ');
      return (
        <div className="flex flex-col leading-tight">
          <span className="text-secondary text-xs font-dm-sans">{firstName}</span>
          <span className="text-secondary text-xs truncate font-dm-sans">{rest}</span>
        </div>
      );
    } else if (names.length > 1) {
      // If name is short enough but has multiple parts
      return (
        <div className="flex flex-col leading-tight">
          <span className="text-secondary text-xs font-dm-sans">{names[0]}</span>
          <span className="text-secondary text-xs font-dm-sans">{names.slice(1).join(' ')}</span>
        </div>
      );
    }
    return <span className="text-secondary text-xs font-dm-sans">{name}</span>;
  };

  const getColumnWidth = (column) => {
    switch (column.toLowerCase()) {
      case 'position':
        return 'w-16';
      case 'name':
        return 'w-28';
      case 'avgpace':
        return 'w-20';
      case 'time':
        return 'w-16';
      default:
        return 'w-16';
    }
  };

  const getColumnAlignment = (column) => {
    switch (column.toLowerCase()) {
      case 'position':
        return 'text-left';
      case 'name':
        return 'text-center';
      case 'avgpace':
      case 'time':
        return 'text-center';
      default:
        return 'text-left';
    }
  };

  const columns = ['Position', 'Name', 'Avg Pace', 'Time'];

  if (isLoading) {
    return (
      <div className="w-96 bg-primary rounded-[20px] p-4 h-[360px]">
        <h2 className="text-white text-lg font-semibold mb-4 text-center">{title}</h2>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="inline-flex flex-col justify-start items-center gap-1">
      {/* Header */}
      <div className="w-96 h-8 px-5 flex items-center">
        <div className="self-stretch w-full inline-flex justify-between items-center">
          {columns.map((column, index) => (
            <div 
              key={index}
              className={`${getColumnWidth(column)} text-primary text-xs font-normal font-dm-sans ${getColumnAlignment(column)}`}
            >
              {column}
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Items */}
      <div className="flex flex-col gap-1 w-96">
        {data.map((row, index) => (
          <div key={index} className="h-14 px-5 py-2 bg-primary rounded-[20px] flex items-center">
            <div className="w-full inline-flex justify-between items-center">
              {columns.map((column, colIndex) => {
                const key = column.toLowerCase().replace(/\s+/g, '');
                let value = row[key];
                
                if (key === 'position') value = row['rank'];
                if (key === 'avgpace') value = row['avgPace'];

                if (key === 'name') {
                  return (
                    <div key={colIndex} className={`${getColumnWidth(column)} flex items-center gap-2`}>
                      <img 
                        className="w-6 h-6 rounded-full border border-secondary" 
                        src={row.avatar || "https://placehold.co/24x24"} 
                        alt={row.name}
                      />
                      <div className="w-[calc(100%-32px)]">
                        {formatName(value)}
                      </div>
                    </div>
                  );
                }

                if (key === 'position') {
                  return (
                    <div key={colIndex} className={`${getColumnWidth(column)} flex items-center gap-2`}>
                      <div className="w-6 text-center justify-start text-secondary text-xs font-normal font-thuast leading-none">
                        {value}
                      </div>
                      <img 
                        src="Images/icons/arrow_up.png" 
                        alt="arrow" 
                        className="w-4 h-4"
                      />
                    </div>
                  );
                }

                return (
                  <div 
                    key={colIndex}
                    className={`${getColumnWidth(column)} text-secondary text-xs font-normal font-dm-sans ${getColumnAlignment(column)}`}
                  >
                    {value}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 