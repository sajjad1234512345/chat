
import React, { useState } from 'react';
import { 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCcw, 
  Settings, 
  Eye, 
  EyeOff, 
  CreditCard,
  Wallet as WalletIcon
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, CartesianGrid } from 'recharts';

const CHART_DATA = [
  { value: 400 }, { value: 380 }, { value: 600 }, { value: 500 }, { value: 700 }, { value: 650 }, { value: 950 }, { value: 900 }, { value: 1100 },
];

const MOCK_TRANSACTIONS = [
  { id: 't1', title: 'MinimalStore Purchase', category: 'SHOPPING', date: 'MAY 12, 2024', amount: -105.00, type: 'outgoing' },
  { id: 't2', title: 'Sale: Vintage Lens', category: 'EARNINGS', date: 'MAY 10, 2024', amount: 450.00, type: 'incoming' },
  { id: 't3', title: 'Starbucks Coffee', category: 'FOOD', date: 'MAY 08, 2024', amount: -5.45, type: 'outgoing' },
  { id: 't4', title: 'Account Top-up', category: 'DEPOSIT', date: 'MAY 05, 2024', amount: 1000.00, type: 'incoming' },
];

const WalletTab: React.FC = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [activeInsight, setActiveInsight] = useState<'income' | 'expense'>('income');

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-32 animate-in fade-in duration-500">
      {/* Header Section */}
      <header className="px-6 pt-8 pb-4 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Wallet</h1>
          <p className="text-sm text-gray-400 font-medium mt-1">Manage your funds and cards</p>
        </div>
        <div className="flex space-x-3">
          <button className="w-10 h-10 rounded-full border border-gray-100 bg-white flex items-center justify-center shadow-sm text-gray-500 active:scale-95 transition-all">
            <Settings className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-2xl bg-pink-50 flex items-center justify-center shadow-sm text-pink-500 active:scale-95 transition-all">
            <CreditCard className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Total Balance Card */}
      <section className="px-6 mb-10">
        <div className="relative rounded-[2.5rem] p-8 text-white overflow-hidden shadow-2xl shadow-indigo-100 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
          <div className="absolute top-4 right-4 opacity-20 transform translate-x-4 -translate-y-4">
             <WalletIcon className="w-48 h-48" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs font-bold text-white/80">Total Balance</span>
              <button onClick={() => setShowBalance(!showBalance)} className="text-white/60">
                {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
            <h2 className="text-4xl font-black mb-8 tracking-tighter">
              {showBalance ? '$12,450.80' : '••••••••'}
            </h2>

            <div className="grid grid-cols-3 gap-3">
              <ActionButton icon={ArrowUpRight} label="SEND" />
              <ActionButton icon={ArrowDownLeft} label="RECEIVE" />
              <ActionButton icon={RefreshCcw} label="SWAP" />
            </div>
          </div>
        </div>
      </section>

      {/* My Cards Section */}
      <section className="mb-10">
        <div className="px-6 flex justify-between items-center mb-5">
          <h3 className="text-xl font-black text-gray-900">My Cards</h3>
          <button className="bg-pink-50 text-pink-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center space-x-1.5 active:scale-95 transition-all">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Card</span>
          </button>
        </div>

        <div className="flex space-x-4 overflow-x-auto px-6 scrollbar-hide py-2">
          {/* Card 1 - Blue */}
          <div className="min-w-[280px] h-48 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-7 text-white relative flex flex-col justify-between shadow-2xl shadow-blue-100/50 group cursor-pointer hover:scale-[1.02] transition-all">
            <div className="flex justify-between items-start">
              <div className="w-12 h-8 bg-white/20 rounded-lg backdrop-blur-md flex items-center justify-center border border-white/10">
                <div className="grid grid-cols-2 gap-0.5 px-2">
                   <div className="w-2 h-1 bg-white/40 rounded-sm" />
                   <div className="w-2 h-1 bg-white/40 rounded-sm" />
                   <div className="w-2 h-1 bg-white/40 rounded-sm" />
                   <div className="w-2 h-1 bg-white/40 rounded-sm" />
                </div>
              </div>
              <span className="italic font-black text-2xl opacity-90 tracking-tighter">VISA</span>
            </div>
            <div>
              <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">BALANCE</p>
              <p className="text-2xl font-black mb-6 tracking-tight">$5,420.50</p>
              <div className="flex justify-between items-end">
                <p className="text-[11px] font-bold tracking-[0.2em] opacity-80">**** **** **** 4290</p>
                <div className="text-right">
                  <p className="text-[7px] font-black opacity-40 uppercase">EXP</p>
                  <p className="text-[11px] font-bold">12/26</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 - Orange */}
          <div className="min-w-[280px] h-48 rounded-[2.5rem] bg-gradient-to-br from-orange-500 to-red-600 p-7 text-white relative flex flex-col justify-between shadow-2xl shadow-orange-100/50 group cursor-pointer hover:scale-[1.02] transition-all">
             <div className="flex justify-between items-start">
              <div className="w-12 h-8 bg-white/20 rounded-lg backdrop-blur-md flex items-center justify-center border border-white/10">
                 <div className="grid grid-cols-2 gap-0.5 px-2">
                   <div className="w-2 h-1 bg-white/40 rounded-sm" />
                   <div className="w-2 h-1 bg-white/40 rounded-sm" />
                </div>
              </div>
              <div className="flex space-x-[-10px]">
                <div className="w-7 h-7 rounded-full bg-red-400 opacity-80" />
                <div className="w-7 h-7 rounded-full bg-yellow-400 opacity-80" />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">BALANCE</p>
              <p className="text-2xl font-black mb-6 tracking-tight">$2,100.25</p>
              <div className="flex justify-between items-end">
                <p className="text-[11px] font-bold tracking-[0.2em] opacity-80">**** **** **** 8812</p>
                <div className="text-right">
                  <p className="text-[7px] font-black opacity-40 uppercase">EXP</p>
                  <p className="text-[11px] font-bold">04/28</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Insights Matching reference */}
      <section className="px-6 mb-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Weekly Insights</h3>
          <div className="flex space-x-4">
            <button 
              onClick={() => setActiveInsight('income')}
              className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-lg transition-all ${activeInsight === 'income' ? 'text-pink-600 bg-pink-50' : 'text-gray-300'}`}
            >
              Income
            </button>
            <button 
              onClick={() => setActiveInsight('expense')}
              className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-lg transition-all ${activeInsight === 'expense' ? 'text-pink-600 bg-pink-50' : 'text-gray-300'}`}
            >
              Expense
            </button>
          </div>
        </div>

        <div className="bg-white p-4 pt-10 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col h-64 relative overflow-hidden group">
          <div className="flex-grow w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EC4899" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="5 5" stroke="#f1f1f1" />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#EC4899" 
                  strokeWidth={5} 
                  fillOpacity={1} 
                  fill="url(#chartGradient)" 
                  isAnimationActive={true}
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Transactions List */}
      <section className="px-6 mb-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-gray-900">Transactions</h3>
          <button className="text-pink-600 text-[10px] font-black uppercase tracking-widest">See All</button>
        </div>

        <div className="space-y-4">
          {MOCK_TRANSACTIONS.map((tx) => (
            <div key={tx.id} className="bg-white p-5 rounded-[2rem] border border-gray-100 flex items-center justify-between shadow-sm active:scale-[0.98] transition-all cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === 'outgoing' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                  {tx.type === 'outgoing' ? <ArrowUpRight className="w-6 h-6 stroke-[3]" /> : <ArrowDownLeft className="w-6 h-6 stroke-[3]" />}
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-900">{tx.title}</h4>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
                    {tx.category} • {tx.date}
                  </p>
                </div>
              </div>
              <div className={`text-sm font-black ${tx.type === 'outgoing' ? 'text-gray-900' : 'text-green-600'}`}>
                {tx.type === 'outgoing' ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const ActionButton = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <button className="bg-white/10 backdrop-blur-md rounded-3xl py-4 flex flex-col items-center justify-center space-y-2 group active:scale-95 transition-all hover:bg-white/20 border border-white/5">
    <Icon className="w-5 h-5 text-white stroke-[2.5]" />
    <span className="text-[9px] font-black tracking-widest text-white">{label}</span>
  </button>
);

export default WalletTab;
