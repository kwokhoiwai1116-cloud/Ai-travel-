
import React, { useState } from 'react';
import { ItineraryItem } from '../types';

interface MapSectionProps {
  selectedItem: ItineraryItem | null;
  favorites: ItineraryItem[];
  onSelectItem?: (item: ItineraryItem) => void;
}

const MapSection: React.FC<MapSectionProps> = ({ selectedItem, favorites, onSelectItem }) => {
  const [viewMode, setViewMode] = useState<'selected' | 'favorites'>('selected');

  if (!selectedItem && favorites.length === 0) {
    return (
      <div className="flex-1 bg-gray-50 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">請點選行程查看地點，或標記想去景點</p>
      </div>
    );
  }

  const mapTarget = selectedItem ? selectedItem.location : (favorites[0]?.location || '');
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapTarget)}&output=embed`;

  return (
    <div className="flex-1 relative bg-white overflow-hidden flex flex-col">
      {/* Map Control Tabs */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-center pointer-events-none">
        <div className="bg-white/90 backdrop-blur shadow-xl border border-white/50 p-1 rounded-2xl flex pointer-events-auto">
          <button 
            onClick={() => setViewMode('selected')}
            className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              viewMode === 'selected' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-50'
            }`}
          >
            當前選中
          </button>
          <button 
            onClick={() => setViewMode('favorites')}
            className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center space-x-1.5 ${
              viewMode === 'favorites' ? 'bg-rose-600 text-white' : 'text-gray-400 hover:bg-rose-50'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${viewMode === 'favorites' ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>想去清單 ({favorites.length})</span>
          </button>
        </div>
      </div>

      <iframe
        title="Location Map"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={mapUrl}
        className="opacity-95 flex-1"
      ></iframe>
      
      {/* View Logic */}
      {viewMode === 'selected' && selectedItem ? (
        <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 lg:right-auto pointer-events-none z-10">
          <div className="bg-white/95 backdrop-blur-md shadow-2xl border border-white rounded-[32px] w-full max-w-sm pointer-events-auto transform transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 overflow-hidden">
            {selectedItem.imageUrl && (
              <div className="w-full h-36 overflow-hidden relative">
                <img src={selectedItem.imageUrl} className="w-full h-full object-cover" alt={selectedItem.location} />
                {selectedItem.isFavorite && (
                  <div className="absolute top-4 left-4 bg-rose-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                    想去亮點
                  </div>
                )}
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-lg leading-tight">{selectedItem.location}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">當前選中地點</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-6 font-medium line-clamp-3">
                {selectedItem.description}
              </p>
              <div className="flex space-x-3">
                <button className="flex-1 bg-gray-900 text-white py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-colors shadow-lg shadow-gray-200">
                  開始導航
                </button>
                <button className="p-3 bg-white border border-gray-100 text-gray-900 rounded-2xl hover:bg-gray-50 transition-colors shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : viewMode === 'favorites' ? (
        <div className="absolute right-6 top-20 bottom-24 lg:top-20 lg:bottom-10 pointer-events-none z-10 flex flex-col w-full max-w-sm animate-in slide-in-from-right-4 duration-500">
          <div className="bg-white/95 backdrop-blur-md shadow-2xl border border-white rounded-[32px] h-full pointer-events-auto flex flex-col overflow-hidden">
            <div className="p-6 bg-rose-50/50 border-b border-rose-100 flex items-center justify-between">
              <div>
                <h3 className="font-black text-rose-600 text-lg uppercase tracking-tight">我的想去清單</h3>
                <p className="text-[10px] text-rose-400 font-black uppercase tracking-widest mt-0.5">My Travel Wishlist</p>
              </div>
              <div className="bg-rose-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-xs">
                {favorites.length}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {favorites.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <div className="w-16 h-16 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-sm font-medium">還沒有想去的景點嗎？<br/>在行程規劃中點選收藏按鈕！</p>
                </div>
              ) : (
                favorites.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => {
                      if (onSelectItem) onSelectItem(item);
                      setViewMode('selected');
                    }}
                    className={`flex items-center space-x-3 p-3 rounded-2xl border transition-all cursor-pointer group ${
                      selectedItem?.id === item.id ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-100 hover:border-rose-200 hover:bg-rose-50/30'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                      <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.location} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-gray-900 truncate">{item.location}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.time}</p>
                    </div>
                    <div className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-rose-500 group-hover:text-white transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {favorites.length > 0 && (
               <div className="p-4 bg-gray-50 border-t border-gray-100">
                  <button className="w-full py-3 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">
                    將所有想去點匯出至 Google Maps
                  </button>
               </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MapSection;
