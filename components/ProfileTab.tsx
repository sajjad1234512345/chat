
import React from 'react';
import { 
  Settings, Grid, Bookmark, User, MoreHorizontal, Plus, 
  ChevronDown, Heart, ChevronLeft, CheckCircle2, Link as LinkIcon,
  Clapperboard, Contact2, Sparkles, Pin, Award, SquareUser
} from 'lucide-react';

const ProfileTab: React.FC = () => {
  const stats = [
    { label: 'posts', value: '151' },
    { label: 'followers', value: '112K' },
    { label: 'following', value: '162' },
  ];

  const highlights = [
    { id: 'h1', label: 'Lifestyle', img: 'https://picsum.photos/seed/life/150/150' },
    { id: 'h2', label: 'Family ❤️', img: 'https://picsum.photos/seed/fam/150/150' },
    { id: 'h3', label: 'Europe', img: 'https://picsum.photos/seed/euro/150/150' },
    { id: 'h4', label: 'Music', img: 'https://picsum.photos/seed/music/150/150' },
    { id: 'new', label: 'New', img: null },
  ];

  const posts = [
    { id: 1, url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop', isPinned: true },
    { id: 2, url: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=800&auto=format&fit=crop' },
    { id: 3, url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop' },
    { id: 4, url: 'https://images.unsplash.com/photo-1519311965067-36d3e5f33d39?q=80&w=800&auto=format&fit=crop' },
    { id: 5, url: 'https://images.unsplash.com/photo-1501183638710-841dd1904538?q=80&w=800&auto=format&fit=crop' },
    { id: 6, url: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=800&auto=format&fit=crop' },
  ];

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white font-sans selection:bg-pink-500/30 pb-20 overflow-x-hidden">
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[60%] bg-orange-500/15 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] right-[-10%] w-[60%] h-[50%] bg-pink-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[10%] w-[70%] h-[60%] bg-purple-600/10 blur-[130px] rounded-full" />
      </div>

      <div className="relative z-10 animate-in fade-in duration-700">
        {/* Profile Specific Header */}
        <header className="flex items-center justify-between px-4 py-4 backdrop-blur-sm bg-black/5 sticky top-0 z-50">
          <ChevronLeft className="w-7 h-7 stroke-[2.5]" />
          <div className="flex items-center space-x-1">
            <span className="font-extrabold text-[17px] tracking-tight">kdot.coleman</span>
            <div className="bg-blue-500 rounded-full p-[2px]">
              <CheckCircle2 className="w-3.5 h-3.5 fill-blue-500 text-white" />
            </div>
          </div>
          <MoreHorizontal className="w-7 h-7 stroke-[2.5]" />
        </header>

        {/* Profile Info Section */}
        <div className="px-5 mt-2">
          <div className="flex items-center justify-between mb-5">
            {/* Avatar with image-matching border */}
            <div className="relative">
              <div className="w-[92px] h-[92px] rounded-full p-[3px] bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]">
                <div className="bg-[#1c1c1c] p-[2px] rounded-full w-full h-full">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Stats - Bold and clean */}
            <div className="flex space-x-10 pr-2">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center">
                  <span className="text-xl font-black tracking-tight">{stat.value}</span>
                  <span className="text-[13px] font-semibold text-white/70 mt-0.5">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bio Section */}
          <div className="mb-6 space-y-1.5">
            <h1 className="font-black text-[15px] tracking-tight text-white">Kdot Coleman</h1>
            
            {/* Username Badge matching exactly */}
            <div className="inline-flex items-center space-x-1.5 bg-white/10 backdrop-blur-xl px-2.5 py-1 rounded-full border border-white/10">
              <img src="https://esm.sh/lucide-react/dist/esm/icons/at-sign.svg" className="w-3 h-3 invert opacity-70" alt="" />
              <span className="text-[12px] font-bold text-white/90">kdot.coleman</span>
              <span className="text-gray-400 font-bold mx-0.5">·</span>
              <span className="text-[12px] font-bold text-white/90">2 new</span>
              <span className="w-2 h-2 bg-blue-500 rounded-full ml-0.5 shadow-sm shadow-blue-500/50"></span>
            </div>

            <p className="text-[14px] leading-snug font-semibold text-white/90 mt-2 max-w-[95%]">
              Sunshine seeker, art lover, and professional daydreamer. Catch me wandering through museums or trying new coffee spots.... <span className="text-white/50 font-bold">more</span>
            </p>

            <a href="#" className="flex items-center space-x-1.5 mt-2.5">
              <LinkIcon className="w-4 h-4 text-white rotate-[-45deg] opacity-80" />
              <span className="text-[14px] font-bold text-white border-b border-white/20 pb-0.5">kyan.co</span>
            </a>
          </div>

          {/* Action Buttons - Glassy look */}
          <div className="flex space-x-2 mb-8">
            <button className="flex-[1.5] bg-white/15 backdrop-blur-xl border border-white/10 py-2.5 rounded-xl text-[14px] font-bold tracking-tight active:scale-95 transition-all">
              Follow
            </button>
            <button className="flex-1 bg-white/15 backdrop-blur-xl border border-white/10 py-2.5 rounded-xl text-[14px] font-bold tracking-tight active:scale-95 transition-all">
              Message
            </button>
            <button className="flex-1 bg-white/15 backdrop-blur-xl border border-white/10 py-2.5 rounded-xl text-[14px] font-bold tracking-tight active:scale-95 transition-all">
              Email
            </button>
            <button className="bg-white/15 backdrop-blur-xl border border-white/10 px-3 rounded-xl active:scale-95 transition-all flex items-center justify-center">
              <Plus className="w-5 h-5 text-white stroke-[3]" />
            </button>
          </div>

          {/* Highlights */}
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide mb-8 py-1">
            {highlights.map((h) => (
              <div key={h.id} className="flex flex-col items-center space-y-2 flex-shrink-0">
                <div className="w-[68px] h-[68px] rounded-full border border-white/20 p-[2.5px] bg-white/5 backdrop-blur-md">
                  <div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-white/10">
                    {h.img ? (
                      <img src={h.img} alt={h.label} className="w-full h-full object-cover" />
                    ) : (
                      <Plus className="w-8 h-8 text-white stroke-[3] opacity-80" />
                    )}
                  </div>
                </div>
                <span className="text-[11px] font-bold text-white/90 tracking-tight">{h.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Bar Section - Glass and precise icons */}
        <div className="flex border-t border-white/10 bg-black/10 backdrop-blur-sm">
          <button className="flex-1 flex justify-center py-3 border-b-2 border-white">
            <Grid className="w-6 h-6 text-white" />
          </button>
          <button className="flex-1 flex justify-center py-3 text-white/50">
            <Award className="w-6 h-6" />
          </button>
          <button className="flex-1 flex justify-center py-3 text-white/50">
            <Clapperboard className="w-6 h-6" />
          </button>
          <button className="flex-1 flex justify-center py-3 text-white/50">
            <Sparkles className="w-6 h-6" />
          </button>
          <button className="flex-1 flex justify-center py-3 text-white/50">
            <SquareUser className="w-6 h-6" />
          </button>
        </div>

        {/* Post Grid with image-matching content */}
        <div className="grid grid-cols-3 gap-[2px]">
          {posts.map((post) => (
            <div key={post.id} className="aspect-square bg-zinc-900 relative group cursor-pointer overflow-hidden">
              <img 
                src={post.url} 
                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" 
                alt="Post" 
              />
              {post.isPinned && (
                <div className="absolute top-2 right-2 p-1.5 bg-black/40 backdrop-blur-md rounded-full rotate-45">
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
