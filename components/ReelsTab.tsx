
import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Send, MoreVertical, Music, Camera, ChevronLeft, Volume2, VolumeX } from 'lucide-react';
import { Reel } from '../types';

const MOCK_REELS: Reel[] = [
  {
    id: 'r1',
    videoUrl: 'https://picsum.photos/seed/reel1/720/1280',
    user: { name: 'art_journey', avatar: 'https://picsum.photos/seed/u1/100/100' },
    caption: 'Painting my way through life. ✨ #art #reels #creative',
    likes: '124K',
    comments: '1.2K',
    audio: 'Original Audio - art_journey'
  },
  {
    id: 'r2',
    videoUrl: 'https://picsum.photos/seed/reel2/720/1280',
    user: { name: 'tech_insider', avatar: 'https://picsum.photos/seed/u2/100/100' },
    caption: 'The future of AR is here! Look at this VirtualFit demo. 🚀 #tech #market',
    likes: '85K',
    comments: '450',
    audio: 'Future Synth - Tech Beats'
  },
  {
    id: 'r3',
    videoUrl: 'https://picsum.photos/seed/reel3/720/1280',
    user: { name: 'chef_mario', avatar: 'https://picsum.photos/seed/u3/100/100' },
    caption: 'Perfect 5-minute pasta. Recipe in bio! 🍝🇮🇹 #foodie #cooking',
    likes: '230K',
    comments: '5.6K',
    audio: 'Mamma Mia - Instrumental'
  }
];

const ReelsTab: React.FC = () => {
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollTop / scrollRef.current.clientHeight);
      if (index !== activeReelIndex) {
        setActiveReelIndex(index);
      }
    }
  };

  return (
    <div className="relative bg-black flex flex-col h-[calc(100vh-112px)] overflow-hidden animate-in fade-in duration-500">
      {/* Internal Controls */}
      <div className="absolute top-0 left-0 right-0 z-40 p-4 flex justify-between items-center bg-gradient-to-b from-black/40 to-transparent">
        <h2 className="text-xl font-black text-white ml-2">Reels</h2>
        <div className="flex items-center space-x-4">
          <button onClick={() => setIsMuted(!isMuted)} className="text-white p-2">
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <Camera className="w-6 h-6 text-white mr-2" />
        </div>
      </div>

      {/* Video Feed */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-grow overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
      >
        {MOCK_REELS.map((reel, index) => (
          <div key={reel.id} className="relative h-[calc(100vh-112px)] w-full snap-start bg-zinc-900">
            {/* Mock Video Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src={reel.videoUrl} 
                className="w-full h-full object-cover opacity-80" 
                alt="Reel content" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            </div>

            {/* Right Side Social Actions */}
            <div className="absolute bottom-20 right-4 flex flex-col items-center space-y-6 z-20">
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="p-2 transition-transform active:scale-90">
                  <Heart className="w-7 h-7 text-white group-hover:fill-red-500 group-hover:text-red-500 transition-colors" />
                </div>
                <span className="text-[10px] text-white font-bold">{reel.likes}</span>
              </div>
              
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="p-2 transition-transform active:scale-90">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <span className="text-[10px] text-white font-bold">{reel.comments}</span>
              </div>

              <div className="flex flex-col items-center group cursor-pointer">
                <div className="p-2 transition-transform active:scale-90">
                  <Send className="w-7 h-7 text-white" />
                </div>
              </div>

              <div className="flex flex-col items-center group cursor-pointer pt-2">
                <MoreVertical className="w-5 h-5 text-white" />
              </div>

              <div className="w-7 h-7 rounded-lg border-2 border-white overflow-hidden p-[2px] mt-2 animate-spin-slow">
                 <div className="w-full h-full bg-zinc-700 rounded-sm flex items-center justify-center overflow-hidden">
                    <img src={reel.user.avatar} className="w-full h-full object-cover" />
                 </div>
              </div>
            </div>

            {/* Bottom Content Overlay */}
            <div className="absolute bottom-10 left-4 right-16 p-2 z-20 flex flex-col space-y-2">
               {/* User Info Stack */}
               <div className="flex flex-col items-start space-y-1.5">
                 <div className="flex items-center space-x-2">
                   <div className="w-7 h-7 rounded-full border border-white/30 p-[1px]">
                     <img src={reel.user.avatar} className="w-full h-full rounded-full object-cover" alt="" />
                   </div>
                   <span className="text-white font-bold text-xs tracking-tight">{reel.user.name}</span>
                 </div>
                 <button className="px-2 py-0.5 rounded-md border border-white/40 text-white text-[8px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                    Follow
                 </button>
               </div>

               {/* Caption */}
               <p className="text-white text-[11px] font-medium line-clamp-2 pr-4 leading-snug">
                 {reel.caption}
               </p>

               {/* Audio Info */}
               <div className="flex items-center space-x-1.5 text-white/80">
                 <Music className="w-3 h-3" />
                 <div className="overflow-hidden w-40">
                    <div className="text-[10px] font-medium whitespace-nowrap animate-marquee">
                      {reel.audio} • {reel.audio}
                    </div>
                 </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* CSS for marquee and slow spin */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 8s linear infinite;
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ReelsTab;
