
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
    <div className="bg-transparent min-h-screen pb-32 animate-in fade-in duration-700">
      {/* Header Section */}
      <header className="px-8 pt-12 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">Wallet</h1>
          <p className="text-[11px] text-pink-500 font-black uppercase tracking-[0.5em] mt-4 italic">Manage your assets</p>
        </div>
        <div className="flex space-x-4">
          <button className="w-14 h-14 rounded-3xl border border-white/10 bg-white/5 flex items-center justify-center shadow-2xl text-white/40 active:scale-90 transition-all hover:bg-white/10 hover:text-white">
            <Settings className="w-6 h-6" />
          </button>
          <button className="w-14 h-14 rounded-3xl bg-pink-600/20 flex items-center justify-center shadow-2xl text-pink-500 active:scale-90 transition-all border border-pink-500/20 hover:bg-pink-600/30">
            <CreditCard className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Total Balance Card */}
      <section className="px-8 mb-12">
        <div className="relative rounded-[4rem] p-10 text-white overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.6)] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 group">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-12 -translate-y-12 transition-transform duration-1000 group-hover:scale-110">
             <WalletIcon className="w-72 h-72" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-[11px] font-black text-white/60 uppercase tracking-[0.3em] italic">Total Balance</span>
              <button onClick={() => setShowBalance(!showBalance)} className="text-white/40 hover:text-white transition-colors">
                {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
            <h2 className="text-6xl font-black mb-12 tracking-tighter italic leading-none">
              {showBalance ? '$12,450.80' : '••••••••'}
            </h2>

            <div className="grid grid-cols-3 gap-4">
              <ActionButton icon={ArrowUpRight} label="SEND" />
              <ActionButton icon={ArrowDownLeft} label="RECEIVE" />
              <ActionButton icon={RefreshCcw} label="SWAP" />
            </div>
          </div>
        </div>
      </section>

      {/* My Cards Section */}
      <section className="mb-12">
        <div className="px-8 flex justify-between items-center mb-8">
          <h3 className="text-[12px] font-black text-white/30 uppercase tracking-[0.6em] italic ml-2">My Cards</h3>
          <button className="bg-white/5 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center space-x-2.5 active:scale-90 transition-all border border-white/10 hover:bg-white/10 italic">
            <Plus className="w-4 h-4" />
            <span>Add Card</span>
          </button>
        </div>

        <div className="flex space-x-6 overflow-x-auto px-8 scrollbar-hide py-4">
          {/* Card 1 - Blue */}
          <div className="min-w-[320px] h-56 rounded-[3.5rem] bg-gradient-to-br from-blue-600 to-indigo-800 p-10 text-white relative flex flex-col justify-between shadow-[0_30px_60px_rgba(0,0,0,0.4)] group cursor-pointer hover:scale-[1.02] transition-all border border-white/10">
            <div className="flex justify-between items-start">
              <div className="w-14 h-10 bg-white/20 rounded-xl backdrop-blur-3xl flex items-center justify-center border border-white/10 shadow-inner">
                <div className="grid grid-cols-2 gap-1 px-2">
                   <div className="w-3 h-1.5 bg-white/40 rounded-sm" />
                   <div className="w-3 h-1.5 bg-white/40 rounded-sm" />
                   <div className="w-3 h-1.5 bg-white/40 rounded-sm" />
                   <div className="w-3 h-1.5 bg-white/40 rounded-sm" />
                </div>
              </div>
              <span className="italic font-black text-3xl opacity-90 tracking-tighter uppercase">VISA</span>
            </div>
            <div>
              <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.4em] mb-2 italic">BALANCE</p>
              <p className="text-3xl font-black mb-8 tracking-tighter italic">$5,420.50</p>
              <div className="flex justify-between items-end">
                <p className="text-[13px] font-black tracking-[0.3em] opacity-60 italic">**** **** **** 4290</p>
                <div className="text-right">
                  <p className="text-[8px] font-black opacity-40 uppercase italic">EXP</p>
                  <p className="text-[13px] font-black italic">12/26</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 - Orange */}
          <div className="min-w-[320px] h-56 rounded-[3.5rem] bg-gradient-to-br from-orange-500 to-red-600 p-10 text-white relative flex flex-col justify-between shadow-[0_30px_60px_rgba(0,0,0,0.4)] group cursor-pointer hover:scale-[1.02] transition-all border border-white/10">
             <div className="flex justify-between items-start">
              <div className="w-14 h-10 bg-white/20 rounded-xl backdrop-blur-3xl flex items-center justify-center border border-white/10 shadow-inner">
                 <div className="grid grid-cols-2 gap-1 px-2">
                   <div className="w-3 h-1.5 bg-white/40 rounded-sm" />
                   <div className="w-3 h-1.5 bg-white/40 rounded-sm" />
                </div>
              </div>
              <div className="flex space-x-[-15px]">
                <div className="w-9 h-9 rounded-full bg-red-400/80 backdrop-blur-md border border-white/10" />
                <div className="w-9 h-9 rounded-full bg-yellow-400/80 backdrop-blur-md border border-white/10" />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.4em] mb-2 italic">BALANCE</p>
              <p className="text-3xl font-black mb-8 tracking-tighter italic">$2,100.25</p>
              <div className="flex justify-between items-end">
                <p className="text-[13px] font-black tracking-[0.3em] opacity-60 italic">**** **** **** 8812</p>
                <div className="text-right">
                  <p className="text-[8px] font-black opacity-40 uppercase italic">EXP</p>
                  <p className="text-[13px] font-black italic">04/28</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Insights */}
      <section className="px-8 mb-12">
        <div className="flex justify-between items-end mb-8 ml-2">
          <div>
            <h3 className="text-[12px] font-black text-white/30 uppercase tracking-[0.6em] italic">Weekly Insights</h3>
            <p className="text-3xl font-black text-white tracking-tighter mt-2 italic">Growth Trend</p>
          </div>
          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
            <button 
              onClick={() => setActiveInsight('income')}
              className={`text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-xl transition-all italic ${activeInsight === 'income' ? 'text-black bg-white shadow-2xl' : 'text-white/30 hover:text-white/60'}`}
            >
              Income
            </button>
            <button 
              onClick={() => setActiveInsight('expense')}
              className={`text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-xl transition-all italic ${activeInsight === 'expense' ? 'text-black bg-white shadow-2xl' : 'text-white/30 hover:text-white/60'}`}
            >
              Expense
            </button>
          </div>
        </div>

        <div className="bg-white/5 p-6 pt-12 rounded-[4rem] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.4)] flex flex-col h-72 relative overflow-hidden group backdrop-blur-3xl">
          <div className="absolute top-8 left-10">
             <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic">Performance Index</p>
             <p className="text-2xl font-black text-white mt-1 italic">+24.5%</p>
          </div>
          <div className="flex-grow w-full h-full mt-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EC4899" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="8 8" stroke="rgba(255,255,255,0.03)" />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#EC4899" 
                  strokeWidth={6} 
                  fillOpacity={1} 
                  fill="url(#chartGradient)" 
                  isAnimationActive={true}
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Transactions List */}
      <section className="px-8 mb-12">
        <div className="flex justify-between items-center mb-8 ml-2">
          <h3 className="text-[12px] font-black text-white/30 uppercase tracking-[0.6em] italic">Transactions</h3>
          <button className="text-pink-500 text-[11px] font-black uppercase tracking-[0.3em] italic hover:text-pink-400 transition-colors">See All</button>
        </div>

        <div className="space-y-6">
          {MOCK_TRANSACTIONS.map((tx) => (
            <div key={tx.id} className="bg-white/5 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-white/10 flex items-center justify-between shadow-2xl active:scale-[0.98] transition-all cursor-pointer group hover:bg-white/10 hover:border-white/20">
              <div className="flex items-center space-x-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 ${tx.type === 'outgoing' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                  {tx.type === 'outgoing' ? <ArrowUpRight className="w-7 h-7 stroke-[3]" /> : <ArrowDownLeft className="w-7 h-7 stroke-[3]" />}
                </div>
                <div>
                  <h4 className="text-[17px] font-black text-white uppercase italic tracking-tight">{tx.title}</h4>
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mt-2 italic">
                    {tx.category} • {tx.date}
                  </p>
                </div>
              </div>
              <div className={`text-[18px] font-black italic tracking-tight ${tx.type === 'outgoing' ? 'text-white' : 'text-green-500'}`}>
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
  <button className="bg-white/5 backdrop-blur-3xl rounded-[2rem] py-6 flex flex-col items-center justify-center space-y-3 group active:scale-95 transition-all hover:bg-white/10 border border-white/10 shadow-2xl">
    <Icon className="w-6 h-6 text-white stroke-[3] transition-transform group-hover:scale-110" />
    <span className="text-[10px] font-black tracking-[0.3em] text-white/60 group-hover:text-white transition-colors italic">{label}</span>
  </button>
);

export default WalletTab;
