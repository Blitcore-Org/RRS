'use client'

import React from 'react';

export default function ProgressRings({ totalDistance }) {
  // Convert totalDistance to number by removing 'KM' and parsing
  const distance = parseFloat(totalDistance?.toString().replace('KM', '')) || 0;
  
  // Calculate progress percentages
  const bronzeProgress = Math.min((distance / 50) * 100, 100);
  const silverProgress = Math.min((distance / 100) * 100, 100);
  const goldProgress = Math.min((distance / 150) * 100, 100);

  // Determine which medal to show
  const getMedalText = () => {
    if (goldProgress === 100) return 'G';
    if (silverProgress === 100) return 'S';
    if (bronzeProgress === 100) return 'B';
    return '';
  };

  // SVG parameters
  const size = 120;
  const strokeWidth = 8;
  const center = size / 2;
  
  // Ring radiuses
  const goldRadius = 50;
  const silverRadius = 38;
  const bronzeRadius = 26;

  // Calculate circumference for each ring
  const getCircumference = (radius) => 2 * Math.PI * radius;
  
  // Calculate stroke-dasharray and stroke-dashoffset for progress
  const getProgressStyle = (radius, percentage) => {
    const circumference = getCircumference(radius);
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    return { strokeDasharray, strokeDashoffset };
  };

  return (
    <div className="relative">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Gold Ring */}
        <circle
          cx={center}
          cy={center}
          r={goldRadius}
          fill="none"
          stroke="#0B2349"
          strokeWidth={strokeWidth}
          className="opacity-20"
        />
        <circle
          cx={center}
          cy={center}
          r={goldRadius}
          fill="none"
          stroke="#FFD700"
          strokeWidth={strokeWidth}
          style={getProgressStyle(goldRadius, goldProgress)}
          className="transition-all duration-1000 ease-out"
        />

        {/* Silver Ring */}
        <circle
          cx={center}
          cy={center}
          r={silverRadius}
          fill="none"
          stroke="#0B2349"
          strokeWidth={strokeWidth}
          className="opacity-20"
        />
        <circle
          cx={center}
          cy={center}
          r={silverRadius}
          fill="none"
          stroke="#C0C0C0"
          strokeWidth={strokeWidth}
          style={getProgressStyle(silverRadius, silverProgress)}
          className="transition-all duration-1000 ease-out"
        />

        {/* Bronze Ring */}
        <circle
          cx={center}
          cy={center}
          r={bronzeRadius}
          fill="none"
          stroke="#0B2349"
          strokeWidth={strokeWidth}
          className="opacity-20"
        />
        <circle
          cx={center}
          cy={center}
          r={bronzeRadius}
          fill="none"
          stroke="#CD7F32"
          strokeWidth={strokeWidth}
          style={getProgressStyle(bronzeRadius, bronzeProgress)}
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Medal Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-secondary text-2xl font-bold font-thuast">
            {getMedalText()}
          </div>
        </div>
      </div>
    </div>
  );
} 