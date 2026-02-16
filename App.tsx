
import React, { useState, useEffect, useMemo } from 'react';
import { TripPlan, ItineraryItem, Collaborator, ShoppingItem } from './types';
import { generateItinerary } from './services/geminiService';
import MapSection from './components/MapSection';
import PlanEditor from './components/PlanEditor';
import CollabHeader from './components/CollabHeader';
import CollaborationTab from './components/CollaborationTab';
import BudgetTab from './components/BudgetTab';

const MOCK_COLLABORATORS: Collaborator[] = [
  { id: '1', name: '小明', avatar: 'https://picsum.photos/seed/1/100/100', isOnline: true },
  { id: '2', name: '阿強', avatar: 'https://picsum.photos/seed/2/100/100', isOnline: true },
  { id: '3', name: '佳佳', avatar: 'https://picsum.photos/seed/3/100/100', isOnline: false },
];

type ViewTab = 'plan' | 'map' | 'budget' | 'collab' | 'shopping';

const App: React.FC = () => {
  const [plans, setPlans] = useState<TripPlan[]>([]);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ItineraryItem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<ViewTab>('plan');
  const [syncing, setSyncing] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);

  const currentPlan = useMemo(() => 
    plans.find(p => p.id === activePlanId) || null
  , [plans, activePlanId]);

  useEffect(() => {
    const saved = localStorage.getItem('trip_plans_library_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPlans(parsed);
      } catch (e) {
        console.error("Failed to parse plans library");
      }
    }
  }, []);

  useEffect(() => {
    if (plans.length > 0 || localStorage.getItem('trip_plans_library_v2')) {
      localStorage.setItem('trip_plans_library_v2', JSON.stringify(plans));
    }
  }, [plans]);

  const sortItems = (items: ItineraryItem[]) => {
    return [...items].sort((a, b) => a.time.localeCompare(b.time));
  };

  const favorites = useMemo(() => {
    if (!currentPlan) return [];
    return currentPlan.days.flatMap(d => d.items).filter(item => item.isFavorite);
  }, [currentPlan]);

  const handleCreatePlan = async (destination: string, days: number) => {
    setIsGenerating(true);
    try {
      const data = await generateItinerary(destination, days);
      const newPlan: TripPlan = {
        id: Date.now().toString(),
        title: data.title || `${destination} 之旅`,
        destination,
        startDate: new Date().toISOString().split('T')[0],
        summary: data.summary || "精彩的 AI 規劃旅程",
        weatherOverview: data.weatherOverview || "天氣穩定，適合旅遊",
        shoppingList: (data as any).recommendedShoppingItems?.map((name: string) => ({
          id: Math.random().toString(36).substr(2, 9),
          name,
          isBought: false
        })) || [],
        days: (data.days || []).map(d => ({
          ...d,
          items: sortItems(d.items.map((item: any) => {
            const seed = Math.floor(Math.random() * 1000);
            return { 
              ...item, 
              id: Math.random().toString(36).substr(2, 9),
              time: item.time.match(/\d{2}:\d{2}/) ? item.time : "09:00",
              imageUrl: `https://picsum.photos/seed/${seed}/800/600`,
              isFavorite: false
            };
          }))
        }))
      };
      setPlans(prev => [newPlan, ...prev]);
      setActivePlanId(newPlan.id);
      if (newPlan.days.length > 0 && newPlan.days[0].items.length > 0) {
        setSelectedItem(newPlan.days[0].items[0]);
      }
      setActiveTab('plan');
    } catch (error) {
      console.error("Failed to generate plan:", error);
      alert("生成行程失敗，請稍後再試。");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleShoppingItem = (itemId: string) => {
    if (!activePlanId) return;
    setPlans(prev => prev.map(p => {
      if (p.id !== activePlanId) return p;
      return {
        ...p,
        shoppingList: p.shoppingList.map(item => 
          item.id === itemId ? { ...item, isBought: !item.isBought } : item
        )
      };
    }));
  };

  const addShoppingItem = (name: string) => {
    if (!activePlanId || !name.trim()) return;
    const newItem: ShoppingItem = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      isBought: false
    };
    setPlans(prev => prev.map(p => {
      if (p.id !== activePlanId) return p;
      return { ...p, shoppingList: [...p.shoppingList, newItem] };
    }));
  };

  const handleDeletePlan = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('確定要刪除這個行程嗎？')) {
      setPlans(prev => prev.filter(p => p.id !== id));
      if (activePlanId === id) setActivePlanId(null);
    }
  };

  const handleSavePlan = () => {
    setSyncing(true);
    localStorage.setItem('trip_plans_library_v2', JSON.stringify(plans));
    setTimeout(() => {
      setSyncing(false);
      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 2000);
    }, 800);
  };

  const updateItem = (dayIndex: number, itemId: string, updates: Partial<ItineraryItem>) => {
    if (!activePlanId) return;
    setSyncing(true);
    setPlans(prev => prev.map(plan => {
      if (plan.id !== activePlanId) return plan;
      const newDays = [...plan.days];
      const itemIndex = newDays[dayIndex].items.findIndex(i => i.id === itemId);
      if (itemIndex > -1) {
        newDays[dayIndex].items[itemIndex] = { ...newDays[dayIndex].items[itemIndex], ...updates };
        newDays[dayIndex].items = sortItems(newDays[dayIndex].items);
      }
      return { ...plan, days: newDays };
    }));
    setTimeout(() => setSyncing(false), 500);
  };

  const toggleFavorite = (itemId: string) => {
    if (!activePlanId) return;
    setSyncing(true);
    setPlans(prev => prev.map(plan => {
      if (plan.id !== activePlanId) return plan;
      const newDays = plan.days.map(day => ({
        ...day,
        items: day.items.map(item => 
          item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
        )
      }));
      return { ...plan, days: newDays };
    }));
    setTimeout(() => setSyncing(false), 300);
  };

  const addItem = (dayIndex: number) => {
    if (!activePlanId) return;
    setSyncing(true);
    const seed = Math.floor(Math.random() * 1000);
    const newItem: ItineraryItem = {
      id: Math.random().toString(36).substr(2, 9),
      time: "10:00",
      location: "新景點",
      description: "請輸入景點描述...",
      imageUrl: `https://picsum.photos/seed/${seed}/800/600`,
      isFavorite: false
    };

    setPlans(prev => prev.map(plan => {
      if (plan.id !== activePlanId) return plan;
      const newDays = [...plan.days];
      newDays[dayIndex].items.push(newItem);
      newDays[dayIndex].items = sortItems(newDays[dayIndex].items);
      return { ...plan, days: newDays };
    }));
    setSelectedItem(newItem);
    setTimeout(() => setSyncing(false), 800);
  };

  const renderContent = () => {
    if (!activePlanId && !isGenerating) {
      return (
        <PlanEditor 
          plan={null} 
          plans={plans}
          isGenerating={false}
          onCreate={handleCreatePlan}
          onSelectPlan={setActivePlanId}
          onDeletePlan={handleDeletePlan}
          onSelectItem={setSelectedItem}
          onUpdateItem={updateItem}
          onAddItem={() => {}}
          onToggleFavorite={() => {}}
        />
      );
    }

    if (isGenerating) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center bg-white">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-900 mt-8 mb-2">AI 正在規劃您的夢幻行程</h3>
          <p className="text-gray-500 max-w-xs leading-relaxed">正在為您預測天氣並準備必買清單...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'plan':
        return (
          <PlanEditor 
            plan={currentPlan} 
            plans={plans}
            isGenerating={false}
            onCreate={handleCreatePlan}
            onSelectPlan={setActivePlanId}
            onDeletePlan={handleDeletePlan}
            onSelectItem={setSelectedItem}
            onUpdateItem={updateItem}
            onAddItem={addItem}
            onToggleFavorite={toggleFavorite}
            selectedItemId={selectedItem?.id}
          />
        );
      case 'map':
        return (
          <MapSection 
            selectedItem={selectedItem} 
            favorites={favorites}
            onSelectItem={setSelectedItem}
          />
        );
      case 'shopping':
        return (
          <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-orange-100 text-orange-600 p-3 rounded-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900">必買清單</h2>
                  <p className="text-gray-500 text-sm font-medium">記錄您的購物冒險</p>
                </div>
              </div>

              <div className="bg-white rounded-[32px] p-8 shadow-xl border border-gray-100 mb-8">
                <div className="flex mb-6">
                  <input 
                    type="text" 
                    id="newShoppingItem"
                    placeholder="新增清單項目..."
                    className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-indigo-100 outline-none font-bold"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addShoppingItem((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                </div>

                <div className="space-y-3">
                  {currentPlan?.shoppingList.map(item => (
                    <div 
                      key={item.id}
                      onClick={() => toggleShoppingItem(item.id)}
                      className={`flex items-center p-4 rounded-2xl border transition-all cursor-pointer ${
                        item.isBought ? 'bg-gray-50 border-gray-100' : 'bg-white border-indigo-50 hover:border-indigo-200'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg border-2 mr-4 flex items-center justify-center transition-all ${
                        item.isBought ? 'bg-green-500 border-green-500 text-white' : 'border-gray-200'
                      }`}>
                        {item.isBought && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                      </div>
                      <span className={`font-bold ${item.isBought ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'budget':
        return <BudgetTab plan={currentPlan} />;
      case 'collab':
        return <CollaborationTab collaborators={MOCK_COLLABORATORS} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white selection:bg-indigo-100">
      <CollabHeader 
        collaborators={MOCK_COLLABORATORS} 
        planTitle={currentPlan?.title || "AI 旅遊規劃系統"} 
        onSave={handleSavePlan}
        onBack={() => setActivePlanId(null)}
        showBack={!!activePlanId}
      />

      {syncing && (
        <div className="fixed top-20 right-6 z-50 transition-all duration-300">
          <div className="bg-gray-900 text-white px-4 py-2 rounded-2xl shadow-2xl text-[10px] font-black uppercase tracking-widest flex items-center space-x-3 border border-gray-800">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
            <span>同步中</span>
          </div>
        </div>
      )}

      {showSaveToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-2xl font-bold flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>所有行程已儲存！</span>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden relative">
        <div className="flex-1 flex flex-col overflow-hidden">
          {renderContent()}
        </div>

        {currentPlan && activeTab === 'plan' && (
          <div className="hidden lg:flex lg:w-[450px] xl:w-[600px] border-l border-gray-100 flex-col">
            <MapSection 
              selectedItem={selectedItem} 
              favorites={favorites} 
              onSelectItem={setSelectedItem}
            />
          </div>
        )}
      </div>

      {activePlanId && (
        <nav className="h-16 md:h-20 bg-white border-t border-gray-100 flex items-center justify-around px-2 z-40">
          <NavButton active={activeTab === 'plan'} onClick={() => setActiveTab('plan')} label="行程" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>} />
          <NavButton active={activeTab === 'map'} onClick={() => setActiveTab('map')} label="地圖" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
          <NavButton active={activeTab === 'shopping'} onClick={() => setActiveTab('shopping')} label="必買" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>} />
          <NavButton active={activeTab === 'budget'} onClick={() => setActiveTab('budget')} label="預算" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
          <NavButton active={activeTab === 'collab'} onClick={() => setActiveTab('collab')} label="協作" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
        </nav>
      )}
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, label, icon }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center space-y-1 transition-all flex-1 py-1 ${active ? 'text-indigo-600 font-bold' : 'text-gray-400 hover:text-gray-600'}`}
  >
    <div className={`p-1 rounded-lg transition-colors ${active ? 'bg-indigo-50' : ''}`}>
      {icon}
    </div>
    <span className="text-[10px] md:text-xs uppercase tracking-wider">{label}</span>
  </button>
);

export default App;
