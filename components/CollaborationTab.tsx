
import React from 'react';
import { Collaborator } from '../types';

interface CollaborationTabProps {
  collaborators: Collaborator[];
}

const CollaborationTab: React.FC<CollaborationTabProps> = ({ collaborators }) => {
  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      <div className="p-6 bg-white border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">協作成員</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {collaborators.map((c) => (
            <div key={c.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-3">
              <div className="relative">
                <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full object-cover" />
                <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${c.isOnline ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{c.name}</p>
                <p className="text-[10px] text-gray-500">{c.isOnline ? '正在線上' : '最後上線：2小時前'}</p>
              </div>
            </div>
          ))}
          <button className="border-2 border-dashed border-gray-200 rounded-xl p-3 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-200 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        <h3 className="text-lg font-bold text-gray-800 mb-4">群組討論區</h3>
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            <div className="flex items-start space-x-3">
              <img src={collaborators[0].avatar} className="w-8 h-8 rounded-full" />
              <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none max-w-[80%]">
                <p className="text-xs font-bold mb-1">{collaborators[0].name}</p>
                <p className="text-sm text-gray-700">我覺得第二天的下午可以多排一個咖啡廳？</p>
              </div>
            </div>
            <div className="flex items-start justify-end space-x-3">
              <div className="bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-none max-w-[80%]">
                <p className="text-sm">好主意！我來看看地圖上有什麼推薦的。</p>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-50 flex items-center space-x-2">
            <input 
              type="text" 
              placeholder="輸入訊息..." 
              className="flex-1 bg-gray-50 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
            />
            <button className="bg-indigo-600 text-white p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationTab;
