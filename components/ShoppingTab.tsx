
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
    <div className="fixed inset-0 z-[100] bg-[#050505] animate-in fade-in duration-700 overflow-hidden">
      {/* Immersive Interior Background */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2000" 
          className="w-full h-full object-cover brightness-[0.3] saturate-[0.7]" 
          alt="Modern Studio Interior" 
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-transparent to-black/40" />
      </div>

      <div className="relative h-full flex flex-col items-center">
        
        {/* Top Header - Category Selectors */}
        <div className="w-full max-w-lg flex justify-center pt-8 pb-4 z-20">
          <div className="bg-white/5 backdrop-blur-[30px] border border-white/10 rounded-full p-1 flex items-center space-x-1 shadow-2xl">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-white/10 text-white' : 'text-white/20 hover:text-white/50'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Central Workspace */}
        <div className="relative w-full max-w-2xl flex-grow flex items-center justify-center animate-in zoom-in-95 duration-1000">
          
          {/* COMPACT TOP CONTROLS */}
          <div className="absolute top-4 left-6 right-6 flex justify-between items-center z-30">
            <div className="flex items-center space-x-2">
              <button 
                onClick={onBack}
                className="bg-black/60 backdrop-blur-2xl border border-white/10 text-white px-3 py-1.5 rounded-full font-black text-[8px] uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center space-x-1.5 hover:bg-white/5"
              >
                <X className="w-3 h-3" />
                <span>Exit Studio</span>
              </button>

              <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-full pl-2.5 pr-3.5 py-1.5 flex items-center space-x-2 text-white shadow-xl">
                <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse shadow-[0_0_8px_#ec4899]" />
                <span className="text-[8px] font-black uppercase tracking-widest">VirtualFit</span>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
               <button className="p-2.5 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-full text-white/40 hover:text-white transition-all active:scale-90 shadow-xl">
                  <LayoutGrid className="w-3.5 h-3.5" />
               </button>
               <button onClick={onBack} className="p-2.5 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-full text-white/40 hover:text-white transition-all shadow-xl active:rotate-90">
                  <Settings className="w-3.5 h-3.5" />
               </button>
            </div>
          </div>

          {/* SIDE TOOLS STRIP - Decreased size */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 z-30">
            <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-full p-1.5 flex flex-col items-center space-y-3 shadow-2xl">
              <button className="p-2.5 bg-white/10 rounded-full text-white shadow-lg hover:bg-white/20 transition-all"><Plus className="w-4 h-4" /></button>
              <button className="p-2.5 text-white/20 hover:text-white transition-all"><ShoppingCart className="w-4 h-4" /></button>
              <button className="p-2.5 text-white/20 hover:text-white transition-all"><List className="w-4 h-4" /></button>
              <button className="p-2.5 text-white/20 hover:text-white transition-all"><UserIcon className="w-4 h-4" /></button>
            </div>
          </div>

          {/* MAIN STAGE: Model */}
          <div className="relative w-full h-full flex flex-col items-center justify-center pt-12 pb-24 px-8">
             <div className="relative group">
               <img 
                 src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=1200" 
                 className="h-[45vh] sm:h-[60vh] object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)] contrast-[1.05] relative z-10 rounded-[2rem]"
                 alt="Model"
               />
               
               {/* Selection HUD on the model */}
               <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-4 h-4 border-2 border-white/50 rounded-full z-20 animate-ping" />
             </div>

             {/* PRODUCT CARD - More compact, white/glass style as per screenshot */}
             <div className="absolute bottom-6 w-full max-w-[280px] bg-white/95 backdrop-blur-[60px] border border-white/20 rounded-[2rem] p-5 shadow-[0_30px_60px_rgba(0,0,0,0.6)] z-20 animate-in slide-in-from-bottom-8 duration-700 delay-500">
               <div className="flex items-start justify-between">
                 <div className="flex flex-col">
                   <h4 className="text-[14px] font-black text-zinc-900 tracking-tighter uppercase italic leading-none">Basic t-shirt</h4>
                   <p className="text-[18px] font-black text-zinc-900 tracking-tighter mt-1">$105</p>
                   
                   <div className="flex items-center space-x-4 mt-3">
                     <div className="flex flex-col">
                       <span className="text-[7px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Size</span>
                       <span className="text-[9px] font-black text-zinc-800 uppercase">Medium</span>
                     </div>
                     <div className="h-6 w-px bg-zinc-200" />
                     <div className="flex flex-col">
                       <span className="text-[7px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Color Way</span>
                       <div className="flex items-center space-x-1">
                         <div className="w-2 h-2 rounded-full bg-zinc-200 shadow-sm border border-zinc-300" />
                         <span className="text-[9px] font-black text-zinc-800 uppercase">Cloud</span>
                       </div>
                     </div>
                   </div>
                 </div>
                 <button className="bg-zinc-900 px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest text-white hover:bg-zinc-800 transition-all active:scale-95 shadow-lg shrink-0">
                    Edit Item
                 </button>
               </div>
             </div>
          </div>
        </div>

        {/* Decorative Status Bar */}
        <div className="w-full max-w-sm mb-12 flex justify-center items-center z-20">
           <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                 <p className="text-[7px] font-black text-white/30 uppercase tracking-[0.3em]">Hardware: V.Pro</p>
              </div>
              <div className="h-0.5 w-12 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-pink-500/30 rounded-full" />
              </div>
              <p className="text-[7px] font-black text-white/30 uppercase tracking-[0.3em]">Latency: 12ms</p>
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
      <div className="relative min-h-screen flex flex-col animate-in slide-in-from-right duration-500 pb-32 overflow-hidden">
        {/* Background Atmosphere - Match the reference image style */}
        <div className="absolute inset-0 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover brightness-[0.25] grayscale-[0.2]" 
            alt="Dashboard Atmosphere" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/80" />
        </div>

        {/* Main Dashboard Layout */}
        <div className="relative z-10 px-6 pt-10 pb-20 space-y-10 max-w-lg mx-auto w-full">
          
          {/* Header Action Row */}
          <div className="flex justify-between items-center mb-4">
             <button onClick={() => setView('browse')} className="p-4 bg-white/10 backdrop-blur-3xl border border-white/10 rounded-2xl text-white shadow-2xl active:scale-90 transition-all">
                <ArrowLeft className="w-6 h-6" />
             </button>
             <div className="text-center">
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">My Market</h2>
                <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.4em] mt-2">Visionary Dashboard</p>
             </div>
             <button className="p-4 bg-white/10 backdrop-blur-3xl border border-white/10 rounded-2xl text-white/40 shadow-2xl active:rotate-90 transition-all">
                <Settings className="w-6 h-6" />
             </button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-[60px] p-8 rounded-[3.5rem] border border-white/20 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
              <div className="flex justify-between items-center mb-6">
                <div className="p-3 bg-green-500/10 rounded-2xl text-green-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black text-green-400 tracking-widest">+12%</span>
              </div>
              <p className="text-4xl font-black text-white tracking-tighter">$2,450</p>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mt-2">Total Earnings</p>
            </div>
            <div className="bg-white/5 backdrop-blur-[60px] p-8 rounded-[3.5rem] border border-white/20 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
              <div className="flex justify-between items-center mb-6">
                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                  <Eye className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black text-blue-400 tracking-widest">+4.2k</span>
              </div>
              <p className="text-4xl font-black text-white tracking-tighter">12.8k</p>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mt-2">Store Visits</p>
            </div>
          </div>

          {/* Quick Actions */}
          <section>
            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] mb-6 ml-4">Quick Actions</h3>
            <div className="bg-black/40 backdrop-blur-[60px] border border-white/10 rounded-[4rem] p-6 shadow-2xl">
              <div className="grid grid-cols-3 gap-6">
                <button 
                  onClick={() => setView('studio')}
                  className="flex flex-col items-center justify-center space-y-4 group active:scale-95 transition-all"
                >
                  <div className="p-5 bg-pink-600 text-white rounded-[1.8rem] shadow-pink-600/30 group-hover:scale-110 transition-transform shadow-xl">
                    <Plus className="w-7 h-7" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60">Add Item</span>
                </button>
                <button className="flex flex-col items-center justify-center space-y-4 group active:scale-95 transition-all">
                  <div className="p-5 bg-indigo-600 text-white rounded-[1.8rem] shadow-indigo-600/30 group-hover:scale-110 transition-transform shadow-xl">
                    <Package className="w-7 h-7" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60">Orders</span>
                </button>
                <button className="flex flex-col items-center justify-center space-y-4 group active:scale-95 transition-all">
                  <div className="p-5 bg-orange-600 text-white rounded-[1.8rem] shadow-orange-600/30 group-hover:scale-110 transition-transform shadow-xl">
                    <BarChart3 className="w-7 h-7" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60">Analytics</span>
                </button>
              </div>
            </div>
          </section>

          {/* Live Listings */}
          <section>
            <div className="flex justify-between items-center mb-6 ml-4">
              <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em]">Live Listings</h3>
              <button className="text-[10px] font-black text-white uppercase tracking-widest bg-white/10 px-4 py-2 rounded-full border border-white/10 hover:bg-white/20 transition-all">See All</button>
            </div>
            
            <div className="space-y-4">
              {INITIAL_MOCK_PRODUCTS.slice(0, 2).map((product) => (
                <div key={product.id} className="bg-white/5 backdrop-blur-[60px] p-6 rounded-[3rem] border border-white/20 flex items-center justify-between group active:scale-[0.98] transition-all shadow-xl">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <img src={product.image} className="w-20 h-20 rounded-[1.5rem] object-cover border border-white/20 shadow-2xl" alt="" />
                      <div className="absolute -top-2 -right-2 bg-green-500 w-4 h-4 rounded-full border-2 border-zinc-900 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-[16px] font-black text-white tracking-tight">{product.name}</h4>
                      <p className="text-[12px] font-black text-white/40 uppercase tracking-widest mt-1">${product.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="hidden sm:flex flex-col items-end mr-2">
                       <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Active</span>
                       <span className="text-[8px] font-bold text-white/20 uppercase">Listed 2d ago</span>
                    </div>
                    <button className="p-3 bg-white/5 rounded-2xl text-white/30 hover:text-white transition-colors border border-white/5">
                      <MoreHorizontal className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Visionary Promotion HUD */}
          <div className="bg-black/50 backdrop-blur-[80px] border border-white/20 rounded-[3.5rem] p-10 shadow-[0_50px_120px_rgba(0,0,0,0.9)] animate-in slide-in-from-bottom duration-1000 relative overflow-hidden">
             <div className="relative z-10 flex flex-col items-center text-center">
                <div className="p-4 bg-white/10 rounded-[2rem] text-white mb-6">
                   <Sparkles className="w-8 h-8 text-pink-500 animate-pulse" />
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight uppercase italic mb-4">Boost Marketplace Reach</h3>
                <p className="text-white/50 text-xs font-medium leading-relaxed mb-8 max-w-[240px]">Use our advanced AR rendering tools to increase engagement by up to 300%.</p>
                <button className="w-full bg-white text-black py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all">
                  Upgrade Store
                </button>
             </div>
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-[60px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 animate-in fade-in duration-500">
      {/* Search Header */}
      <div className="p-4 bg-[#0c0c0c] sticky top-0 z-20 flex items-center space-x-3">
        <div className="relative group flex-grow">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-pink-500 transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-white shadow-sm focus:ring-1 focus:ring-pink-500/20 transition-all outline-none"
          />
        </div>
        <button 
          onClick={() => setView('my-store')}
          className="w-12 h-12 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-white/50 active:scale-95 transition-all hover:bg-white/10 hover:text-white"
          aria-label="My Market"
        >
          <Store className="w-6 h-6" />
        </button>
      </div>

      {/* Banner / AR Try-on CTA */}
      <div className="px-4 mb-8">
        <div className="relative h-48 rounded-[2.5rem] overflow-hidden group cursor-pointer border border-white/10" onClick={() => setView('ar')}>
          <img 
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700 brightness-[0.7]" 
            alt="AR Try-on" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
            <div className="flex items-center space-x-2 bg-pink-500 w-fit px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest mb-2">
              <Sparkles className="w-3 h-3" />
              <span>Visionary Try-on</span>
            </div>
            <h3 className="text-xl font-black text-white mb-1">VirtualFit Studio</h3>
            <p className="text-xs text-white/60 font-medium">Experience commerce in high fidelity.</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex space-x-3 overflow-x-auto scrollbar-hide px-4 mb-8">
        {['All', 'Fashion', 'Beauty', 'Art'].map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-white text-black shadow-lg' : 'bg-white/5 text-white/40 border border-white/10'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-4 px-4">
        {INITIAL_MOCK_PRODUCTS.filter(p => activeCategory === 'All' || p.category === activeCategory).map(product => (
          <div key={product.id} className="flex flex-col group animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden mb-3 border border-white/5 shadow-xl bg-zinc-900">
              <img src={product.image} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" alt={product.name} />
              <button className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-xl text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Heart className="w-4 h-4" />
              </button>
              <div className="absolute bottom-4 left-4 right-4">
                <button 
                  onClick={() => setView('ar')}
                  className="w-full bg-white/90 backdrop-blur-md text-black py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl transform translate-y-12 group-hover:translate-y-0 transition-transform duration-500 flex items-center justify-center space-x-2"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Try-on</span>
                </button>
              </div>
            </div>
            <div className="px-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-[13px] font-bold text-white/90 truncate pr-2">{product.name}</h4>
                <span className="text-[13px] font-black text-white">${product.price}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{product.rating} • {product.reviews} reviews</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShoppingTab;
