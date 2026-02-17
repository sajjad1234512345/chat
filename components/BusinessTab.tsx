
import React, { useState } from 'react';
import { 
  LayoutGrid, Users, UserX, ShieldCheck, FileWarning, Search, Bell, 
  ChevronRight, MoreHorizontal, Check, X, Filter, BarChart3,
  Settings as SettingsIcon, LogOut, Download, CreditCard, Box,
  FileText, Megaphone, Tags, Ticket, Navigation, BookOpen, 
  Palette, Sparkles, Columns, Cpu, Plus, TrendingUp, ArrowUpRight, ArrowDownRight,
  Eye, Wallet, Activity, ChevronLeft, Layers, PieChart, Shield,
  Briefcase, Trophy, MessageCircle, Star, Menu
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

type BusinessSubTab = 'Dashboard' | 'Users' | 'Settings';

const MOCK_USERS = [
  { id: '#768', name: 'Ava Jones', email: 'lline@yandex.ru', username: '@glamgrove', status: 'Active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200' },
  { id: '#854', name: 'Samuel Young', email: 'ahana@mail.ru', username: '@eliteechoes', status: 'Active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200' },
  { id: '#992', name: 'Lincoln Rogers', email: 'seannand@mail.ru', username: '@radiantrealm', status: 'Active', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200' },
  { id: '#523', name: 'Claire Peterson', email: 'irnabela@gmail.com', username: '@urbanutopia', status: 'Active', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200' },
];

const PERFORMANCE_DATA = [
  { name: 'Mon', value: 2400 },
  { name: 'Tue', value: 3500 },
  { name: 'Wed', value: 2800 },
  { name: 'Thu', value: 4200 },
  { name: 'Fri', value: 3900 },
  { name: 'Sat', value: 5100 },
  { name: 'Sun', value: 4800 },
];

const BusinessTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Dashboard');
  const [isCurtainOpen, setIsCurtainOpen] = useState(false);

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Performance Summary Chart */}
      <section className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 blur-[120px] rounded-full -mr-20 -mt-20 group-hover:bg-pink-500/20 transition-all duration-700" />
        
        <div className="flex justify-between items-start mb-10 relative z-10">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">Earnings Overview</h3>
            <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.4em] mt-1">Net revenue performance (7d)</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-3xl font-black text-white tracking-tighter">$12,450.00</span>
            <div className="flex items-center space-x-1.5 text-green-400 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black tracking-widest">+18.5%</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={PERFORMANCE_DATA}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="5 5" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 900}} 
                dy={10}
              />
              <Tooltip 
                contentStyle={{backgroundColor: '#1c1c1c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem'}}
                itemStyle={{color: '#ec4899', fontSize: '12px', fontWeight: 'bold'}}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#ec4899" 
                strokeWidth={4} 
                fillOpacity={1} 
                fill="url(#colorValue)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Grid of smaller stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStatSmall 
          label="Conversion" 
          value="4.8%" 
          change="+0.2%" 
          isPositive={true} 
          icon={Activity} 
          color="text-pink-500" 
        />
        <DashboardStatSmall 
          label="Total Reach" 
          value="854k" 
          change="+12k" 
          isPositive={true} 
          icon={Users} 
          color="text-blue-500" 
        />
        <DashboardStatSmall 
          label="Net Loss" 
          value="$0.00" 
          change="0%" 
          isPositive={true} 
          icon={ArrowDownRight} 
          color="text-emerald-500" 
        />
        <DashboardStatSmall 
          label="Impressions" 
          value="1.2M" 
          change="-2.1%" 
          isPositive={false} 
          icon={Eye} 
          color="text-purple-500" 
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white font-sans pb-32 animate-in fade-in duration-500 relative overflow-hidden">
      
      {/* Side Curtain (Drawer) Overlay */}
      {isCurtainOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-300"
          onClick={() => setIsCurtainOpen(false)}
        />
      )}

      {/* Side Curtain (Drawer) Menu - Constrained between Up and Bottom bars */}
      <div 
        className={`fixed top-[92px] bottom-[56px] left-0 w-[82%] max-w-[300px] bg-[#0c0c0c]/95 backdrop-blur-3xl border-r border-y border-white/10 z-[110] transform transition-transform duration-500 ease-out shadow-[40px_0_100px_rgba(0,0,0,0.9)] rounded-r-[3rem] ${isCurtainOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Header removed based on visual feedback */}
          
          <nav className="flex-grow space-y-2 overflow-y-auto scrollbar-hide pr-1 pt-4">
            <DrawerItem icon={LayoutGrid} label="Dashboard" active={activeTab === 'Dashboard'} onClick={() => { setActiveTab('Dashboard'); setIsCurtainOpen(false); }} />
            <DrawerItem icon={Briefcase} label="Team" active={activeTab === 'Team'} onClick={() => setActiveTab('Team')} />
            <DrawerItem icon={Box} label="Products" active={activeTab === 'Products'} onClick={() => setActiveTab('Products')} />
            <DrawerItem icon={FileText} label="Reports" active={activeTab === 'Reports'} onClick={() => setActiveTab('Reports')} />
            <DrawerItem icon={CreditCard} label="Billing" active={activeTab === 'Billing'} onClick={() => setActiveTab('Billing')} />
            <DrawerItem icon={Trophy} label="Events" active={activeTab === 'Events'} onClick={() => setActiveTab('Events')} />
            <DrawerItem icon={MessageCircle} label="Favor Chats" active={activeTab === 'Favor Chats'} onClick={() => setActiveTab('Favor Chats')} />
            <DrawerItem icon={SettingsIcon} label="System Config" active={activeTab === 'System Config'} onClick={() => setActiveTab('System Config')} />
          </nav>

          <div className="pt-6 border-t border-white/5 mt-auto">
             <button className="w-full flex items-center justify-center space-x-3 p-5 bg-white/5 text-white/40 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] border border-white/5 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/10 transition-all active:scale-95">
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
             </button>
          </div>
        </div>
      </div>

      {/* Top Controls */}
      <div className="px-6 pt-8 pb-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsCurtainOpen(true)}
            className="p-3.5 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl text-white/40 hover:text-white active:scale-95 transition-all shadow-xl hover:bg-pink-500/10 hover:border-pink-500/20"
            aria-label="Open Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            <h2 className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mb-0.5">Company</h2>
            <p className="text-sm font-black text-white tracking-tighter uppercase italic">Hira Rahman</p>
          </div>
        </div>
      </div>

      <main className="px-6">
        {activeTab === 'Dashboard' && renderDashboard()}
        {activeTab !== 'Dashboard' && (
          <div className="h-64 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
               <Activity className="w-8 h-8 text-white/20 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-widest text-white/80">{activeTab}</h3>
              <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em] mt-2">Section is currently in development</p>
            </div>
          </div>
        )}
      </main>

      {/* Fixed Action Area */}
      <div className="fixed bottom-24 right-6 z-40">
        <button className="w-16 h-16 bg-gradient-to-tr from-pink-600 to-rose-500 text-white rounded-[2rem] flex items-center justify-center shadow-[0_15px_40px_rgba(236,72,153,0.3)] active:scale-90 transition-all border border-white/20">
          <Plus className="w-9 h-9 stroke-[3]" />
        </button>
      </div>

      <style>{`
        .recharts-cartesian-grid-horizontal line {
          stroke: rgba(255,255,255,0.05);
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

const DrawerItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-4.5 rounded-[1.8rem] transition-all duration-300 group ${active ? 'bg-pink-500 text-white shadow-[0_15px_30px_rgba(236,72,153,0.25)] scale-[1.02]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
  >
    <div className="flex items-center space-x-4">
      <Icon className={`w-5.5 h-5.5 ${active ? 'text-white' : 'text-white/20 group-hover:text-white/60'}`} />
      <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">{label}</span>
    </div>
    <ChevronRight className={`w-4 h-4 transition-all duration-300 ${active ? 'text-white/50 translate-x-1 opacity-100' : 'opacity-0 group-hover:opacity-20 group-hover:translate-x-1'}`} />
  </button>
);

const DashboardStatSmall = ({ label, value, change, isPositive, icon: Icon, color }: any) => (
  <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl group hover:border-pink-500/30 transition-all">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-3 bg-white/5 rounded-2xl ${color} shadow-inner`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
        {change}
      </div>
    </div>
    <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-1">{label}</p>
    <h4 className="text-2xl font-black text-white tracking-tighter">{value}</h4>
  </div>
);

export default BusinessTab;
