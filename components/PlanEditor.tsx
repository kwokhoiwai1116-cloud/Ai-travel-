
import React, { useState } from 'react';
import { TripPlan, ItineraryItem } from '../types';

interface PlanEditorProps {
  plan: TripPlan | null;
  plans: TripPlan[];
  isGenerating: boolean;
  onCreate: (destination: string, days: number) => void;
  onSelectPlan: (id: string) => void;
  onDeletePlan: (id: string, e: React.MouseEvent) => void;
  onSelectItem: (item: ItineraryItem) => void;
  onUpdateItem: (dayIndex: number, itemId: string, updates: Partial<ItineraryItem>) => void;
  onAddItem: (dayIndex: number) => void;
  onToggleFavorite: (itemId: string) => void;
  selectedItemId?: string;
}

const WeatherIcon = ({ condition }: { condition: string }) => {
  const c = condition.toLowerCase();
  if (c.includes('晴') || c.includes('sun')) return <span className="text-amber-500">☀️</span>;
  if (c.includes('雨') || c.includes('rain')) return <span className="text-blue-500">🌧️</span>;
  if (c.includes('雲') || c.includes('cloud')) return <span className="text-gray-500">☁️</span>;
  if (c.includes('雪') || c.includes('snow')) return <span className="text-indigo-200">❄️</span>;
  return <span className="text-yellow-400">🌤️</span>;
};

const PlanEditor: React.FC<PlanEditorProps> = ({ 
  plan, plans, isGenerating, onCreate, onSelectPlan, onDeletePlan, 
  onSelectItem, onUpdateItem, onAddItem, onToggleFavorite, selectedItemId 
}) => {
  const [destinationInput, setDestinationInput] = useState('');
  const [daysInput, setDaysInput] = useState(3);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleStartPlanning = () => {
    if (destinationInput.trim()) {
      onCreate(destinationInput, daysInput);
      setShowCreateForm(false);
    }
  };

  if (!plan && !isGenerating) {
    if (!showCreateForm && plans.length > 0) {
      return (
        <div className="flex-1 flex flex-col bg-gray-50 overflow-y-auto p-6 md:p-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">我的旅遊圖書館</h2>
              <p className="text-gray-500 font-medium">總共管理 {plans.length} 個精彩行程</p>
            </div>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="bg-indigo-600 text-white p-4 rounded-2xl shadow-xl hover:bg-indigo-700 transition-all flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="font-bold text-sm uppercase tracking-widest hidden sm:inline">新行程</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {plans.map((p) => (
              <div 
                key={p.id}
                onClick={() => onSelectPlan(p.id)}
                className="group bg-white rounded-[32px] border border-gray-100 p-8 cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full relative"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 012.5 2.5V14a2 2 0 002 2h.5m-9-10a9 9 0 119 9" />
                    </svg>
                  </div>
                  <button 
                    onClick={(e) => onDeletePlan(p.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-rose-500 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight">{p.title}</h3>
                <p className="text-xs text-gray-400 font-medium mb-4 line-clamp-2 italic">「{p.summary}」</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">{p.destination}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-500 px-2.5 py-1 rounded-full">{p.days.length} 天</span>
                </div>

                <div className="bg-amber-50/50 p-3 rounded-2xl mb-6">
                  <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1 flex items-center">
                    <span className="mr-1">🌡️</span> 當地天氣概況
                  </p>
                  <p className="text-[10px] text-amber-700 font-bold leading-tight line-clamp-2">{p.weatherOverview}</p>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                      <img src="https://picsum.photos/seed/me/40/40" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="text-indigo-600 group-hover:translate-x-1 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 text-center bg-white overflow-y-auto">
        <div className="w-24 h-24 bg-indigo-50 rounded-3xl flex items-center justify-center mb-8 rotate-3 shadow-inner">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">開啟 AI 冒險旅程</h2>
        <p className="text-gray-500 mb-10 max-w-sm leading-relaxed text-lg">輸入您想去的地方，我們會立刻為您生成專屬行程與天氣預報。</p>
        
        <div className="w-full max-w-md space-y-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="目的地？(例如：倫敦、冰島...)"
              value={destinationInput}
              onChange={(e) => setDestinationInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStartPlanning()}
              className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-bold text-gray-800 text-lg shadow-sm"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl">
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">行程天數</span>
              <span className="text-lg font-black text-indigo-600">{daysInput} 天</span>
            </div>
            <div className="flex-1 px-6">
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={daysInput} 
                onChange={(e) => setDaysInput(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {plans.length > 0 && (
              <button 
                onClick={() => setShowCreateForm(false)}
                className="flex-1 bg-white text-gray-400 border border-gray-100 font-bold py-5 px-6 rounded-2xl hover:text-gray-600 transition-all uppercase tracking-widest text-sm"
              >
                返回列表
              </button>
            )}
            <button 
              onClick={handleStartPlanning}
              disabled={!destinationInput.trim()}
              className="flex-[2] bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-black py-5 px-10 rounded-2xl transition-all shadow-xl shadow-indigo-100 active:scale-95 uppercase tracking-wider flex items-center justify-center space-x-2"
            >
              <span>開始 AI 規劃</span>
            </button>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-2">
            {['東京', '巴黎', '北海道', '瑞士'].map(city => (
              <button 
                key={city}
                onClick={() => setDestinationInput(city)}
                className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-gray-100 text-gray-500 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                # {city}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      <div className="p-6 md:p-8 bg-white border-b border-gray-50 relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded uppercase tracking-widest">
              {plan?.destination}
            </span>
            <span className="inline-block px-2.5 py-1 bg-gray-50 text-gray-500 text-[10px] font-black rounded uppercase tracking-widest">
              {plan?.days.length} DAYS
            </span>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="text-xs font-bold text-gray-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
          >
            Reset
          </button>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-none">{plan?.title}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-12 custom-scrollbar">
        {plan?.days.map((day, dayIdx) => (
          <div key={day.day}>
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-white/80 backdrop-blur-md py-3 z-10 -mx-4 px-4">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-900 text-white text-xs font-black w-10 h-10 rounded-2xl flex items-center justify-center rotate-3 shadow-lg">
                  D{day.day}
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 leading-none flex items-center">
                    DAY {day.day} 
                    {day.weather && (
                      <span className="ml-3 text-sm flex items-center bg-indigo-50/50 px-2 py-1 rounded-lg">
                        <WeatherIcon condition={day.weather.condition} />
                        <span className="ml-1.5 text-indigo-600 font-bold">{day.weather.temp}</span>
                      </span>
                    )}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Adventure Timeline</p>
                </div>
              </div>
              <button 
                onClick={() => onAddItem(dayIdx)}
                className="bg-indigo-50 text-indigo-600 p-2 rounded-xl hover:bg-indigo-100 transition-colors border border-indigo-100 flex items-center space-x-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">新增行程</span>
              </button>
            </div>

            <div className="space-y-4 md:ml-5 border-l-2 border-dashed border-gray-100 md:pl-8 pl-4">
              {day.items.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className={`group relative p-0 rounded-3xl cursor-pointer transition-all duration-300 border overflow-hidden ${
                    selectedItemId === item.id 
                    ? 'bg-white border-indigo-500 shadow-2xl shadow-indigo-100 -translate-y-1' 
                    : 'bg-white border-gray-100 hover:border-indigo-200 shadow-sm'
                  }`}
                >
                  {selectedItemId === item.id ? (
                    <div className="p-6 space-y-5 animate-in fade-in duration-300">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex flex-col space-y-1.5">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">開始時間</label>
                          <input 
                            type="time" 
                            value={item.time} 
                            onChange={(e) => onUpdateItem(dayIdx, item.id, { time: e.target.value })}
                            className="w-full px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700 font-black text-sm focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5 sm:col-span-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">景點名稱</label>
                          <input 
                            type="text" 
                            value={item.location} 
                            placeholder="輸入地點..."
                            onChange={(e) => onUpdateItem(dayIdx, item.id, { location: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 font-bold text-sm focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                          />
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">圖片 URL</label>
                        <input 
                          type="text" 
                          value={item.imageUrl || ''} 
                          placeholder="https://..."
                          onChange={(e) => onUpdateItem(dayIdx, item.id, { imageUrl: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 font-bold text-sm focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                        />
                      </div>

                      <div className="flex flex-col space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">行程說明</label>
                        <textarea 
                          value={item.description}
                          placeholder="描述這段旅程..."
                          onChange={(e) => onUpdateItem(dayIdx, item.id, { description: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-600 focus:ring-4 focus:ring-indigo-100 outline-none min-h-[100px] leading-relaxed transition-all"
                        />
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(item.id);
                          }}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            item.isFavorite 
                            ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                            : 'bg-gray-50 text-gray-500 border border-gray-100 hover:bg-rose-50 hover:text-rose-400'
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${item.isFavorite ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span>{item.isFavorite ? '想去！' : '標記為想去'}</span>
                        </button>
                        <span className="text-[10px] text-gray-400 italic font-medium">編輯完成後將自動儲存並排序</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row">
                      {item.imageUrl && (
                        <div className="w-full sm:w-32 h-32 sm:h-auto overflow-hidden relative">
                          <img 
                            src={item.imageUrl} 
                            alt={item.location} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {item.isFavorite && (
                            <div className="absolute top-2 left-2 bg-rose-500 text-white p-1 rounded-full shadow-lg">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 fill-current" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.657 0L10 6.343l1.172-1.171a4 4 0 115.657 5.657L10 17.657l-6.828-6.829a4 4 0 010-5.657z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="p-6 flex-1 flex flex-col justify-center">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest bg-gray-900 text-white">
                              {item.time}
                            </span>
                            {item.isFavorite && (
                              <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">
                                Wishlist
                              </span>
                            )}
                          </div>
                          <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               onToggleFavorite(item.id);
                             }}
                             className={`p-1.5 rounded-lg transition-colors ${item.isFavorite ? 'text-rose-500 hover:bg-rose-50' : 'text-gray-300 hover:bg-gray-50'}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${item.isFavorite ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                        </div>
                        <h4 className="text-lg font-black text-gray-900 mb-2 leading-tight">{item.location}</h4>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium line-clamp-2">{item.description}</p>
                      </div>
                      
                      <div className={`absolute top-1/2 -translate-y-1/2 -right-3 w-10 h-10 rounded-2xl shadow-lg flex items-center justify-center transition-all bg-white/80 backdrop-blur text-gray-300 border border-gray-100 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanEditor;
