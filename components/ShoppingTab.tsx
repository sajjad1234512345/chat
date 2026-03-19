
import React, { useState } from 'react';
import { 
  Camera, Search, ShoppingCart, Star, Heart, 
  X, Sparkles, Store, ArrowLeft, TrendingUp, Eye, 
  Plus, Package, BarChart3, MoreHorizontal, Settings,
  ChevronRight, Info, LayoutGrid, List, User as UserIcon,
  CreditCard, CheckCircle2, ChevronDown
} from 'lucide-react';
import { Product } from '../types';

const INITIAL_MOCK_PRODUCTS: Product[] = [
  {
    id: 'pr1',
    name: 'Basic White T-Shirt',
    price: 105,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
    category: 'Fashion',
    rating: 4.8,
    reviews: 124,
    seller: 'MinimalStore',
    description: 'A premium cotton t-shirt for daily comfort.'
  },
  {
    id: 'pr2',
    name: 'Rice Moisturizing Cream',
    price: 19,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800',
    category: 'Beauty',
    rating: 4.9,
    reviews: 840,
    seller: 'SkinBio',
    description: 'Natural rice extract cream for glowing skin.'
  },
  {
    id: 'pr3',
    name: 'Streetwear Cargo Pants',
    price: 145,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800',
    category: 'Fashion',
    rating: 4.5,
    reviews: 56,
    seller: 'UrbanEdge',
    description: 'Durable nylon cargo pants with multiple pockets.'
  },
  {
    id: 'pr4',
    name: 'Canvas Wall Art',
    price: 85,
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800',
    category: 'Art',
    rating: 4.7,
    reviews: 210,
    seller: 'ArtDecor',
    description: 'Modern minimalist wall art for your home office.'
  }
];

const ProductStudio: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState('Top Body');
  const categories = ['Full body', 'Top Body', 'Head', 'Pants', 'Foot'];

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] animate-in fade-in duration-1000 overflow-hidden">
      {/* Immersive Interior Background */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2000" 
          className="w-full h-full object-cover brightness-[0.2] saturate-[0.5] scale-110 transition-transform duration-[10s] animate-pulse" 
          alt="Modern Studio Interior" 
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/40 to-transparent" />
      </div>

      <div className="relative h-full flex flex-col items-center">
        
        {/* Top Header - Category Selectors */}
        <div className="w-full max-w-lg flex justify-center pt-12 pb-6 z-20">
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full p-1.5 flex items-center space-x-1 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all italic ${activeCategory === cat ? 'bg-white text-black shadow-2xl scale-105' : 'text-white/30 hover:text-white/60'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Central Workspace */}
        <div className="relative w-full max-w-2xl flex-grow flex items-center justify-center animate-in zoom-in-95 duration-1000">
          
          {/* COMPACT TOP CONTROLS */}
          <div className="absolute top-6 left-8 right-8 flex justify-between items-center z-30">
            <div className="flex items-center space-x-4">
              <button 
                onClick={onBack}
                className="bg-black/60 backdrop-blur-3xl border border-white/10 text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl active:scale-90 transition-all flex items-center space-x-3 hover:bg-white/10 italic"
              >
                <X className="w-5 h-5" />
                <span>Exit Studio</span>
              </button>

              <div className="bg-pink-600/20 backdrop-blur-3xl border border-pink-500/20 rounded-2xl pl-4 pr-6 py-3 flex items-center space-x-3 text-white shadow-2xl">
                <div className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-pulse shadow-[0_0_15px_#ec4899]" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">VirtualFit</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
               <button className="p-3.5 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all active:scale-90 shadow-2xl">
                  <LayoutGrid className="w-5 h-5" />
               </button>
               <button onClick={onBack} className="p-3.5 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all shadow-2xl active:rotate-90">
                  <Settings className="w-5 h-5" />
               </button>
            </div>
          </div>

          {/* SIDE TOOLS STRIP */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 z-30">
            <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-2 flex flex-col items-center space-y-4 shadow-2xl">
              <button className="p-4 bg-white text-black rounded-2xl shadow-2xl hover:scale-110 transition-all active:scale-90"><Plus className="w-5 h-5" /></button>
              <button className="p-4 text-white/30 hover:text-white transition-all active:scale-110"><ShoppingCart className="w-5 h-5" /></button>
              <button className="p-4 text-white/30 hover:text-white transition-all active:scale-110"><List className="w-5 h-5" /></button>
              <button className="p-4 text-white/30 hover:text-white transition-all active:scale-110"><UserIcon className="w-5 h-5" /></button>
            </div>
          </div>

          {/* MAIN STAGE: Model */}
          <div className="relative w-full h-full flex flex-col items-center justify-center pt-16 pb-32 px-10">
             <div className="relative group">
               <div className="absolute -inset-4 bg-pink-600/10 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
               <img 
                 src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=1200" 
                 className="h-[50vh] sm:h-[65vh] object-contain drop-shadow-[0_50px_100px_rgba(0,0,0,0.8)] contrast-[1.1] relative z-10 rounded-[3rem] transition-transform duration-700 group-hover:scale-105"
                 alt="Model"
               />
               
               {/* Selection HUD on the model */}
               <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-6 h-6 border-2 border-white/30 rounded-full z-20 animate-ping" />
               <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full z-20 shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
             </div>

             {/* PRODUCT CARD */}
             <div className="absolute bottom-10 w-full max-w-[340px] bg-white backdrop-blur-3xl border border-white/20 rounded-[3rem] p-8 shadow-[0_50px_120px_rgba(0,0,0,0.8)] z-20 animate-in slide-in-from-bottom-12 duration-1000 delay-500">
               <div className="flex items-start justify-between">
                 <div className="flex flex-col flex-grow">
                   <h4 className="text-[18px] font-black text-zinc-900 tracking-tighter uppercase italic leading-none">Basic t-shirt</h4>
                   <p className="text-[28px] font-black text-zinc-900 tracking-tighter mt-2">$105</p>
                   
                   <div className="flex items-center space-x-6 mt-6">
                     <div className="flex flex-col">
                       <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1.5 italic">Size</span>
                       <span className="text-[13px] font-black text-zinc-800 uppercase italic">Medium</span>
                     </div>
                     <div className="h-10 w-px bg-zinc-100" />
                     <div className="flex flex-col">
                       <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1.5 italic">Color Way</span>
                       <div className="flex items-center space-x-2">
                         <div className="w-3.5 h-3.5 rounded-full bg-zinc-200 shadow-inner border border-zinc-300" />
                         <span className="text-[13px] font-black text-zinc-800 uppercase italic">Cloud</span>
                       </div>
                     </div>
                   </div>
                 </div>
                 <button className="bg-zinc-900 px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-white hover:bg-zinc-800 transition-all active:scale-95 shadow-2xl shrink-0 italic">
                    Edit Item
                 </button>
               </div>
             </div>
          </div>
        </div>

        {/* Decorative Status Bar */}
        <div className="w-full max-w-sm mb-16 flex justify-center items-center z-20">
           <div className="flex items-center space-x-8 bg-black/40 backdrop-blur-2xl px-6 py-3 rounded-full border border-white/5">
              <div className="flex items-center space-x-3">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
                 <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.4em] italic">Hardware: V.Pro</p>
              </div>
              <div className="h-1 w-16 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-pink-500/40 rounded-full" />
              </div>
              <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.4em] italic">Latency: 12ms</p>
           </div>
        </div>
      </div>
    </div>
  );
};

// Main ShoppingTab Component
const ShoppingTab: React.FC = () => {
  const [view, setView] = useState<'browse' | 'ar' | 'my-store' | 'studio'>('browse');
  const [activeCategory, setActiveCategory] = useState('All');

  if (view === 'studio') {
    return <ProductStudio onBack={() => setView('my-store')} />;
  }

  if (view === 'ar') {
    return (
      <div className="fixed inset-0 z-[100] bg-black animate-in fade-in duration-700 overflow-hidden flex items-center justify-center">
        {/* Simple AR Try-on (Reusing background but for quick browse try-on) */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover brightness-[0.45] saturate-[0.7]" 
            alt="Studio Background" 
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/60" />
        </div>
        <div className="relative w-full h-full flex flex-col items-center p-4 sm:p-8">
           <div className="absolute top-10 right-10 flex items-center space-x-4 z-50">
             <button onClick={() => setView('browse')} className="bg-white/10 backdrop-blur-[40px] border border-white/10 rounded-full p-3 text-white active:scale-95 transition-all shadow-2xl hover:bg-white/20">
                <X className="w-6 h-6" />
             </button>
           </div>
           <img 
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop" 
              className="h-[80%] sm:h-[85%] object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)] contrast-[1.05]"
              alt="Model"
            />
        </div>
      </div>
    );
  }

  if (view === 'my-store') {
    return (
      <div className="relative min-h-screen flex flex-col animate-in slide-in-from-right duration-700 pb-32 overflow-hidden">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover brightness-[0.15] grayscale-[0.5] scale-110" 
            alt="Dashboard Atmosphere" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black" />
        </div>

        {/* Main Dashboard Layout */}
        <div className="relative z-10 px-8 pt-16 pb-24 space-y-12 max-w-xl mx-auto w-full">
          
          {/* Header Action Row */}
          <div className="flex justify-between items-center mb-10">
             <button onClick={() => setView('browse')} className="p-5 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl text-white shadow-2xl active:scale-90 transition-all hover:bg-white/10 hover:border-white/20">
                <ArrowLeft className="w-7 h-7" />
             </button>
             <div className="text-center">
                <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none drop-shadow-2xl">My Market</h2>
                <p className="text-[13px] text-pink-500 font-black uppercase tracking-[0.5em] mt-4 italic">Visionary Dashboard</p>
             </div>
             <button className="p-5 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl text-white/40 shadow-2xl active:rotate-90 transition-all hover:bg-white/10 hover:text-white">
                <Settings className="w-7 h-7" />
             </button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[4rem] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] group hover:bg-white/10 transition-all hover:border-white/20">
              <div className="flex justify-between items-center mb-10">
                <div className="p-4 bg-green-500/10 rounded-2xl text-green-400 border border-green-500/20">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <span className="text-[13px] font-black text-green-400 tracking-widest italic">+12%</span>
              </div>
              <p className="text-6xl font-black text-white tracking-tighter italic">$2,450</p>
              <p className="text-[12px] font-black text-white/30 uppercase tracking-[0.4em] mt-4 italic">Total Earnings</p>
            </div>
            <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[4rem] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] group hover:bg-white/10 transition-all hover:border-white/20">
              <div className="flex justify-between items-center mb-10">
                <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20">
                  <Eye className="w-7 h-7" />
                </div>
                <span className="text-[13px] font-black text-blue-400 tracking-widest italic">+4.2k</span>
              </div>
              <p className="text-6xl font-black text-white tracking-tighter italic">12.8k</p>
              <p className="text-[12px] font-black text-white/30 uppercase tracking-[0.4em] mt-4 italic">Store Visits</p>
            </div>
          </div>

          {/* Quick Actions */}
          <section>
            <h3 className="text-[12px] font-black text-white/30 uppercase tracking-[0.6em] mb-10 ml-6 italic">Quick Actions</h3>
            <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[4.5rem] p-10 shadow-2xl">
              <div className="grid grid-cols-3 gap-10">
                <button 
                  onClick={() => setView('studio')}
                  className="flex flex-col items-center justify-center space-y-6 group active:scale-95 transition-all"
                >
                  <div className="p-8 bg-pink-600 text-white rounded-[2.5rem] shadow-[0_20px_40px_rgba(236,72,153,0.3)] group-hover:scale-110 transition-transform shadow-2xl">
                    <Plus className="w-10 h-10" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/60 italic group-hover:text-white transition-colors">Add Item</span>
                </button>
                <button className="flex flex-col items-center justify-center space-y-6 group active:scale-95 transition-all">
                  <div className="p-8 bg-indigo-600 text-white rounded-[2.5rem] shadow-[0_20px_40px_rgba(79,70,229,0.3)] group-hover:scale-110 transition-transform shadow-2xl">
                    <Package className="w-10 h-10" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/60 italic group-hover:text-white transition-colors">Orders</span>
                </button>
                <button className="flex flex-col items-center justify-center space-y-6 group active:scale-95 transition-all">
                  <div className="p-8 bg-orange-600 text-white rounded-[2.5rem] shadow-[0_20px_40px_rgba(234,88,12,0.3)] group-hover:scale-110 transition-transform shadow-2xl">
                    <BarChart3 className="w-10 h-10" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/60 italic group-hover:text-white transition-colors">Analytics</span>
                </button>
              </div>
            </div>
          </section>

          {/* Live Listings */}
          <section>
            <div className="flex justify-between items-center mb-10 ml-6">
              <h3 className="text-[12px] font-black text-white/30 uppercase tracking-[0.6em] italic">Live Listings</h3>
              <button className="text-[11px] font-black text-white uppercase tracking-[0.3em] bg-white/5 px-6 py-3 rounded-2xl border border-white/10 hover:bg-white/10 transition-all italic">See All</button>
            </div>
            
            <div className="space-y-8">
              {INITIAL_MOCK_PRODUCTS.slice(0, 2).map((product) => (
                <div key={product.id} className="bg-white/5 backdrop-blur-3xl p-10 rounded-[4rem] border border-white/10 flex items-center justify-between group active:scale-[0.98] transition-all shadow-2xl hover:bg-white/10 hover:border-white/20">
                  <div className="flex items-center space-x-10">
                    <div className="relative">
                      <div className="absolute -inset-2 bg-gradient-to-tr from-pink-600 to-orange-500 rounded-[2.5rem] blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                      <img src={product.image} className="relative w-28 h-28 rounded-[2.5rem] object-cover border-2 border-white/10 shadow-2xl" alt="" />
                      <div className="absolute -top-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-[4px] border-[#0c0c0c] animate-pulse shadow-lg" />
                    </div>
                    <div>
                      <h4 className="text-[22px] font-black text-white tracking-tight italic uppercase">{product.name}</h4>
                      <p className="text-[16px] font-black text-pink-500 uppercase tracking-[0.3em] mt-3 italic">${product.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="hidden sm:flex flex-col items-end mr-4">
                       <span className="text-[12px] font-black text-green-400 uppercase tracking-[0.3em] italic">Active</span>
                       <span className="text-[10px] font-black text-white/20 uppercase mt-2 italic">Listed 2d ago</span>
                    </div>
                    <button className="p-5 bg-white/5 rounded-3xl text-white/30 hover:text-white transition-all border border-white/5 active:scale-90">
                      <MoreHorizontal className="w-8 h-8" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Visionary Promotion HUD */}
          <div className="bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[4.5rem] p-12 shadow-[0_60px_150px_rgba(0,0,0,1)] animate-in slide-in-from-bottom-12 duration-1000 relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 via-transparent to-blue-600/10 opacity-50" />
             <div className="relative z-10 flex flex-col items-center text-center">
                <div className="p-6 bg-white/5 rounded-[2.5rem] text-white mb-8 border border-white/10 group-hover:scale-110 transition-transform duration-700">
                   <Sparkles className="w-10 h-10 text-pink-500 animate-pulse" />
                </div>
                <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic mb-6 leading-tight">Boost Marketplace Reach</h3>
                <p className="text-white/40 text-[13px] font-medium leading-relaxed mb-10 max-w-[280px] italic">Use our advanced AR rendering tools to increase engagement by up to 300%.</p>
                <button className="w-full bg-white text-black py-6 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.5em] shadow-2xl active:scale-95 transition-all hover:bg-gray-100 italic">
                  Upgrade Store
                </button>
             </div>
             <div className="absolute -top-20 -right-20 w-60 h-60 bg-pink-500/10 rounded-full blur-[100px]" />
             <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/10 rounded-full blur-[100px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 animate-in fade-in duration-700 bg-[#0c0c0c]">
      {/* Search Header */}
      <div className="p-6 bg-[#0c0c0c]/80 backdrop-blur-3xl sticky top-0 z-40 flex items-center space-x-4 border-b border-white/5">
        <div className="relative group flex-grow">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-pink-500 transition-all duration-300">
            <Search className="w-5 h-5" />
          </div>
          <input 
            type="text" 
            placeholder="Search visionary products..." 
            className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-4 pl-14 pr-6 text-[15px] font-medium text-white shadow-inner focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500/30 transition-all outline-none italic"
          />
        </div>
        <button 
          onClick={() => setView('my-store')}
          className="w-14 h-14 bg-white/5 border border-white/10 rounded-[1.5rem] flex items-center justify-center text-white/40 active:scale-90 transition-all hover:bg-white/10 hover:text-white shadow-2xl group"
          aria-label="My Market"
        >
          <Store className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Banner / AR Try-on CTA */}
      <div className="px-6 mb-12 mt-6">
        <div className="relative h-64 rounded-[3.5rem] overflow-hidden group cursor-pointer border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.5)]" onClick={() => setView('ar')}>
          <img 
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-[2s] brightness-[0.5] saturate-[0.8]" 
            alt="AR Try-on" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-10">
            <div className="flex items-center space-x-3 bg-pink-600 w-fit px-5 py-2 rounded-full text-[11px] font-black text-white uppercase tracking-[0.3em] mb-4 shadow-2xl italic">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Visionary Try-on</span>
            </div>
            <h3 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase italic leading-none">VirtualFit Studio</h3>
            <p className="text-[14px] text-white/50 font-medium italic">Experience commerce in high fidelity.</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex space-x-5 overflow-x-auto scrollbar-hide px-6 mb-12">
        {['All', 'Fashion', 'Beauty', 'Art'].map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-10 py-4 rounded-[1.5rem] text-[13px] font-black uppercase tracking-[0.3em] transition-all italic ${activeCategory === cat ? 'bg-white text-black shadow-[0_20px_40px_rgba(255,255,255,0.2)] scale-105' : 'bg-white/5 text-white/30 border border-white/10 hover:bg-white/10 hover:text-white/60'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-8 px-6">
        {INITIAL_MOCK_PRODUCTS.filter(p => activeCategory === 'All' || p.category === activeCategory).map(product => (
          <div key={product.id} className="flex flex-col group animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="relative aspect-[3/4] rounded-[3.5rem] overflow-hidden mb-6 border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] bg-zinc-900">
              <img src={product.image} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-[1.5s] brightness-[0.9]" alt={product.name} />
              <button className="absolute top-6 right-6 p-3.5 bg-black/40 backdrop-blur-xl rounded-2xl text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:scale-110 active:scale-90 border border-white/10">
                <Heart className="w-5 h-5" />
              </button>
              <div className="absolute bottom-6 left-6 right-6">
                <button 
                  onClick={() => setView('ar')}
                  className="w-full bg-white text-black py-4 rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.3em] shadow-2xl transform translate-y-24 group-hover:translate-y-0 transition-all duration-500 flex items-center justify-center space-x-3 italic hover:bg-gray-100 active:scale-95"
                >
                  <Camera className="w-5 h-5" />
                  <span>Try-on</span>
                </button>
              </div>
            </div>
            <div className="px-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-[17px] font-black text-white/90 truncate pr-4 leading-tight italic uppercase tracking-tight">{product.name}</h4>
                <span className="text-[17px] font-black text-pink-500 italic tracking-tight">${product.price}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-[12px] font-black text-white/30 uppercase tracking-[0.2em] italic">{product.rating} • {product.reviews} reviews</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShoppingTab;
