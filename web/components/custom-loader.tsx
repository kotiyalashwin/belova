import React from 'react';

export const Loader = ({ message = "Loading...", variant = "dots" }) => {
  if (variant === "dots") {
    return (
      <div className="flex flex-col items-center justify-center gap-6 p-8">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        {message && <p className="text-sm text-gray-400 animate-pulse">{message}</p>}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className="flex flex-col items-center justify-center gap-6 p-8">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"></div>
          <div className="absolute inset-2 rounded-full bg-blue-500/40 animate-ping" style={{ animationDelay: '200ms' }}></div>
          <div className="absolute inset-4 rounded-full bg-blue-500 animate-pulse"></div>
        </div>
        {message && <p className="text-sm text-gray-400 animate-pulse">{message}</p>}
      </div>
    );
  }

  if (variant === "bars") {
    return (
      <div className="flex flex-col items-center justify-center gap-6 p-8">
        <div className="flex gap-1.5 items-end h-12">
          <div className="w-2 bg-blue-500 rounded-full animate-[wave_1s_ease-in-out_infinite]" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 bg-blue-500 rounded-full animate-[wave_1s_ease-in-out_infinite]" style={{ animationDelay: '100ms' }}></div>
          <div className="w-2 bg-blue-500 rounded-full animate-[wave_1s_ease-in-out_infinite]" style={{ animationDelay: '200ms' }}></div>
          <div className="w-2 bg-blue-500 rounded-full animate-[wave_1s_ease-in-out_infinite]" style={{ animationDelay: '300ms' }}></div>
          <div className="w-2 bg-blue-500 rounded-full animate-[wave_1s_ease-in-out_infinite]" style={{ animationDelay: '400ms' }}></div>
        </div>
        {message && <p className="text-sm text-gray-400 animate-pulse">{message}</p>}
        <style>{`
          @keyframes wave {
            0%, 100% { height: 1rem; }
            50% { height: 3rem; }
          }
        `}</style>
      </div>
    );
  }

  if (variant === "orbit") {
    return (
      <div className="flex flex-col items-center justify-center gap-6 p-8">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-3 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          <div className="absolute inset-6 border-4 border-transparent border-t-pink-500 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
        </div>
        {message && <p className="text-sm text-gray-400 animate-pulse">{message}</p>}
      </div>
    );
  }

  if (variant === "square") {
    return (
      <div className="flex flex-col items-center justify-center gap-6 p-8">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 bg-blue-500/20 rounded animate-[squish_1.5s_ease-in-out_infinite]"></div>
          <div className="absolute inset-2 bg-blue-500/40 rounded animate-[squish_1.5s_ease-in-out_infinite]" style={{ animationDelay: '200ms' }}></div>
          <div className="absolute inset-4 bg-blue-500 rounded animate-[squish_1.5s_ease-in-out_infinite]" style={{ animationDelay: '400ms' }}></div>
        </div>
        {message && <p className="text-sm text-gray-400 animate-pulse">{message}</p>}
        <style>{`
          @keyframes squish {
            0%, 100% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(0.8) rotate(90deg); }
          }
        `}</style>
      </div>
    );
  }

  if (variant === "gradient") {
    return (
      <div className="flex flex-col items-center justify-center gap-6 p-8">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 animate-spin opacity-75"></div>
          <div className="absolute inset-1 rounded-full bg-gray-900"></div>
        </div>
        {message && <p className="text-sm text-gray-400 animate-pulse">{message}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin shadow-lg shadow-blue-500/50"></div>
      </div>
      {message && <p className="text-sm text-gray-400 animate-pulse">{message}</p>}
    </div>
  );
};

