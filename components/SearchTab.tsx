
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
    <div className="flex flex-col animate-in fade-in duration-700 pb-32 min-h-screen bg-[#0c0c0c]">
      {/* Search Header */}
      <div className="p-6 sticky top-0 z-20 backdrop-blur-xl bg-black/40 border-b border-white/5">
        <div className="relative group flex items-center">
          <Search className="absolute left-5 w-5 h-5 text-white/30 group-focus-within:text-pink-500 transition-colors z-10" />
          <input 
            type="text" 
            placeholder="Search items, users, or vibez..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-[15px] font-bold text-white shadow-2xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500/50 transition-all outline-none placeholder-white/20"
          />
        </div>
      </div>

      {/* Trending Section */}
      <div className="px-6 py-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-orange-500/10 rounded-xl">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Trending Now</h3>
        </div>
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
          {trendingTags.map(tag => (
            <button key={tag} className="flex-shrink-0 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-[13px] font-black text-white/80 hover:bg-white/10 hover:text-white transition-all active:scale-95 shadow-xl">
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Explore Grid */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <Sparkles className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Discover Explore</h3>
          </div>
          <button className="text-[11px] font-black text-pink-500 uppercase tracking-widest hover:underline">See All</button>
        </div>
        
        <div className="grid grid-cols-3 gap-1.5">
          {suggestedPosts.map((url, i) => (
            <div 
              key={i} 
              className={`aspect-square bg-zinc-900 relative group cursor-pointer overflow-hidden rounded-xl shadow-2xl ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
            >
              <img src={url} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-1000" alt="" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchTab;
