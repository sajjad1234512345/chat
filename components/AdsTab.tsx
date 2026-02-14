
import React, { useState } from 'react';
import { Megaphone, TrendingUp, Zap, BarChart3, PieChart, Users, ArrowUpRight, Plus, X, Camera, Settings, Target, DollarSign, Calendar } from 'lucide-react';

const AdsTab: React.FC = () => {
  const [view, setView] = useState<'manager' | 'create'>('manager');

  const adMetrics = [
    { label: 'Active Ads', value: '12', change: '+2', isPositive: true },
    { label: 'Total Reach', value: '450K', change: '+15%', isPositive: true },
    { label: 'CTR', value: '3.2%', change: '-0.5%', isPositive: false },
    { label: 'Spend', value: '$2.4K', change: 'This Month', isPositive: true },
  ];

  const campaigns = [
    { id: 'c1', name: 'Summer Sale 2024', status: 'Active', budget: '$500', reach: '24K', image: 'https://picsum.photos/seed/ads1/400/300' },
    { id: 'c2', name: 'New Collection Launch', status: 'Active', budget: '$1.2K', reach: '150K', image: 'https://picsum.photos/seed/ads2/400/300' },
    { id: 'c3', name: 'Brand Awareness', status: 'Paused', budget: '$200', reach: '8K', image: 'https://picsum.photos/seed/ads3/400/300' },
  ];

  if (view === 'create') {
    return (
      <div className="bg-[#121212] min-h-screen p-6 pb-24 animate-in slide-in-from-right duration-300">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button onClick={() => setView('manager')} className="p-2 bg-white/10 rounded-full">
              <X className="w-6 h-6 text-white/40" />
            </button>
            <h2 className="text-2xl font-black text-white">Create Promotion</h2>
          </div>
        </header>

        <form className="space-y-6">
          <div className="w-full aspect-video bg-white/5 border-2 border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center text-white/20 space-y-2 cursor-pointer hover:bg-white/10 transition-all overflow-hidden">
            <Camera className="w-10 h-10" />
            <span className="text-sm font-bold uppercase tracking-widest">Select Creative</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/40 uppercase mb-2">Campaign Name</label>
              <input type="text" placeholder="e.g. Summer Flash Sale" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-red-500/20 text-sm font-medium text-white" />
            </div>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white py-4 rounded-2xl font-black text-lg shadow-xl uppercase tracking-widest active:scale-95 transition-all">
            Launch Ad Campaign
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto bg-transparent min-h-screen pb-24">
      <header className="flex justify-between items-center mb-8 px-2">
        <div>
          <h2 className="text-2xl font-black text-white">Ad Manager</h2>
          <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-0.5">Scale your business reach</p>
        </div>
        <button 
          onClick={() => setView('create')}
          className="p-3 bg-white/10 border border-white/10 rounded-2xl text-white shadow-lg active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8 px-2">
        {adMetrics.map((metric, idx) => (
          <div key={idx} className="bg-white/5 backdrop-blur-md p-5 rounded-3xl shadow-sm border border-white/10">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[9px] text-white/30 font-black uppercase tracking-wider">{metric.label}</span>
              <div className={`px-1.5 py-0.5 rounded-lg text-[8px] font-bold ${metric.isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {metric.change}
              </div>
            </div>
            <h4 className="text-xl font-black text-white">{metric.value}</h4>
          </div>
        ))}
      </div>

      {/* Active Campaigns List */}
      <div className="px-2 pb-8">
        <h3 className="font-black text-lg text-white mb-5 uppercase tracking-widest text-white/40 text-xs">Current Campaigns</h3>
        <div className="space-y-4">
          {campaigns.map(c => (
            <div key={c.id} className="bg-white/5 backdrop-blur-xl p-4 rounded-[2rem] shadow-sm border border-white/10 flex items-center space-x-4 group cursor-pointer transition-all hover:bg-white/10">
              <div className="relative w-20 h-20 flex-shrink-0">
                <img src={c.image} className="w-full h-full rounded-2xl object-cover opacity-60" alt="" />
                <div className={`absolute -top-1 -left-1 px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-tighter text-white shadow-sm ${c.status === 'Active' ? 'bg-green-500' : 'bg-zinc-600'}`}>
                  {c.status}
                </div>
              </div>
              <div className="flex-grow min-w-0">
                <h4 className="font-black text-xs truncate mb-1 text-white">{c.name}</h4>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-white/30 uppercase">Budget</span>
                    <span className="text-[10px] font-black text-red-500">{c.budget}</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="p-2 bg-white/5 rounded-xl text-white/20 group-hover:text-red-500 transition-colors">
                  <BarChart3 className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdsTab;
