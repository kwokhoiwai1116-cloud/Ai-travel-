
import React from 'react';
import { Collaborator } from '../types';

interface CollabHeaderProps {
  collaborators: Collaborator[];
  planTitle: string;
  onSave?: () => void;
  onBack?: () => void;
  showBack?: boolean;
}

const CollabHeader: React.FC<CollabHeaderProps> = ({ collaborators, planTitle, onSave, onBack, showBack }) => {
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-gray-200 bg-white sticky top-0 z-30">
      <div className="flex items-center space-x-4">
        {showBack && (
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400 hover:text-indigo-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        )}
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100">
          GP
        </div>
        <div>
          <h1 className="text-lg font-black text-gray-900 truncate max-w-[150px] sm:max-w-md tracking-tight">
            {planTitle}
          </h1>
          {showBack && (
            <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest flex items-center">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></span>
              線上編輯中
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="hidden sm:flex items-center -space-x-2">
          {collaborators.map((c) => (
            <div 
              key={c.id} 
              className={`relative group cursor-pointer w-8 h-8 rounded-full border-2 border-white ring-2 ${c.isOnline ? 'ring-indigo-50' : 'ring-gray-50'}`}
            >
              <img src={c.avatar} alt={c.name} className={`w-full h-full rounded-full object-cover ${!c.isOnline && 'grayscale opacity-60'}`} />
              {c.isOnline && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {c.name}
              </div>
            </div>
          ))}
        </div>
        
        {showBack && (
          <button 
            onClick={onSave}
            className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all shadow-lg active:scale-95 uppercase tracking-widest"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            儲存
          </button>
        )}
      </div>
    </header>
  );
};

export default CollabHeader;
