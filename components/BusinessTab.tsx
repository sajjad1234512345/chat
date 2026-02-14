
import React, { useState } from 'react';
import { 
  LayoutGrid, Users, Box, MessageSquare, BarChart3, Settings, 
  Share2, Zap, Clock, TrendingUp, MoreVertical, 
  Mail, Shield, ChevronDown, Package, 
  ArrowUpRight, Target
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { BusinessMetric, Employee } from '../types';

const METRICS: BusinessMetric[] = [
  { label: 'FOLLOWERS', value: '112K', change: '++12%', isPositive: true },
  { label: 'AVG REACH', value: '45.8K', change: '++8%', isPositive: true },
  { label: 'GROSS SALES', value: '$8,402', change: '++24%', isPositive: true },
  { label: 'ENGAGEMENT', value: '4.8%', change: '-2%', isPositive: false },
];

const SALES_DATA = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 5500 },
];

const INITIAL_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Hira R.', email: 'hira@company.com', role: 'Admin', avatar: 'https://picsum.photos/seed/hira/100/100', status: 'Active' },
  { id: '2', name: 'Alex Thompson', email: 'alex@company.com', role: 'Manager', avatar: 'https://picsum.photos/seed/alex/100/100', status: 'Active' },
  { id: '3', name: 'Sarah Chen', email: 'sarah@company.com', role: 'Editor', avatar: 'https://picsum.photos/seed/sarah/100/100', status: 'Away' },
];

type BusinessSubTab = 'dashboard' | 'employees' | 'inventory' | 'inquiries' | 'insights' | 'settings';

const BusinessTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<BusinessSubTab>('dashboard');
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const navItems = [
    { id: 'inventory', icon: Box, angle: -90, label: 'Inventory' },
    { id: 'settings', icon: Settings, angle: -30, label: 'Settings' },
    { id: 'insights', icon: BarChart3, angle: 30, label: 'Insights' },
    { id: 'employees', icon: Users, angle: 90, label: 'Employees' },
    { id: 'inquiries', icon: MessageSquare, angle: 150, label: 'Inquiries' },
    { id: 'dashboard', icon: LayoutGrid, angle: 210, label: 'Dashboard' },
  ];

  const currentAngle = navItems.find(n => n.id === activeSubTab)?.angle || 0;

  const renderDashboard = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {METRICS.map((metric, idx) => (
          <div key={idx} className="glass p-8 rounded-[3rem] flex flex-col justify-between h-44 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform">
            <div className="flex justify-between items-start">
              <span className="text-[11px] text-white/40 font-black uppercase tracking-[0.2em]">{metric.label}</span>
              <div className={`text-[11px] font-black px-2 py-1 rounded-lg ${metric.isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {metric.change}
              </div>
            </div>
            <h4 className="text-4xl font-black text-white leading-none tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{metric.value}</h4>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-12 glass p-12 rounded-[4rem] border border-white/10 shadow-2xl">
          <div className="flex justify-between items-center mb-12">
            <h3 className="font-black text-2xl text-white tracking-tight">Organization Analytics</h3>
            <div className="bg-pink-600/20 px-5 py-2 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] text-pink-500 border border-pink-500/30 animate-pulse">
              Live Stream Active
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SALES_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 800, fill: 'rgba(255,255,255,0.4)'}} dy={15} />
                <Bar dataKey="sales" radius={[12, 12, 12, 12]} barSize={45}>
                  {SALES_DATA.map((_, i) => <Cell key={i} fill={i === 4 ? '#ec4899' : 'rgba(255,255,255,0.15)'} className="drop-shadow-[0_0_10px_rgba(236,72,153,0.3)]" />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen text-white overflow-hidden relative">
      
      {/* RADIAL NAVIGATOR - Elevated with High Luminosity */}
      <aside className="hidden xl:flex w-[550px] items-center justify-center sticky top-0 h-screen p-12 z-20">
        <div className="relative w-[450px] h-[450px] flex items-center justify-center">
          
          {/* Main Dark Shell with Glow */}
          <div className="absolute inset-0 rounded-full bg-zinc-900/40 border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] backdrop-blur-[60px] overflow-hidden">
            {/* Divider lines exactly as in image */}
            {[0, 60, 120, 180, 240, 300].map(deg => (
              <div key={deg} className="absolute top-1/2 left-1/2 w-full h-[1px] bg-white/[0.08] origin-left" style={{ transform: `rotate(${deg}deg)` }} />
            ))}
          </div>

          {/* Central Hub (The Core) - Darker, deeper black */}
          <div className="z-30 w-56 h-56 bg-[#050505] rounded-full shadow-[0_0_80px_rgba(0,0,0,1)] border border-white/20 flex flex-col items-center justify-center text-center relative ring-1 ring-white/10">
             {/* Glowing White Pointer */}
             <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[10px] border-b-white luminous-glow" />
             
             <h3 className="text-[16px] font-black text-white uppercase tracking-[0.5em] mb-2 ml-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">NAVIGATOR</h3>
             <span className="text-[11px] text-white/40 font-black uppercase tracking-[0.3em] italic">
                {hoveredTab ? hoveredTab : 'Select Modality'}
             </span>
          </div>

          {/* Nav Item Buttons positioned around the hub */}
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSubTab(item.id as BusinessSubTab)}
              onMouseEnter={() => setHoveredTab(item.label)}
              onMouseLeave={() => setHoveredTab(null)}
              className={`absolute z-40 w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 group ${activeSubTab === item.id ? 'scale-110' : 'hover:scale-105'}`}
              style={{
                transform: `rotate(${item.angle}deg) translate(165px) rotate(-${item.angle}deg)`,
              }}
            >
              {/* Vibrant segment bloom on hover */}
              {(hoveredTab === item.label || activeSubTab === item.id) && (
                <div className="absolute inset-0 bg-white/10 rounded-full blur-[30px] animate-pulse" />
              )}
              
              <item.icon 
                className={`w-9 h-9 transition-all duration-300 ${activeSubTab === item.id ? 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.9)] scale-110 stroke-[2]' : 'text-white/30 group-hover:text-white/60 stroke-[1.5]'}`} 
              />
            </button>
          ))}

          {/* Bright Glowing Arc Indicator */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 transition-transform duration-700 pointer-events-none" style={{ transform: `rotate(${currentAngle}deg)` }}>
            <circle
              cx="225"
              cy="225"
              r="200"
              fill="none"
              stroke="white"
              strokeWidth="5"
              strokeDasharray="160 1400"
              strokeLinecap="round"
              className="drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]"
            />
          </svg>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <main className="flex-grow p-12 lg:p-28 h-screen overflow-y-auto z-10 scrollbar-hide">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-24 animate-in fade-in slide-in-from-top-6 duration-700">
          <div>
            <h2 className="text-7xl font-black text-white tracking-tighter uppercase italic leading-none drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">Business</h2>
            <div className="flex items-center mt-6 space-x-4">
              <Target className="w-6 h-6 text-pink-500 animate-pulse" />
              <span className="text-white/50 text-[12px] font-black uppercase tracking-[0.4em]">Sub-Module: {activeSubTab}</span>
            </div>
          </div>
          <div className="flex items-center space-x-6 mt-12 md:mt-0">
             <button className="flex items-center space-x-4 glass px-10 py-5 rounded-[2.5rem] text-white/60 hover:text-white transition-all font-black text-[12px] uppercase tracking-[0.2em] border-white/20">
                <Share2 className="w-5 h-5" />
                <span>Sync Node</span>
             </button>
             <button className="flex items-center space-x-4 bg-white text-black px-14 py-5 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:bg-zinc-200 transition-all active:scale-95 group">
               <Zap className="w-5 h-5 fill-black group-hover:scale-125 transition-transform" />
               <span>Switch Entity</span>
             </button>
          </div>
        </header>

        <section className="pb-40">
          {activeSubTab === 'dashboard' && renderDashboard()}
          
          {activeSubTab !== 'dashboard' && (
            <div className="glass p-40 rounded-[6rem] flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-700 shadow-2xl border-white/15">
               <div className="w-40 h-40 bg-white/5 rounded-full flex items-center justify-center mb-16 border border-white/20 relative">
                  <div className="absolute inset-0 rounded-full border border-pink-500/20 animate-ping" />
                  <Settings className="w-20 h-20 text-white/20 animate-spin-slow drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
               </div>
               <h3 className="text-5xl font-black text-white mb-8 tracking-tighter uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{activeSubTab}</h3>
               <p className="text-white/40 font-black uppercase tracking-[0.4em] text-[11px] max-w-sm leading-[2.5] italic">
                  Advanced cryptographic handshake in progress. Access privileges authenticating.
               </p>
            </div>
          )}
        </section>
      </main>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 22s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default BusinessTab;
