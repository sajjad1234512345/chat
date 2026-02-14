
import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, Search, Filter, ShoppingCart, Star, ChevronRight, X, 
  RotateCw, Heart, Plus, Store, Package, TrendingUp, BarChart3, 
  Eye, ShoppingBag, ArrowLeft, MoreHorizontal, Settings
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

const ShoppingTab: React.FC = () => {
  const [view, setView] = useState<'browse' | 'ar' | 'my-store'>('browse');
  const [activeCategory, setActiveCategory] = useState('All');
  const [allProducts] = useState<Product[]>(INITIAL_MOCK_PRODUCTS);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) { console.error("Error accessing camera:", err); }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  useEffect(() => {
    if (view === 'ar') startCamera();
    else stopCamera();
    return () => stopCamera();
  }, [view]);

  if (view === 'ar') {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
        <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
          <button onClick={() => setView('browse')} className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white">
            <X className="w-6 h-6" />
          </button>
          <div className="flex space-x-2">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-widest">VirtualFit™ Active</div>
          </div>
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white">
            <RotateCw className="w-6 h-6" />
          </div>
        </header>

        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
        
        <div className="absolute bottom-10 left-0 right-0 px-6 flex flex-col items-center space-y-6">
          <div className="w-full max-sm flex space-x-4 overflow-x-auto scrollbar-hide py-2">
            {allProducts.map(p => (
              <div key={p.id} className="min-w-[80px] h-20 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl flex-shrink-0 cursor-pointer hover:border-white transition-all">
                <img src={p.image} className="w-full h-full object-cover" alt="" />
              </div>
            ))}
          </div>
          <button className="bg-white text-black px-12 py-4 rounded-full font-black tracking-widest shadow-2xl active:scale-95 transition-all">
            TAKE SNAPSHOT
          </button>
        </div>
      </div>
    );
  }

  if (view === 'my-store') {
    return (
      <div className="fixed top-14 inset-x-0 bottom-0 z-[40] bg-[#1c1c1c] flex flex-col animate-in slide-in-from-right duration-500 overflow-y-auto pb-32">
        <header className="sticky top-0 z-50 px-6 py-1 flex justify-between items-center bg-[#1c1c1c]/80 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center space-x-4">
            <button onClick={() => setView('browse')} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex flex-col">
              <h2 className="text-lg font-black text-white tracking-tight leading-none">My Market</h2>
              <p className="text-[9px] text-white/40 font-black uppercase tracking-widest mt-0.5">Merchant Center</p>
            </div>
          </div>
          <button className="p-2 bg-white/10 rounded-full text-white/40 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </header>

        <div className="p-6 space-y-8 relative z-10">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <div className="p-2 bg-green-500/20 rounded-xl text-green-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black text-green-400 tracking-widest">+12%</span>
              </div>
              <p className="text-2xl font-black text-white">$2,450</p>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Earnings</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <div className="p-2 bg-blue-500/20 rounded-xl text-blue-400">
                  <Eye className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black text-blue-400 tracking-widest">+4.2k</span>
              </div>
              <p className="text-2xl font-black text-white">12.8k</p>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Visitors</p>
            </div>
          </div>

          <section>
            <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-4 ml-2">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Add Item', icon: Plus, color: 'bg-pink-600' },
                { label: 'Orders', icon: Package, color: 'bg-indigo-600' },
                { label: 'Analytics', icon: BarChart3, color: 'bg-orange-600' },
              ].map((action) => (
                <button key={action.label} className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex flex-col items-center justify-center space-y-2 active:scale-95 transition-all">
                  <div className={`p-3 ${action.color} text-white rounded-2xl shadow-lg`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase text-white/70">{action.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-4 ml-2">
              <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">Live Listings</h3>
              <button className="text-[10px] font-black text-pink-500 uppercase tracking-widest">Manage All</button>
            </div>
            <div className="space-y-4">
              {INITIAL_MOCK_PRODUCTS.slice(0, 3).map((product) => (
                <div key={product.id} className="bg-white/5 p-4 rounded-[2.5rem] border border-white/10 flex items-center justify-between group">
                  <div className="flex items-center space-x-4">
                    <img src={product.image} className="w-16 h-16 rounded-3xl object-cover" alt="" />
                    <div>
                      <h4 className="text-sm font-black text-white truncate max-w-[120px]">{product.name}</h4>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-0.5">${product.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-[8px] font-black uppercase rounded-lg">Active</span>
                    <button className="p-2 text-white/20 hover:text-white">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-gradient-to-br from-indigo-600/80 to-purple-700/80 backdrop-blur-xl rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-2 tracking-tight">Boost Your Reach</h3>
              <p className="text-white/70 text-sm mb-6 font-medium">Get 5x more visibility on your new collection with SmartMarket™ Ads.</p>
              <button className="w-full bg-white text-indigo-700 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                START PROMOTION
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 animate-in fade-in duration-500">
      {/* Header Search matching Image Style */}
      <header className="px-4 pt-6 pb-6 flex items-center space-x-3 sticky top-0 z-40 bg-[#121212]/50 backdrop-blur-md">
        <div className="flex-grow relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
            <Search className="w-5 h-5" />
          </div>
          <input 
            type="text" 
            placeholder="Search marketplace..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-pink-500/20 transition-all outline-none"
          />
        </div>
        <button 
          onClick={() => setView('my-store')}
          className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/70 shadow-sm active:scale-95 transition-all hover:bg-white/10"
        >
          <Store className="w-6 h-6" />
        </button>
        <button 
          onClick={() => setView('ar')}
          className="w-12 h-12 bg-pink-600/20 text-pink-500 border border-pink-500/20 rounded-2xl flex items-center justify-center shadow-sm active:scale-95 transition-all hover:bg-pink-600/30"
        >
          <Camera className="w-6 h-6" />
        </button>
      </header>

      {/* Hero Banner */}
      <section className="px-4 mb-8">
        <div className="relative h-72 rounded-[2.5rem] overflow-hidden group shadow-2xl border border-white/5">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-375260702097c?auto=format&fit=crop&q=80&w=1200" 
            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" 
            alt="Summer Collection" 
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col justify-center p-8">
            <h2 className="text-white text-4xl font-black mb-2 tracking-tight">Summer Collection</h2>
            <p className="text-white/70 text-sm font-medium mb-8">Up to 40% OFF on all activewear</p>
            <button className="w-fit bg-white text-black px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">
              SHOP NOW
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <nav className="px-4 mb-8 overflow-x-auto flex items-center space-x-8 scrollbar-hide">
        {['All', 'Fashion', 'Beauty', 'Tech', 'Home', 'Art'].map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            className="flex-shrink-0 relative group py-2"
          >
            <span className={`text-base font-black transition-colors ${activeCategory === cat ? 'text-white' : 'text-white/30 group-hover:text-white/50'}`}>
              {cat}
            </span>
            {activeCategory === cat && (
              <div className="absolute -bottom-1 left-0 right-0 h-[3px] bg-pink-500 rounded-full animate-in slide-in-from-left duration-300" />
            )}
          </button>
        ))}
      </nav>

      {/* Product Grid */}
      <div className="px-4 grid grid-cols-2 gap-4">
        {allProducts.map(product => (
          <div key={product.id} className="bg-white/5 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-white/10 group active:scale-[0.98] transition-all cursor-pointer">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img 
                src={product.image} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                alt={product.name} 
              />
              <button className="absolute top-4 right-4 w-9 h-9 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 hover:bg-pink-600 transition-all">
                <Heart className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5">
              <h4 className="text-sm font-black text-white truncate mb-0.5">{product.name}</h4>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-4">{product.seller}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-white">${product.price}</span>
                <div className="flex items-center space-x-1.5 bg-white/5 px-2 py-1 rounded-lg">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-[10px] font-black text-white/70">{product.rating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShoppingTab;
