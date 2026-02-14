
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
    <div className="flex flex-col animate-in fade-in duration-500 pb-20">
      <div className="p-4 bg-[#0c0c0c] sticky top-0 z-20">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-pink-500 transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <input 
            type="text" 
            placeholder="Search items, users, or vibez..." 
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-white shadow-sm focus:ring-1 focus:ring-pink-500/20 transition-all outline-none"
          />
        </div>
      </div>

      <div className="px-4 py-2">
        <div className="flex items-center space-x-2 mb-4">
          <Flame className="w-4 h-4 text-orange-500" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Trending Now</h3>
        </div>
        <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2">
          {trendingTags.map(tag => (
            <button key={tag} className="flex-shrink-0 bg-white/5 border border-white/5 px-4 py-2 rounded-xl text-[11px] font-bold text-white/80 hover:bg-white/10 transition-colors">
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Discover Explore</h3>
          </div>
          <button className="text-[10px] font-black text-pink-500 uppercase tracking-widest">See All</button>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {suggestedPosts.map((url, i) => (
            <div key={i} className="aspect-square bg-zinc-900 relative group cursor-pointer overflow-hidden rounded-sm">
              <img src={url} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" alt="" />
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-2">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="w-4 h-4 text-white/20" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Recent Searches</h3>
        </div>
        <div className="space-y-2">
          {['Nike Pegasus 40', 'Vintage Cameras', 'Abstract Art'].map(search => (
            <div key={search} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
              <span className="text-sm font-medium text-white/60">{search}</span>
              <TrendingUp className="w-4 h-4 text-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchTab;
