
import React from 'react';
import { TripPlan } from '../types';

interface BudgetTabProps {
  plan: TripPlan | null;
}

const BudgetTab: React.FC<BudgetTabProps> = ({ plan }) => {
  const mockExpenses = [
    { category: '交通', amount: 15000, color: 'bg-blue-500' },
    { category: '住宿', amount: 22000, color: 'bg-indigo-500' },
    { category: '餐飲', amount: 12000, color: 'bg-orange-500' },
    { category: '景點門票', amount: 5000, color: 'bg-green-500' },
    { category: '購物', amount: 8000, color: 'bg-pink-500' },
  ];

  const total = mockExpenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="flex-1 flex flex-col bg-gray-50 p-6 overflow-y-auto">
      <div className="bg-indigo-900 rounded-3xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-indigo-200 text-sm uppercase tracking-widest font-semibold mb-2">預估總預算</p>
          <h2 className="text-4xl font-black mb-1">TWD {total.toLocaleString()}</h2>
          <p className="text-indigo-300 text-xs">基於您的 {plan?.days.length} 天行程規劃自動預估</p>
        </div>
        {/* Abstract background shape */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-800 rounded-full -mr-20 -mt-20 opacity-50 blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center">
            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2"></span>
            預算佔比
          </h3>
          <div className="space-y-4">
            {mockExpenses.map((item) => (
              <div key={item.category}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-600 font-medium">{item.category}</span>
                  <span className="text-gray-900 font-bold">{Math.round((item.amount / total) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`${item.color} h-full rounded-full transition-all duration-1000`} 
                    style={{ width: `${(item.amount / total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center">
            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2"></span>
            各項支出明細
          </h3>
          <div className="divide-y divide-gray-50">
            {mockExpenses.map((item) => (
              <div key={item.category} className="py-3 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg ${item.color.replace('bg-', 'bg-opacity-10 text-')} flex items-center justify-center font-bold text-lg`}>
                    •
                  </div>
                  <span className="text-sm text-gray-700">{item.category}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">NT$ {item.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-medium hover:bg-white hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center justify-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>新增手動支出項</span>
      </button>
    </div>
  );
};

export default BudgetTab;
