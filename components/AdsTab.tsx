
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
      <div className="bg-base-bg min-h-screen p-6 pb-24 animate-in slide-in-from-right duration-300">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button onClick={() => setView('manager')} className="btn-icon bg-surface-1">
              <X className="w-6 h-6 text-text-muted" />
            </button>
            <h2 className="text-display text-text-primary">Create Promotion</h2>
          </div>
        </header>

        <form className="space-y-6">
          <div className="w-full aspect-video glass-level-1 rounded-[2rem] flex flex-col items-center justify-center text-text-muted space-y-2 cursor-pointer hover:bg-white/5 transition-all overflow-hidden">
            <Camera className="w-10 h-10" />
            <span className="text-label">Select Creative</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-label text-text-muted mb-2">Campaign Name</label>
              <input type="text" placeholder="e.g. Summer Flash Sale" className="input-field w-full" />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full shadow-xl uppercase tracking-widest">
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
          <h2 className="text-display text-text-primary">Ad Manager</h2>
          <p className="text-label text-text-muted mt-0.5">Scale your business reach</p>
        </div>
        <button 
          onClick={() => setView('create')}
          className="btn-icon bg-surface-1 shadow-lg text-text-primary active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8 px-2">
        {adMetrics.map((metric, idx) => (
          <div key={idx} className="glass-level-1 p-5 rounded-3xl shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-label text-text-muted">{metric.label}</span>
              <div className={`px-1.5 py-0.5 rounded-lg text-[8px] font-bold ${metric.isPositive ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                {metric.change}
              </div>
            </div>
            <h4 className="text-numbers text-text-primary">{metric.value}</h4>
          </div>
        ))}
      </div>

      {/* Active Campaigns List */}
      <div className="px-2 pb-8">
        <h3 className="text-label text-text-muted mb-5">Current Campaigns</h3>
        <div className="space-y-4">
          {campaigns.map(c => (
            <div key={c.id} className="glass-level-1 p-4 rounded-[2rem] shadow-sm flex items-center space-x-4 group cursor-pointer transition-all hover:bg-white/5">
              <div className="relative w-20 h-20 flex-shrink-0">
                <img src={c.image} className="w-full h-full rounded-2xl object-cover opacity-60" alt="" referrerPolicy="no-referrer" />
                <div className={`absolute -top-1 -left-1 px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-tighter text-text-primary shadow-sm ${c.status === 'Active' ? 'bg-success' : 'bg-surface-2'}`}>
                  {c.status}
                </div>
              </div>
              <div className="flex-grow min-w-0">
                <h4 className="text-h3 truncate mb-1 text-text-primary">{c.name}</h4>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="flex flex-col">
                    <span className="text-label text-text-muted">Budget</span>
                    <span className="text-body-small font-bold text-accent-secondary">{c.budget}</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="p-2 bg-white/5 rounded-xl text-text-muted group-hover:text-accent-secondary transition-colors">
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
