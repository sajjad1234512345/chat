
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
      <div className="bg-white min-h-screen p-6 pb-24 animate-in slide-in-from-right duration-300">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button onClick={() => setView('manager')} className="p-2 bg-gray-50 rounded-full">
              <X className="w-6 h-6 text-gray-400" />
            </button>
            <h2 className="text-2xl font-black">Create Promotion</h2>
          </div>
        </header>

        <form className="space-y-6">
          <div className="w-full aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center text-gray-400 space-y-2 cursor-pointer hover:bg-gray-100 transition-all overflow-hidden">
            <Camera className="w-10 h-10" />
            <span className="text-sm font-bold uppercase tracking-widest">Select Creative</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Campaign Name</label>
              <input type="text" placeholder="e.g. Summer Flash Sale" className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-red-200 text-sm font-medium" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Daily Budget ($)</label>
                <div className="relative">
                  <input type="number" placeholder="50.00" className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-10 outline-none focus:ring-2 focus:ring-red-200 text-sm" />
                  <DollarSign className="absolute left-3 top-4 w-4 h-4 text-red-500 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Duration</label>
                <div className="relative">
                  <select className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-10 outline-none focus:ring-2 focus:ring-red-200 text-sm appearance-none">
                    <option>7 Days</option>
                    <option>30 Days</option>
                    <option>Continuous</option>
                  </select>
                  <Calendar className="absolute left-3 top-4 w-4 h-4 text-red-500 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Target Audience</label>
              <div className="p-4 bg-red-50 rounded-2xl flex items-center justify-between border border-red-100">
                <div className="flex items-center space-x-3">
                  <Target className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-xs font-bold text-gray-900">Automatic Targeting</p>
                    <p className="text-[10px] text-gray-400">InstaMarket AI finds your best audience</p>
                  </div>
                </div>
                <Settings className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-red-200 uppercase tracking-widest">
            Launch Ad Campaign
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto bg-[#fafafa] min-h-screen pb-24">
      <header className="flex justify-between items-center mb-8 px-2">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Ad Manager</h2>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">Scale your business reach</p>
        </div>
        <button 
          onClick={() => setView('create')}
          className="p-3 bg-gradient-to-tr from-red-600 to-orange-500 rounded-2xl text-white shadow-lg shadow-red-100 hover:scale-105 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8 px-2">
        {adMetrics.map((metric, idx) => (
          <div key={idx} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider">{metric.label}</span>
              <div className={`px-1.5 py-0.5 rounded-lg text-[8px] font-bold ${metric.isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {metric.isPositive && metric.change.startsWith('+') ? metric.change : metric.change}
              </div>
            </div>
            <h4 className="text-xl font-black text-gray-900">{metric.value}</h4>
          </div>
        ))}
      </div>

      {/* Promotion Boost Card */}
      <div className="mb-8 px-2">
        <div className="bg-gradient-to-br from-red-600 via-orange-500 to-pink-500 rounded-[2.5rem] p-6 text-white shadow-xl shadow-red-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-20 transform group-hover:rotate-12 transition-transform duration-700">
            <Zap className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-1 italic">Smart Boost AI</h3>
            <p className="text-white/80 text-xs mb-6 font-medium">Auto-optimize your campaigns for 3x engagement.</p>
            <button className="bg-white text-red-600 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">
              Enable Auto-Optimizer
            </button>
          </div>
        </div>
      </div>

      {/* Active Campaigns List */}
      <div className="px-2 pb-8">
        <h3 className="font-black text-lg text-gray-900 mb-5">Current Campaigns</h3>
        <div className="space-y-4">
          {campaigns.map(c => (
            <div key={c.id} className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 flex items-center space-x-4 group cursor-pointer transition-all hover:shadow-md">
              <div className="relative w-20 h-20 flex-shrink-0">
                <img src={c.image} className="w-full h-full rounded-2xl object-cover" alt="" />
                <div className={`absolute -top-1 -left-1 px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-tighter text-white shadow-sm ${c.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}>
                  {c.status}
                </div>
              </div>
              <div className="flex-grow min-w-0">
                <h4 className="font-black text-xs truncate mb-1">{c.name}</h4>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-gray-400 uppercase">Budget</span>
                    <span className="text-[10px] font-black text-red-500">{c.budget}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] font-black text-gray-400 uppercase">Est. Reach</span>
                    <span className="text-[10px] font-black text-gray-900">{c.reach}</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="p-2 bg-gray-50 rounded-xl text-gray-300 group-hover:text-red-500 transition-colors">
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
