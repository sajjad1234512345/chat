
import React from 'react';
import { Search, TrendingUp, Sparkles, Flame, Clock } from 'lucide-react';

const SearchTab: React.FC = () => {
  const trendingTags = ['#SummerVibe', '#LuxuryMarket', '#Tech2025', '#ArtNFT', '#SustainableStyle'];
  const suggestedPosts = [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1542291026-7eec264c274f?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400',
  ];

  return (
    <div 
      className="flex flex-col animate-in fade-in duration-500 pb-20"
      style={{ height: '970.5px' }}
    >
      <div 
        className="p-4 bg-[#0c0c0c] sticky top-0 z-20"
        style={{ height: '53px' }}
      >
        <div 
          className="relative group flex items-center"
          style={{ height: '29px' }}
        >
          <button 
            className="absolute left-4 text-white/30 group-focus-within:text-pink-500 transition-colors"
            style={{ height: '35px', marginTop: '-7px' }}
          >
            <Search className="w-5 h-5" style={{ height: '20px', marginTop: '-9px' }} />
          </button>
          <input 
            type="text" 
            placeholder="Search items, users, or vibez..." 
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-white shadow-sm focus:ring-1 focus:ring-pink-500/20 transition-all outline-none"
            style={{ height: '35px', marginTop: '-14px' }}
          />
        </div>
      </div>

      <div 
        className="px-4 py-2"
        style={{ height: '195px', width: '349px', marginLeft: '-2px', marginTop: '-2px' }}
      >
        <div 
          className="flex items-center space-x-2 mb-4"
          style={{ height: '32.5px' }}
        >
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Trending Now</h3>
          </div>
        </div>
        <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2">
          {trendingTags.map(tag => (
            <button key={tag} className="flex-shrink-0 bg-white/5 border border-white/5 px-4 py-2 rounded-xl text-[11px] font-bold text-white/80 hover:bg-white/10 transition-colors">
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div 
        className="px-4 py-6"
        style={{ height: '32.5px', fontSize: '7px', lineHeight: '9px', fontWeight: 'normal' }}
      >
        <button style={{ height: '31.5px', width: '70.4688px' }} className="hidden">1</button>
        <button style={{ height: '31.5px' }} className="hidden">2</button>
        <button style={{ height: '31.5px' }} className="hidden">3</button>
        <button style={{ height: '31.5px' }} className="hidden">4</button>
        <div 
          className="flex items-center justify-between mb-4"
          style={{ marginTop: '-12px' }}
        >
          <div 
            className="flex items-center space-x-2"
            style={{ width: '63.9844px', height: '28px', marginLeft: '-24px' }}
          >
            <Sparkles className="w-4 h-4 text-blue-500" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Discover Explore</h3>
          </div>
          <button 
            className="text-[10px] font-black text-pink-500 uppercase tracking-widest"
            style={{ height: '32px' }}
          >See All</button>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {suggestedPosts.map((url, i) => (
            <div key={i} className="aspect-square bg-zinc-900 relative group cursor-pointer overflow-hidden rounded-sm">
              <img src={url} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" alt="" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchTab;
