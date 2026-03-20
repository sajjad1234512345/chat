
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
    <div className="bg-transparent min-h-screen pb-32 animate-in fade-in duration-500">
      {/* Header Section */}
      <header className="px-6 pt-3 pb-1 flex justify-between items-start">
        <div>
          <h1 className="text-lg font-black text-white tracking-tight">Wallet</h1>
          <p className="text-[7px] text-white/40 font-black uppercase tracking-widest mt-0.5">Manage your funds and cards</p>
        </div>
        <div className="flex space-x-1.5">
          <button className="w-7 h-7 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shadow-sm text-white/60 active:scale-95 transition-all">
            <Settings className="w-3 h-3" />
          </button>
          <button className="w-7 h-7 rounded-xl bg-pink-500/20 flex items-center justify-center shadow-sm text-pink-500 active:scale-95 transition-all border border-pink-500/20">
            <CreditCard className="w-3 h-3" />
          </button>
        </div>
      </header>

      {/* Total Balance Card */}
      <section className="px-6 mb-3">
        <div className="relative rounded-[1.25rem] p-4 text-white overflow-hidden shadow-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
          <div className="absolute top-1 right-1 opacity-10 transform translate-x-2 -translate-y-2">
             <WalletIcon className="w-20 h-20" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center space-x-1.5 mb-0.5">
              <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">Total Balance</span>
              <button onClick={() => setShowBalance(!showBalance)} className="text-white/40">
                {showBalance ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
              </button>
            </div>
            <h2 className="text-xl font-black mb-2.5 tracking-tighter">
              {showBalance ? '$12,450.80' : '••••••••'}
            </h2>

            <div className="grid grid-cols-3 gap-1.5">
              <ActionButton icon={ArrowUpRight} label="SEND" />
              <ActionButton icon={ArrowDownLeft} label="RECEIVE" />
              <ActionButton icon={RefreshCcw} label="SWAP" />
            </div>
          </div>
        </div>
      </section>

      {/* My Cards Section */}
      <section className="mb-5">
        <div className="px-6 flex justify-between items-center mb-2">
          <h3 className="text-sm font-black text-white">My Cards</h3>
          <button className="bg-white/10 text-white px-1.5 py-0.5 rounded-full text-[7px] font-black uppercase tracking-wider flex items-center space-x-1 active:scale-95 transition-all border border-white/5">
            <Plus className="w-2 h-2" />
            <span>Add Card</span>
          </button>
        </div>

        <div className="flex space-x-2.5 overflow-x-auto px-6 scrollbar-hide py-1">
          {/* Card 1 - Blue */}
          <div className="min-w-[180px] h-28 rounded-[1.25rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-3.5 text-white relative flex flex-col justify-between shadow-xl group cursor-pointer hover:scale-[1.02] transition-all">
            <div className="flex justify-between items-start">
              <div className="w-7 h-4 bg-white/20 rounded-md backdrop-blur-md flex items-center justify-center border border-white/10">
                <div className="grid grid-cols-2 gap-0.5 px-1">
                   <div className="w-0.5 h-0.5 bg-white/40 rounded-sm" />
                   <div className="w-0.5 h-0.5 bg-white/40 rounded-sm" />
                </div>
              </div>
              <span className="italic font-black text-base opacity-90 tracking-tighter">VISA</span>
            </div>
            <div>
              <p className="text-[6px] font-black opacity-60 uppercase tracking-widest mb-0.5">BALANCE</p>
              <p className="text-base font-black mb-1.5 tracking-tight">$5,420.50</p>
              <div className="flex justify-between items-end">
                <p className="text-[8px] font-bold tracking-[0.2em] opacity-80">**** 4290</p>
                <div className="text-right">
                  <p className="text-[4px] font-black opacity-40 uppercase">EXP</p>
                  <p className="text-[8px] font-bold">12/26</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 - Orange */}
          <div className="min-w-[180px] h-28 rounded-[1.25rem] bg-gradient-to-br from-orange-500 to-red-600 p-3.5 text-white relative flex flex-col justify-between shadow-xl group cursor-pointer hover:scale-[1.02] transition-all">
             <div className="flex justify-between items-start">
              <div className="w-7 h-4 bg-white/20 rounded-md backdrop-blur-md flex items-center justify-center border border-white/10">
                 <div className="grid grid-cols-2 gap-0.5 px-1">
                   <div className="w-0.5 h-0.5 bg-white/40 rounded-sm" />
                   <div className="w-0.5 h-0.5 bg-white/40 rounded-sm" />
                </div>
              </div>
              <div className="flex space-x-[-5px]">
                <div className="w-4 h-4 rounded-full bg-red-400 opacity-80" />
                <div className="w-4 h-4 rounded-full bg-yellow-400 opacity-80" />
              </div>
            </div>
            <div>
              <p className="text-[6px] font-black opacity-60 uppercase tracking-widest mb-0.5">BALANCE</p>
              <p className="text-base font-black mb-1.5 tracking-tight">$2,100.25</p>
              <div className="flex justify-between items-end">
                <p className="text-[8px] font-bold tracking-[0.2em] opacity-80">**** 8812</p>
                <div className="text-right">
                  <p className="text-[4px] font-black opacity-40 uppercase">EXP</p>
                  <p className="text-[8px] font-bold">04/28</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Insights */}
      <section className="px-6 mb-5">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xs font-black text-white tracking-tight">Weekly Insights</h3>
          <div className="flex space-x-1.5">
            <button 
              onClick={() => setActiveInsight('income')}
              className={`text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg transition-all ${activeInsight === 'income' ? 'text-pink-500 bg-white/10' : 'text-white/20'}`}
            >
              Income
            </button>
            <button 
              onClick={() => setActiveInsight('expense')}
              className={`text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg transition-all ${activeInsight === 'expense' ? 'text-pink-500 bg-white/10' : 'text-white/20'}`}
            >
              Expense
            </button>
          </div>
        </div>

        <div className="bg-white/5 p-2.5 pt-5 rounded-[1.25rem] border border-white/10 shadow-sm flex flex-col h-32 relative overflow-hidden group backdrop-blur-md">
          <div className="flex-grow w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EC4899" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="5 5" stroke="rgba(255,255,255,0.05)" />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#EC4899" 
                  strokeWidth={3} 
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
        <div className="flex justify-between items-center mb-2.5">
          <h3 className="text-sm font-black text-white">Transactions</h3>
          <button className="text-pink-500 text-[7px] font-black uppercase tracking-widest">See All</button>
        </div>

        <div className="space-y-1.5">
          {MOCK_TRANSACTIONS.map((tx) => (
            <div key={tx.id} className="bg-white/5 backdrop-blur-md p-2.5 rounded-[1rem] border border-white/10 flex items-center justify-between shadow-sm active:scale-[0.98] transition-all cursor-pointer">
              <div className="flex items-center space-x-2.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${tx.type === 'outgoing' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                  {tx.type === 'outgoing' ? <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" /> : <ArrowDownLeft className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-white">{tx.title}</h4>
                  <p className="text-[7px] font-black text-white/30 uppercase tracking-widest mt-0.5">
                    {tx.category} • {tx.date}
                  </p>
                </div>
              </div>
              <div className={`text-[10px] font-black ${tx.type === 'outgoing' ? 'text-white' : 'text-green-400'}`}>
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
  <button className="bg-white/10 backdrop-blur-md rounded-lg py-1.5 flex flex-col items-center justify-center space-y-0.5 group active:scale-95 transition-all hover:bg-white/20 border border-white/5">
    <Icon className="w-3 h-3 text-white stroke-[2.5]" />
    <span className="text-[6px] font-black tracking-widest text-white">{label}</span>
  </button>
);

export default WalletTab;
