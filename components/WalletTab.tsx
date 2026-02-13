
import React, { useState } from 'react';
import { Plus, ArrowDownLeft, ArrowUpRight, CreditCard, Wallet as WalletIcon, Settings, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Transaction } from '../types';

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'outgoing', title: 'MinimalStore Purchase', amount: 105.00, date: 'May 12, 2024', category: 'Shopping' },
  { id: '2', type: 'incoming', title: 'Sale: Vintage Lens', amount: 450.00, date: 'May 10, 2024', category: 'Earnings' },
  { id: '3', type: 'outgoing', title: 'Starbucks Coffee', amount: 5.45, date: 'May 08, 2024', category: 'Food' },
];

const CHART_DATA = [
  { value: 400 }, { value: 300 }, { value: 600 }, { value: 800 }, { value: 500 }, { value: 900 }, { value: 1100 },
];

const WalletTab: React.FC = () => {
  const [showFullBalance, setShowFullBalance] = useState(true);

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500">
      {/* Wallet Card */}
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <WalletIcon className="w-32 h-32" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-2 text-gray-400">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Current Balance</span>
            <button onClick={() => setShowFullBalance(!showFullBalance)}>
              {showFullBalance ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </button>
          </div>
          <h2 className="text-4xl font-black mb-10 tracking-tighter">
            {showFullBalance ? '$12,450.80' : '••••••••'}
          </h2>
          
          <div className="flex items-center space-x-4">
            <button className="flex-1 bg-white text-black py-3 rounded-2xl font-black text-xs flex items-center justify-center space-x-2 active:scale-95 transition-all">
              <Plus className="w-4 h-4" />
              <span>TOP UP</span>
            </button>
            <button className="flex-1 bg-white/10 backdrop-blur-md text-white py-3 rounded-2xl font-black text-xs flex items-center justify-center space-x-2 active:scale-95 transition-all">
              <ArrowUpRight className="w-4 h-4" />
              <span>SEND</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-black text-sm uppercase tracking-widest text-gray-400">Spending Trends</h3>
          <span className="text-xs font-bold text-green-500">+8.4% this week</span>
        </div>
        <div className="h-24 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CHART_DATA}>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#111827" 
                strokeWidth={2} 
                fillOpacity={0.05} 
                fill="#111827" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transaction Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-black text-sm uppercase tracking-widest text-gray-900">Recent Activity</h3>
          <button className="text-xs font-bold text-blue-600">See All</button>
        </div>
        
        {MOCK_TRANSACTIONS.map(tx => (
          <div key={tx.id} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-gray-100 group cursor-pointer active:bg-gray-50 transition-all">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl ${tx.type === 'incoming' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                {tx.type === 'incoming' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">{tx.title}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase">{tx.category} • {tx.date}</p>
              </div>
            </div>
            <div className={`font-black text-sm ${tx.type === 'incoming' ? 'text-green-600' : 'text-gray-900'}`}>
              {tx.type === 'incoming' ? '+' : '-'}${tx.amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalletTab;
