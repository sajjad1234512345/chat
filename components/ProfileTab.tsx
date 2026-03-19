
import React from 'react';
import { 
  Settings, Grid, Bookmark, User, MoreHorizontal, Plus, 
  ChevronDown, Heart, ChevronLeft, CheckCircle2, Link as LinkIcon,
  Clapperboard, Award, SquareUser, Pin, Sparkles, AtSign, MessageCircle
} from 'lucide-react';

const ProfileTab: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
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
        <header className="flex items-center justify-between px-6 py-5 backdrop-blur-xl bg-black/60 sticky top-0 z-50 border-b border-white/5">
          <ChevronLeft className="w-8 h-8 stroke-[2.5] cursor-pointer active:scale-90 transition-transform text-white/80 hover:text-white" onClick={onBack} />
          <div className="flex items-center space-x-2">
            <span className="font-black text-xl tracking-tighter italic brand-text">kdot.coleman</span>
            <div className="bg-blue-500 rounded-full p-[2px] shadow-[0_0_10px_rgba(59,130,246,0.5)]">
              <CheckCircle2 className="w-3.5 h-3.5 fill-blue-500 text-white" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Plus className="w-7 h-7 stroke-[2.5] text-white/80 hover:text-white cursor-pointer" />
            <MoreHorizontal className="w-7 h-7 stroke-[2.5] text-white/80 hover:text-white cursor-pointer" />
          </div>
        </header>

        {/* Profile Stats & Bio */}
        <div className="px-6 mt-8">
          <div className="flex items-center justify-between mb-8">
            <div className="relative group cursor-pointer">
              <div className="w-[108px] h-[108px] rounded-full p-[3px] bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] shadow-[0_0_30px_rgba(214,41,118,0.3)] group-hover:scale-105 transition-transform duration-500">
                <div className="bg-[#0c0c0c] p-[3px] rounded-full w-full h-full">
                  <img 
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400" 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute bottom-1 right-1 bg-blue-600 rounded-full p-1.5 border-4 border-[#0c0c0c] shadow-lg">
                <Plus className="w-3.5 h-3.5 text-white stroke-[4]" />
              </div>
            </div>

            <div className="flex flex-grow justify-around pl-6">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center group cursor-pointer">
                  <span className="text-2xl font-black tracking-tighter leading-none group-hover:scale-110 transition-transform">{stat.value}</span>
                  <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] mt-2">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8 space-y-3">
            <div className="flex items-center space-x-2">
              <h1 className="font-black text-xl tracking-tighter text-white leading-none">Kdot Coleman</h1>
              <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] font-black text-white/40 uppercase tracking-widest">He/Him</span>
            </div>
            
            {/* Custom Notification Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-2xl px-4 py-2 rounded-2xl border border-white/10 shadow-xl">
              <AtSign className="w-3.5 h-3.5 text-pink-500" />
              <span className="text-[13px] font-black text-white/90">kdot.coleman</span>
              <span className="text-white/20 font-black">·</span>
              <span className="text-[13px] font-black text-white/90">2 new threads</span>
              <span className="w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.8)] animate-pulse"></span>
            </div>

            <p className="text-[15px] leading-relaxed font-bold text-white/80 mt-4 max-w-[95%]">
              Sunshine seeker, art lover, and professional daydreamer. Catch me wandering through museums or trying new coffee spots.... <span className="text-pink-500 font-black cursor-pointer hover:underline">more</span>
            </p>

            <div className="flex items-center space-x-4 mt-4">
              <a href="#" className="flex items-center space-x-2 group">
                <div className="p-1.5 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                  <LinkIcon className="w-3.5 h-3.5 text-white/70 rotate-[-45deg]" />
                </div>
                <span className="text-[14px] font-black text-white/90 group-hover:text-white transition-colors">kyan.co</span>
              </a>
              <div className="flex items-center -space-x-2">
                {[1, 2, 3].map(i => (
                  <img key={i} src={`https://picsum.photos/seed/${i+20}/40/40`} className="w-6 h-6 rounded-full border-2 border-[#0c0c0c] object-cover" alt="" />
                ))}
                <span className="pl-3 text-[11px] font-black text-white/40 uppercase tracking-widest">Followed by alex_j + 12 others</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mb-10">
            <button className="flex-[2] bg-white text-black hover:bg-white/90 py-3 rounded-2xl text-[14px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-white/5">
              Follow
            </button>
            <button className="flex-1 bg-white/5 hover:bg-white/10 backdrop-blur-2xl border border-white/10 py-3 rounded-2xl text-[14px] font-black uppercase tracking-widest transition-all active:scale-95">
              Message
            </button>
            <button className="bg-white/5 hover:bg-white/10 backdrop-blur-2xl border border-white/10 px-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center">
              <ChevronDown className="w-5 h-5 text-white stroke-[3]" />
            </button>
          </div>

          {/* Story Highlights */}
          <div className="flex space-x-5 overflow-x-auto scrollbar-hide mb-10 py-2">
            {highlights.map((h) => (
              <div key={h.id} className="flex flex-col items-center space-y-3 flex-shrink-0 group cursor-pointer">
                <div className="w-[82px] h-[82px] rounded-full border-2 border-white/5 p-[3px] bg-white/5 backdrop-blur-2xl group-hover:border-pink-500/50 transition-colors duration-500">
                  <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center overflow-hidden border border-white/10 shadow-2xl">
                    {h.img ? (
                      <img src={h.img} alt={h.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <Plus className="w-8 h-8 text-white/20 stroke-[3]" />
                    )}
                  </div>
                </div>
                <span className="text-[11px] font-black text-white/50 uppercase tracking-widest group-hover:text-white transition-colors">{h.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Post Navigation Tabs */}
        <div className="flex border-t border-white/5 bg-black/60 backdrop-blur-2xl sticky top-[72px] z-40">
          <button className="flex-1 flex justify-center py-4 border-b-2 border-white transition-all">
            <Grid className="w-6 h-6 text-white" />
          </button>
          <button className="flex-1 flex justify-center py-4 text-white/20 hover:text-white/50 transition-all">
            <Clapperboard className="w-6 h-6" />
          </button>
          <button className="flex-1 flex justify-center py-4 text-white/20 hover:text-white/50 transition-all">
            <Award className="w-6 h-6" />
          </button>
          <button className="flex-1 flex justify-center py-4 text-white/20 hover:text-white/50 transition-all">
            <SquareUser className="w-6 h-6" />
          </button>
        </div>

        {/* Content Feed Grid */}
        <div className="grid grid-cols-3 gap-[1px] pb-32">
          {posts.map((post) => (
            <div key={post.id} className="aspect-square bg-zinc-900 relative group cursor-pointer overflow-hidden">
              <img 
                src={post.url} 
                className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-1000" 
                alt="Post" 
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4 text-white fill-white" />
                  <span className="text-xs font-black">1.2K</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4 text-white fill-white" />
                  <span className="text-xs font-black">42</span>
                </div>
              </div>
              {post.isPinned && (
                <div className="absolute top-3 right-3 p-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 shadow-xl">
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
