
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

      {/* Recent Activity Section */}
      <section className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-black text-white tracking-tighter uppercase italic">Recent Activity</h3>
            <p className="text-[9px] text-white/30 font-black uppercase tracking-[0.3em] mt-1">Latest system events</p>
          </div>
          <button className="p-2 bg-white/5 rounded-xl text-white/40 hover:text-white transition-all">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          {[
            { user: 'Ava Jones', action: 'Created new campaign', time: '2m ago', icon: Megaphone, color: 'text-pink-500' },
            { user: 'Samuel Young', action: 'Updated billing info', time: '15m ago', icon: CreditCard, color: 'text-blue-500' },
            { user: 'Lincoln Rogers', action: 'System backup completed', time: '1h ago', icon: ShieldCheck, color: 'text-emerald-500' },
            { user: 'Claire Peterson', action: 'New team member joined', time: '3h ago', icon: UserX, color: 'text-purple-500' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
              <div className="flex items-center space-x-4">
                <div className={`p-3 bg-white/5 rounded-xl ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-white italic">{item.user}</p>
                  <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">{item.action}</p>
                </div>
              </div>
              <span className="text-[9px] text-white/20 font-black uppercase tracking-widest">{item.time}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderTeam = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">Team Management</h3>
          <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.4em] mt-1">Manage your organization members</p>
        </div>
        <div className="flex space-x-2">
          <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="p-6 text-[10px] font-black text-white/30 uppercase tracking-[0.3em] italic">Member</th>
                <th className="p-6 text-[10px] font-black text-white/30 uppercase tracking-[0.3em] italic">Role</th>
                <th className="p-6 text-[10px] font-black text-white/30 uppercase tracking-[0.3em] italic">Username</th>
                <th className="p-6 text-[10px] font-black text-white/30 uppercase tracking-[0.3em] italic">Status</th>
                <th className="p-6 text-[10px] font-black text-white/30 uppercase tracking-[0.3em] italic">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MOCK_USERS.map((user, i) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-all group">
                  <td className="p-6">
                    <div className="flex items-center space-x-4">
                      <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-white/10 group-hover:border-pink-500/50 transition-all" />
                      <div>
                        <p className="text-sm font-black text-white italic">{user.name}</p>
                        <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black text-white/60 uppercase tracking-widest border border-white/5">
                      {['Admin', 'Editor', 'Analyst', 'Viewer'][i % 4]}
                    </span>
                  </td>
                  <td className="p-6">
                    <span className="text-xs font-black text-pink-500/80 italic">{user.username}</span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{user.status}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-2 bg-white/5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all">
                        <BarChart3 className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-white/5 rounded-xl text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-all">
                        <UserX className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">Products</h3>
          <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.4em] mt-1">Manage your inventory and listings</p>
        </div>
        <button className="p-4 bg-pink-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          { name: 'Neon Glow Sneakers', price: '$129.00', stock: 42, sales: 156, img: 'https://images.unsplash.com/photo-1542291026-7eec264c274f?q=80&w=400' },
          { name: 'Cyberpunk Jacket', price: '$299.00', stock: 12, sales: 84, img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=400' },
          { name: 'Holographic Backpack', price: '$89.00', stock: 28, sales: 210, img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400' },
          { name: 'Digital Watch X', price: '$199.00', stock: 5, sales: 342, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400' },
        ].map((product, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 flex space-x-6 group hover:border-pink-500/30 transition-all">
            <div className="w-32 h-32 rounded-3xl overflow-hidden border border-white/10 flex-shrink-0">
              <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="flex-grow flex flex-col justify-between py-2">
              <div>
                <h4 className="text-lg font-black text-white italic leading-tight">{product.name}</h4>
                <p className="text-xl font-black text-pink-500 mt-1">{product.price}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Stock</p>
                  <p className={`text-xs font-black ${product.stock < 10 ? 'text-red-500' : 'text-white'}`}>{product.stock} units</p>
                </div>
                <div className="w-px h-6 bg-white/10" />
                <div>
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Sales</p>
                  <p className="text-xs font-black text-emerald-400">{product.sales} sold</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSystemConfig = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div>
        <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">System Config</h3>
        <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.4em] mt-1">Configure your business environment</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 space-y-6">
          <div className="flex items-center space-x-4 mb-2">
            <div className="p-3 bg-pink-500/20 rounded-2xl text-pink-500">
              <Shield className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-black text-white tracking-tighter uppercase italic">Security & Access</h4>
          </div>
          
          <div className="space-y-4">
            <ToggleSetting label="Two-Factor Auth" description="Add an extra layer of security" active={true} />
            <ToggleSetting label="Session Timeout" description="Auto logout after 30m inactivity" active={false} />
            <ToggleSetting label="IP Whitelisting" description="Restrict access to specific IPs" active={false} />
          </div>
        </section>

        <section className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 space-y-6">
          <div className="flex items-center space-x-4 mb-2">
            <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-500">
              <Bell className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-black text-white tracking-tighter uppercase italic">Notifications</h4>
          </div>
          
          <div className="space-y-4">
            <ToggleSetting label="Email Alerts" description="Receive daily performance reports" active={true} />
            <ToggleSetting label="Push Notifications" description="Real-time system alerts" active={true} />
            <ToggleSetting label="Slack Integration" description="Sync alerts to your workspace" active={false} />
          </div>
        </section>

        <section className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 space-y-6 md:col-span-2">
          <div className="flex items-center space-x-4 mb-2">
            <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-500">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-black text-white tracking-tighter uppercase italic">Appearance & Branding</h4>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-pink-500/30 transition-all cursor-pointer group">
              <Palette className="w-8 h-8 text-white/20 group-hover:text-pink-500 mb-4 transition-all" />
              <p className="text-xs font-black text-white italic">Theme Colors</p>
              <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-1">Customize UI palette</p>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group">
              <Sparkles className="w-8 h-8 text-white/20 group-hover:text-blue-500 mb-4 transition-all" />
              <p className="text-xs font-black text-white italic">Animations</p>
              <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-1">Motion & transitions</p>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer group">
              <Columns className="w-8 h-8 text-white/20 group-hover:text-emerald-500 mb-4 transition-all" />
              <p className="text-xs font-black text-white italic">Layout Grid</p>
              <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-1">Dashboard structure</p>
            </div>
          </div>
        </section>

        <div className="md:col-span-2 flex justify-end pt-4">
          <button className="px-10 py-5 bg-gradient-to-tr from-pink-600 to-rose-500 text-white rounded-[2rem] font-black text-[12px] uppercase tracking-[0.4em] italic shadow-[0_15px_40px_rgba(236,72,153,0.3)] active:scale-95 transition-all border border-white/20">
            Save Configuration
          </button>
        </div>
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
          <nav className="flex-grow space-y-2 overflow-y-auto scrollbar-hide pr-1 pt-4">
            <DrawerItem icon={LayoutGrid} label="Dashboard" active={activeTab === 'Dashboard'} onClick={() => { setActiveTab('Dashboard'); setIsCurtainOpen(false); }} />
            <DrawerItem icon={Briefcase} label="Team" active={activeTab === 'Team'} onClick={() => { setActiveTab('Team'); setIsCurtainOpen(false); }} />
            <DrawerItem icon={Box} label="Products" active={activeTab === 'Products'} onClick={() => { setActiveTab('Products'); setIsCurtainOpen(false); }} />
            <DrawerItem icon={FileText} label="Reports" active={activeTab === 'Reports'} onClick={() => { setActiveTab('Reports'); setIsCurtainOpen(false); }} />
            <DrawerItem icon={CreditCard} label="Billing" active={activeTab === 'Billing'} onClick={() => { setActiveTab('Billing'); setIsCurtainOpen(false); }} />
            <DrawerItem icon={Trophy} label="Events" active={activeTab === 'Events'} onClick={() => { setActiveTab('Events'); setIsCurtainOpen(false); }} />
            <DrawerItem icon={MessageCircle} label="Favor Chats" active={activeTab === 'Favor Chats'} onClick={() => { setActiveTab('Favor Chats'); setIsCurtainOpen(false); }} />
            <DrawerItem icon={SettingsIcon} label="System Config" active={activeTab === 'System Config'} onClick={() => { setActiveTab('System Config'); setIsCurtainOpen(false); }} />
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
        {activeTab === 'Team' && renderTeam()}
        {activeTab === 'Products' && renderProducts()}
        {activeTab === 'System Config' && renderSystemConfig()}
        {!['Dashboard', 'Team', 'Products', 'System Config'].includes(activeTab) && (
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

const ToggleSetting = ({ label, description, active }: any) => (
  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
    <div>
      <p className="text-xs font-black text-white italic">{label}</p>
      <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">{description}</p>
    </div>
    <button className={`w-12 h-6 rounded-full relative transition-all duration-300 ${active ? 'bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.4)]' : 'bg-white/10'}`}>
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${active ? 'left-7' : 'left-1'}`} />
    </button>
  </div>
);

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
