
import React from 'react';
import { 
  Settings, Grid, Bookmark, User, MoreHorizontal, Plus, 
  ChevronDown, Heart, ChevronLeft, CheckCircle2, Link as LinkIcon,
  Clapperboard, Award, SquareUser, Pin, Sparkles, AtSign
} from 'lucide-react';

const ProfileTab: React.FC = () => {
  const stats = [
    { label: 'posts', value: '151' },
    { label: 'followers', value: '112K' },
    { label: 'following', value: '162' },
  ];

  const highlights = [
    { id: 'h1', label: 'Lifestyle', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200' },
    { id: 'h2', label: 'Family ❤️', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200' },
    { id: 'h3', label: 'Europe', img: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=200' },
    { id: 'h4', label: 'Music', img: 'https://images.unsplash.com/photo-1542291026-7eec264c274f?q=80&w=200' },
    { id: 'new', label: 'New', img: null },
  ];

  const posts = [
    { id: 1, url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600', isPinned: true },
    { id: 2, url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600' },
    { id: 3, url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600' },
    { id: 4, url: 'https://images.unsplash.com/photo-1519311965067-36d3e5f33d39?q=80&w=600' },
    { id: 5, url: 'https://images.unsplash.com/photo-1501183638710-841dd1904538?q=80&w=600' },
    { id: 6, url: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=600' },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-pink-500/30 pb-24 overflow-x-hidden">
      {/* Dynamic Background Glows for Depth */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[100%] h-[70%] bg-pink-900/10 blur-[140px] rounded-full" />
        <div className="absolute top-[30%] right-[-10%] w-[60%] h-[50%] bg-orange-900/10 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 animate-in fade-in duration-700">
        {/* Navigation Header */}
        <header className="flex items-center justify-between px-4 py-4 backdrop-blur-md bg-black/40 sticky top-0 z-50">
          <ChevronLeft className="w-7 h-7 stroke-[2.5]" />
          <div className="flex items-center space-x-1">
            <span className="font-black text-[17px] tracking-tight">kdot.coleman</span>
            <div className="bg-blue-500 rounded-full p-[2px]">
              <CheckCircle2 className="w-3 h-3 fill-blue-500 text-white" />
            </div>
          </div>
          <MoreHorizontal className="w-7 h-7 stroke-[2.5]" />
        </header>

        {/* Profile Stats & Bio */}
        <div className="px-5 mt-4">
          <div className="flex items-center justify-between mb-6">
            <div className="relative">
              <div className="w-[96px] h-[96px] rounded-full p-[3px] bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5]">
                <div className="bg-black p-[2.5px] rounded-full w-full h-full">
                  <img 
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400" 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-grow justify-around pl-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center">
                  <span className="text-xl font-black tracking-tight leading-none">{stat.value}</span>
                  <span className="text-[13px] font-bold text-white/50 mt-1.5">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6 space-y-2">
            <h1 className="font-black text-[15px] tracking-tight text-white leading-none">Kdot Coleman</h1>
            
            {/* Custom Notification Badge */}
            <div className="inline-flex items-center space-x-1.5 bg-white/10 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/5">
              <AtSign className="w-3 h-3 text-white/50" />
              <span className="text-[12px] font-black text-white/90">kdot.coleman</span>
              <span className="text-white/20 font-black">·</span>
              <span className="text-[12px] font-black text-white/90">2 new</span>
              <span className="w-2 h-2 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></span>
            </div>

            <p className="text-[14px] leading-snug font-bold text-white/90 mt-3 max-w-[92%]">
              Sunshine seeker, art lover, and professional daydreamer. Catch me wandering through museums or trying new coffee spots.... <span className="text-white/40">more</span>
            </p>

            <a href="#" className="flex items-center space-x-2 mt-3 group">
              <LinkIcon className="w-4 h-4 text-white/70 rotate-[-45deg]" />
              <span className="text-[14px] font-black text-white group-hover:underline">kyan.co</span>
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 mb-8">
            <button className="flex-[2] bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/5 py-2.5 rounded-xl text-[14px] font-black tracking-tight transition-all active:scale-95">
              Follow
            </button>
            <button className="flex-1 bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/5 py-2.5 rounded-xl text-[14px] font-black tracking-tight transition-all active:scale-95">
              Message
            </button>
            <button className="flex-1 bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/5 py-2.5 rounded-xl text-[14px] font-black tracking-tight transition-all active:scale-95">
              Email
            </button>
            <button className="bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/5 px-3 rounded-xl transition-all active:scale-95 flex items-center justify-center">
              <Plus className="w-5 h-5 text-white stroke-[3]" />
            </button>
          </div>

          {/* Story Highlights */}
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide mb-8 py-1">
            {highlights.map((h) => (
              <div key={h.id} className="flex flex-col items-center space-y-2.5 flex-shrink-0">
                <div className="w-[72px] h-[72px] rounded-full border border-white/10 p-[2.5px] bg-white/5 backdrop-blur-md">
                  <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center overflow-hidden border border-white/10">
                    {h.img ? (
                      <img src={h.img} alt={h.label} className="w-full h-full object-cover grayscale-[0.2]" />
                    ) : (
                      <Plus className="w-8 h-8 text-white/40 stroke-[3]" />
                    )}
                  </div>
                </div>
                <span className="text-[11px] font-black text-white/80 tracking-tight">{h.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Post Navigation Tabs */}
        <div className="flex border-t border-white/10 bg-black/40 backdrop-blur-md sticky top-[68px] z-40">
          <button className="flex-1 flex justify-center py-3.5 border-b-2 border-white">
            <Grid className="w-6 h-6 text-white" />
          </button>
          <button className="flex-1 flex justify-center py-3.5 text-white/30">
            <Bookmark className="w-6 h-6" />
          </button>
          <button className="flex-1 flex justify-center py-3.5 text-white/30">
            <Clapperboard className="w-6 h-6" />
          </button>
          <button className="flex-1 flex justify-center py-3.5 text-white/30">
            <Sparkles className="w-6 h-6" />
          </button>
          <button className="flex-1 flex justify-center py-3.5 text-white/30">
            <SquareUser className="w-6 h-6" />
          </button>
        </div>

        {/* Content Feed Grid */}
        <div className="grid grid-cols-3 gap-[2px] pb-24">
          {posts.map((post) => (
            <div key={post.id} className="aspect-square bg-zinc-900 relative group cursor-pointer overflow-hidden">
              <img 
                src={post.url} 
                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" 
                alt="Post" 
              />
              {post.isPinned && (
                <div className="absolute top-2.5 right-2.5 p-1.5 bg-black/40 backdrop-blur-md rounded-full rotate-45 border border-white/10">
                  <Pin className="w-3.5 h-3.5 text-white fill-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ProfileTab;
