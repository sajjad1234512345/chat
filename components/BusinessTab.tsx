
import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, BarChart3, Package, MessageSquare, Settings, Share2, 
  ArrowUpRight, TrendingUp, Zap, Clock, Plus, Mail, Shield, UserPlus, MoreVertical, X 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BusinessMetric, Employee, EmployeeRole } from '../types';

const METRICS: BusinessMetric[] = [
  { label: 'Followers', value: '112K', change: '+12%', isPositive: true },
  { label: 'Avg Reach', value: '45.8K', change: '+8%', isPositive: true },
  { label: 'Gross Sales', value: '$8,402', change: '+24%', isPositive: true },
  { label: 'Engagement', value: '4.8%', change: '-2%', isPositive: false },
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

type BusinessSubTab = 'dashboard' | 'employees' | 'inventory' | 'settings';

const BusinessTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<BusinessSubTab>('dashboard');
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    role: 'Editor' as EmployeeRole
  });

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const employee: Employee = {
      id: Date.now().toString(),
      name: newEmployee.name,
      email: newEmployee.email,
      role: newEmployee.role,
      avatar: `https://picsum.photos/seed/${newEmployee.name}/100/100`,
      status: 'Active'
    };
    setEmployees([...employees, employee]);
    setNewEmployee({ name: '', email: '', role: 'Editor' });
    setShowAddEmployee(false);
  };

  const removeEmployee = (id: string) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const renderDashboard = () => (
    <>
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {METRICS.map((metric, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border border-pink-50 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{metric.label}</span>
              <div className={`flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold ${metric.isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {metric.isPositive ? '+' : ''}{metric.change}
              </div>
            </div>
            <h4 className="text-2xl font-black text-gray-900">{metric.value}</h4>
          </div>
        ))}
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-pink-50">
          <div className="flex justify-between items-center mb-8">
             <h3 className="font-bold text-lg">Sales Performance</h3>
             <select className="bg-pink-50 border-none rounded-xl text-xs font-bold px-3 py-1 text-pink-600 outline-none">
               <option>Monthly</option>
               <option>Weekly</option>
             </select>
          </div>
          <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={SALES_DATA}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af', fontWeight: 'bold'}} />
                 <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af', fontWeight: 'bold'}} />
                 <Tooltip 
                   cursor={{fill: '#FFF5F8'}}
                   contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                 />
                 <Bar dataKey="sales" radius={[10, 10, 10, 10]}>
                   {SALES_DATA.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={index === 4 ? '#ec4899' : '#fbcfe8'} />
                   ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-pink-200">
             <div className="flex justify-between items-start mb-6">
               <div>
                  <h3 className="text-xl font-bold mb-1">Growth Boost</h3>
                  <p className="text-white/80 text-xs">Reach 10k more users this weekend</p>
               </div>
               <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                  <Zap className="w-6 h-6" />
               </div>
             </div>
             <button className="w-full bg-white text-pink-600 py-3 rounded-2xl font-bold shadow-lg">BOOST POSTS NOW</button>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-pink-50">
             <h3 className="font-bold text-lg mb-6">Best Posting Times</h3>
             <div className="space-y-4">
               {[
                 { day: 'Friday', time: '09:00 PM', reach: '85%' },
                 { day: 'Sunday', time: '11:00 AM', reach: '92%' },
                 { day: 'Tuesday', time: '07:30 PM', reach: '78%' }
               ].map((t, idx) => (
                 <div key={idx} className="flex items-center justify-between p-4 bg-pink-50/50 rounded-2xl">
                   <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-pink-400" />
                      <div>
                        <p className="text-xs font-bold text-gray-800">{t.day} at {t.time}</p>
                        <p className="text-[10px] text-gray-400">Projected Engagement</p>
                      </div>
                   </div>
                   <span className="text-pink-600 font-black text-sm">{t.reach}</span>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderEmployees = () => (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-pink-50 min-h-[600px]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-bold">Team Members</h3>
          <p className="text-sm text-gray-400">Manage your organization's members and their roles.</p>
        </div>
        <button 
          onClick={() => setShowAddEmployee(true)}
          className="bg-pink-500 text-white px-5 py-2.5 rounded-2xl shadow-lg shadow-pink-200 font-bold text-sm flex items-center space-x-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {employees.map((emp) => (
          <div key={emp.id} className="p-6 bg-[#fafafa] border border-pink-50 rounded-3xl group relative overflow-hidden transition-all hover:bg-white hover:shadow-xl hover:shadow-pink-100/50">
            <div className="flex items-start justify-between mb-4">
              <div className="relative">
                <img src={emp.avatar} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white shadow-sm" alt={emp.name} />
                <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${emp.status === 'Active' ? 'bg-green-500' : 'bg-orange-500'}`} />
              </div>
              <button className="text-gray-300 hover:text-gray-600">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <h4 className="font-bold text-gray-900">{emp.name}</h4>
              <p className="text-xs text-gray-400 flex items-center mt-1">
                <Mail className="w-3 h-3 mr-1" />
                {emp.email}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center px-3 py-1 bg-pink-100 rounded-xl text-pink-600 text-[10px] font-black uppercase tracking-widest">
                <Shield className="w-3 h-3 mr-1.5" />
                {emp.role}
              </div>
              <button 
                onClick={() => removeEmployee(emp.id)}
                className="text-[10px] font-bold text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Employee Modal */}
      {showAddEmployee && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black">Invite Member</h3>
              <button onClick={() => setShowAddEmployee(false)} className="p-2 bg-gray-50 rounded-full">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Full Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-pink-200 text-sm"
                  placeholder="e.g. John Doe"
                  value={newEmployee.name}
                  onChange={e => setNewEmployee({...newEmployee, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Work Email</label>
                <input 
                  required
                  type="email" 
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-pink-200 text-sm"
                  placeholder="name@company.com"
                  value={newEmployee.email}
                  onChange={e => setNewEmployee({...newEmployee, email: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Role</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Manager', 'Editor', 'Analyst', 'Admin'].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setNewEmployee({...newEmployee, role: role as EmployeeRole})}
                      className={`py-3 px-4 rounded-xl text-xs font-bold border-2 transition-all ${newEmployee.role === role ? 'bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-200' : 'bg-white border-gray-100 text-gray-500 hover:border-pink-200'}`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-black text-white py-4 rounded-2xl font-bold shadow-xl shadow-gray-200 hover:bg-gray-900 transition-colors"
              >
                SEND INVITATION
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex bg-[#FFF5F8] min-h-screen pb-20">
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 bg-white p-6 border-r border-pink-100">
        <div className="flex items-center space-x-3 mb-12">
          <div className="w-10 h-10 bg-pink-500 rounded-2xl shadow-lg shadow-pink-200 flex items-center justify-center">
             <TrendingUp className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-xl text-gray-800">Company</span>
        </div>

        <nav className="space-y-4">
          {[
            { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
            { icon: Users, label: 'Employees', id: 'employees' },
            { icon: Package, label: 'Inventory', id: 'inventory' },
            { icon: MessageSquare, label: 'Inquiries', id: 'inquiries' },
            { icon: BarChart3, label: 'Insights', id: 'insights' },
            { icon: Settings, label: 'Settings', id: 'settings' }
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveSubTab(item.id as BusinessSubTab)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all ${activeSubTab === item.id ? 'bg-pink-500 text-white shadow-lg shadow-pink-200' : 'text-gray-400 hover:bg-pink-50'}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-semibold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Dashboard Content */}
      <main className="flex-grow p-4 md:p-8">
        {/* Mobile Sub-Navigation Tabs */}
        <div className="flex md:hidden space-x-4 mb-6 overflow-x-auto scrollbar-hide py-1">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'employees', label: 'Team' },
            { id: 'inventory', label: 'Stock' },
            { id: 'settings', label: 'Settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as BusinessSubTab)}
              className={`flex-shrink-0 px-6 py-2 rounded-full text-xs font-bold transition-all ${activeSubTab === tab.id ? 'bg-pink-500 text-white shadow-lg' : 'bg-white text-gray-400 shadow-sm'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              {activeSubTab === 'dashboard' ? 'Dashboard' : activeSubTab === 'employees' ? 'Management' : 'Company'}
            </h2>
            <p className="text-gray-400 text-sm font-medium">Welcome back, <span className="text-pink-600 font-bold">Hira R.</span> 👋</p>
          </div>
          <div className="flex space-x-3">
             <button className="flex items-center space-x-2 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-pink-50 font-bold text-sm text-gray-700">
               <Share2 className="w-4 h-4" />
               <span className="hidden sm:inline">Export</span>
             </button>
             <button className="flex items-center space-x-2 bg-pink-500 text-white px-5 py-2.5 rounded-2xl shadow-lg shadow-pink-200 font-bold text-sm">
               <Zap className="w-4 h-4" />
               <span className="hidden sm:inline">Switch Account</span>
               <span className="sm:hidden">Switch</span>
             </button>
          </div>
        </header>

        {activeSubTab === 'dashboard' ? renderDashboard() : activeSubTab === 'employees' ? renderEmployees() : (
          <div className="flex flex-col items-center justify-center h-[500px] text-gray-400 bg-white rounded-[2.5rem] border border-pink-50">
            <Settings className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-bold">Feature coming soon</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default BusinessTab;
