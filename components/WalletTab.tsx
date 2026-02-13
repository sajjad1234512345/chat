
import React, { useState } from 'react';
import { 
  Plus, ArrowDownLeft, ArrowUpRight, Repeat, FileText, ChevronRight, 
  CreditCard, Wallet as WalletIcon, Settings, Lock, Eye, EyeOff, MoreHorizontal
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from '../types';

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'outgoing', title: 'MinimalStore Purchase', amount: 105.00, date: 'May 12, 2024', category: 'Shopping' },
  { id: '2', type: 'incoming', title: 'Sale: Vintage Lens', amount: 450.00, date: 'May 10, 2024', category: 'Earnings' },
  { id: '3', type: 'outgoing', title: 'Starbucks Coffee', amount: 5.45, date: 'May 08, 2024', category: 'Food' },
  { id: '4', type: 'incoming', title: 'Account Top-up', amount: 1000.00, date: 'May 05, 2024', category: 'Deposit' },
];

const CHART_DATA = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 600 },
  { name: 'Thu', value: 800 },
  { name: 'Fri', value: 500 },
  { name: 'Sat', value: 900 },
  { name: 'Sun', value: 1100 },
];

interface DigitalCard {
  id: string;
  type: 'visa' | 'mastercard';
  number: string;
  expiry: string;
  cardholder: string;
  color: string;
  balance: number;
}

const USER_CARDS: DigitalCard[] = [
  {
    id: 'c1',
    type: 'visa',
    number: '**** **** **** 4290',
    expiry: '12/26',
    cardholder: 'HIRA RAHMAN',
    color: 'from-blue-600 to-indigo-700',
    balance: 5420.50
  },
  {
    id: 'c2',
    type: 'mastercard',
    number: '**** **** **** 8812',
    expiry: '08/25',
    cardholder: 'HIRA RAHMAN',
    color: 'from-orange-500 to-red-600',
    balance: 2100.25
  },
  {
    id: 'c3',
    type: 'visa',
    number: '**** **** **** 3341',
    expiry: '03/27',
    cardholder: 'HIRA RAHMAN',
    color: 'from-emerald-500 to-teal-700',
    balance: 125.00
  }
];

const WalletTab: React.FC = () => {
  const [showFullBalance, setShowFullBalance] = useState(true);

  return (
    <div className="p-6 max-w-lg mx-auto bg-white min-h-screen">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold">Wallet</h2>
          <p className="text-xs text-gray-400 font-medium mt-1">Manage your funds and cards</p>
        </div>
        <div className="flex space-x-2">
          <button className="p-2.5 bg-gray-50 rounded-2xl border border-gray-100 text-gray-600 hover:bg-gray-100 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <div className="p-2.5 bg-pink-50 rounded-2xl border border-pink-100">
            <CreditCard className="w-5 h-5 text-pink-600" />
          </div>
        </div>
      </header>

      {/* Main Balance Card */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-[2.5rem] p-8 text-white mb-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
        <div className="absolute top-0 right-0 p-8 opacity-20">
          <WalletIcon className="w-24 h-24" />
        </div>
        
        <div className="flex items-center space-x-2 mb-2">
          <p className="text-white/80 text-sm">Total Balance</p>
          <button onClick={() => setShowFullBalance(!showFullBalance)} className="opacity-60 hover:opacity-100 transition-opacity">
            {showFullBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>

        <h3 className="text-4xl font-black mb-8 transition-all">
          {showFullBalance ? '$12,450.80' : '••••••••'}
        </h3>

        <div className="flex space-x-4">
          <button className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl py-3 flex flex-col items-center transition-all hover:translate-y-[-2px]">
            <ArrowUpRight className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-black uppercase tracking-widest">Send</span>
          </button>
          <button className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl py-3 flex flex-col items-center transition-all hover:translate-y-[-2px]">
            <ArrowDownLeft className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-black uppercase tracking-widest">Receive</span>
          </button>
          <button className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl py-3 flex flex-col items-center transition-all hover:translate-y-[-2px]">
            <Repeat className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-black uppercase tracking-widest">Swap</span>
          </button>
        </div>
      </div>

      {/* My Cards Section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-5">
          <h4 className="font-bold text-gray-800 text-lg">My Cards</h4>
          <button className="flex items-center space-x-1 text-pink-600 font-bold text-xs bg-pink-50 px-3 py-1.5 rounded-xl hover:bg-pink-100 transition-colors">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Card</span>
          </button>
        </div>

        <div className="flex overflow-x-auto space-x-5 pb-4 scrollbar-hide px-1">
          {USER_CARDS.map((card) => (
            <div 
              key={card.id} 
              className={`flex-shrink-0 w-72 h-44 rounded-3xl bg-gradient-to-br ${card.color} p-6 text-white shadow-xl relative overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer`}
            >
              {/* Card Patterns */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-7 bg-white/20 rounded-md backdrop-blur-sm border border-white/30 flex items-center justify-center">
                   <div className="w-6 h-4 border-l border-r border-white/40"></div>
                </div>
                <div className="font-bold italic text-xl opacity-90">
                  {card.type === 'visa' ? 'VISA' : 'mastercard'}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-white/60 text-[10px] font-bold tracking-widest uppercase mb-1">Balance</p>
                <p className="text-lg font-bold">${card.balance.toLocaleString()}</p>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-medium tracking-widest">{card.number}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/50 text-[8px] font-bold uppercase">Exp</p>
                  <p className="text-[10px] font-bold">{card.expiry}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spending Analytics */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-5">
          <h4 className="font-bold text-gray-800 text-lg">Weekly Insights</h4>
          <div className="flex space-x-2">
            <button className="text-[10px] font-bold text-pink-600 bg-pink-50 px-2 py-1 rounded-lg">Income</button>
            <button className="text-[10px] font-bold text-gray-400">Expense</button>
          </div>
        </div>
        <div className="h-48 w-full bg-gray-50 rounded-[2.5rem] p-6 border border-gray-100/50">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CHART_DATA}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" strokeOpacity={0.3} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#ec4899" 
                strokeWidth={4} 
                fillOpacity={1} 
                fill="url(#colorValue)" 
                animationDuration={2000}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '20px', 
                  border: 'none', 
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                  padding: '12px'
                }} 
                itemStyle={{ fontSize: '12px', fontWeight: 'black', color: '#ec4899' }}
                labelStyle={{ fontSize: '10px', color: '#9ca3af', marginBottom: '4px', fontWeight: 'bold' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="pb-8">
        <div className="flex justify-between items-center mb-5">
          <h4 className="font-bold text-gray-800 text-lg">Transactions</h4>
          <button className="text-pink-600 text-xs font-bold hover:underline">See All</button>
        </div>
        <div className="space-y-4">
          {MOCK_TRANSACTIONS.map(tx => (
            <div key={tx.id} className="flex items-center justify-between p-4 bg-white rounded-3xl border border-gray-100 hover:border-pink-100 transition-colors cursor-pointer group shadow-sm">
              <div className="flex items-center space-x-4">
                <div className={`p-3.5 rounded-2xl ${tx.type === 'incoming' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {tx.type === 'incoming' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                <div>
                  <h5 className="font-bold text-sm text-gray-900 group-hover:text-pink-600 transition-colors">{tx.title}</h5>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{tx.category} • {tx.date}</p>
                </div>
              </div>
              <div className={`font-black text-sm ${tx.type === 'incoming' ? 'text-green-600' : 'text-gray-900'}`}>
                {tx.type === 'incoming' ? '+' : '-'}${tx.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletTab;
