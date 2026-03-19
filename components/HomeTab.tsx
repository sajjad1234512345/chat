import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Plus, Play, Pause, RotateCcw, RotateCw, Subtitles, Volume2, VolumeX, Maximize, X, ChevronLeft, ChevronRight, Smile, Eye, MessageSquare, ChevronUp, Layers, Music, Gift } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Post, Story, StoryViewerInfo } from '../types';

const MOCK_VIEWERS: StoryViewerInfo[] = [
  { id: 'v1', name: 'hira_rahman', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100', hasLiked: true, comment: 'Looking great! 🔥', time: '2m ago', replies: [] },
  { id: 'v2', name: 'alex_j', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100', hasLiked: true, time: '15m ago', replies: [] },
  { id: 'v3', name: 'pixel_art', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100', comment: 'Where is this? 😍', time: '1h ago', replies: [] },
  { id: 'v4', name: 'urban_explorer', avatar: 'https://picsum.photos/seed/urban/100/100', time: '3h ago', replies: [] },
  { id: 'v5', name: 'tech_guru', avatar: 'https://picsum.photos/seed/tech/100/100', hasLiked: true, time: '4h ago', replies: [] },
];

const MOCK_STORIES: Story[] = [
  { 
    id: '1', 
    user: 'Your Story', 
    avatar: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=200', 
    viewed: false, 
    media: ['https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1200'],
    viewers: MOCK_VIEWERS
  },
  { id: '2', user: 'Hira', avatar: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=200', viewed: false, media: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200'] },
  { id: '3', user: 'alex_j', avatar: 'https://images.unsplash.com/photo-1550147760-44c9966d6bc7?auto=format&fit=crop&q=80&w=200', viewed: false, media: ['https://images.unsplash.com/photo-1550147760-44c9966d6bc7?q=80&w=1200'] },
  { id: '4', user: 'marta_k', avatar: 'https://images.unsplash.com/photo-1519311965067-36d3e5f33d39?auto=format&fit=crop&q=80&w=200', viewed: false, media: ['https://images.unsplash.com/photo-1519311965067-36d3e5f33d39?q=80&w=1200'] },
  { id: '5', user: 'pixel_art', avatar: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=200', viewed: false, media: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1200'] },
  { id: '6', user: 'dev_crew', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&get=80&w=200', viewed: false, media: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200'] },
];

const MOCK_POSTS: Post[] = [
  {
    id: 'p2',
    user: { name: 'urban_explorer', avatar: 'https://picsum.photos/seed/urban/100/100' },
    media: [
      { type: 'video', url: 'https://res.cloudinary.com/demo/video/upload/q_auto/dog.mp4' }
    ],
    likes: 42301,
    caption: 'Night vibes in the heart of the city. Everything moves so fast.',
    comments: 120,
    time: 'TRENDING'
  },
  {
    id: 'p1',
    user: { name: 'tech_guru', avatar: 'https://picsum.photos/seed/tech/100/100' },
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?auto=format&fit=crop&q=80&w=800' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1439405326854-014607f694d7?auto=format&fit=crop&q=80&w=800' }
    ],
    likes: 105893,
    caption: 'Discovering hidden paths on the sand. A three-part journey into the horizon.',
    comments: 452,
    time: 'RECOMMENDED'
  }
];

const ActivityPanel: React.FC<{ viewers: StoryViewerInfo[], onClose: () => void }> = ({ viewers: initialViewers, onClose }) => {
  const [viewers, setViewers] = useState<StoryViewerInfo[]>(initialViewers);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  
  const [panelHeight, setPanelHeight] = useState(48);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartY = useRef(0);
  const initialTouchHeight = useRef(48);

  const startDrag = (clientY: number) => {
    touchStartY.current = clientY;
    initialTouchHeight.current = panelHeight;
    setIsDragging(true);
  };

  const onDrag = (clientY: number) => {
    if (!isDragging) return;
    const deltaPx = touchStartY.current - clientY;
    const deltaVh = (deltaPx / window.innerHeight) * 100;
    const newHeight = Math.max(10, Math.min(95, initialTouchHeight.current + deltaVh));
    setPanelHeight(newHeight);
  };

  const endDrag = () => {
    setIsDragging(false);
    if (panelHeight < 30) {
      onClose();
    } else if (panelHeight > 70) {
      setPanelHeight(95);
    } else {
      setPanelHeight(48);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => startDrag(e.touches[0].clientY);
  const handleTouchMove = (e: React.TouchEvent) => onDrag(e.touches[0].clientY);
  const handleTouchEnd = () => endDrag();

  const handleMouseDown = (e: React.MouseEvent) => {
    startDrag(e.clientY);
    const handleMouseMove = (me: MouseEvent) => onDrag(me.clientY);
    const handleMouseUp = () => {
      endDrag();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleSendReply = (viewerId: string) => {
    if (!replyText.trim()) return;
    setViewers(prev => prev.map(v => {
      if (v.id === viewerId) {
        return { ...v, replies: [...(v.replies || []), replyText] };
      }
      return v;
    }));
    setReplyingToId(null);
    setReplyText('');
  };

  const handleToggleCommentLike = (viewerId: string) => {
    setViewers(prev => prev.map(v => {
      if (v.id === viewerId) {
        return { ...v, commentLikedByMe: !v.commentLikedByMe };
      }
      return v;
    }));
  };

  return (
    <div 
      className={`absolute inset-x-0 bottom-0 z-[120] bg-[#0c0c0c] rounded-t-[3rem] border-t border-white/10 p-6 flex flex-col shadow-[0_-20px_100px_rgba(0,0,0,1)] overflow-hidden ${!isDragging ? 'transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)' : ''}`}
      style={{ height: `${panelHeight}vh` }}
      onClick={(e) => e.stopPropagation()}
    >
      <div 
        className="w-full pt-2 pb-8 cursor-ns-resize flex justify-center flex-shrink-0 select-none touch-none active:cursor-grabbing group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        <div className="w-16 h-1.5 bg-white/10 rounded-full group-hover:bg-white/30 transition-colors" />
      </div>
      
      <div className="flex items-center justify-between mb-8 flex-shrink-0 px-2">
        <div className="flex items-center space-x-4">
          <h3 className="text-xl font-black tracking-tighter text-white uppercase italic">Activity</h3>
          <div className="bg-pink-600/20 px-3 py-1 rounded-full flex items-center justify-center min-w-[28px] border border-pink-500/20">
            <span className="text-[12px] text-pink-500 font-black italic">{viewers.length}</span>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <X className="w-6 h-6 text-white/40" />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto space-y-8 scrollbar-hide pb-12">
        {viewers.map((v) => (
          <div key={v.id} className="flex flex-col space-y-5 px-1">
            <div className="flex items-center justify-between group">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute -inset-1 bg-pink-600/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                  <img src={v.avatar} className="relative w-14 h-14 rounded-full object-cover border-2 border-white/10 shadow-xl" alt="" />
                  {v.hasLiked && (
                    <div className="absolute -bottom-1 -right-1 bg-pink-600 rounded-full p-1.5 border-[3px] border-[#0c0c0c] shadow-lg">
                      <Heart className="w-2.5 h-2.5 text-white fill-current" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <p className="text-[15px] font-black tracking-tight text-white leading-none italic uppercase">{v.name}</p>
                  {v.comment ? (
                    <p className="text-[13px] text-white/80 font-medium italic mt-2 line-clamp-1 leading-tight bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">"{v.comment}"</p>
                  ) : (
                    <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em] mt-2.5 italic">{v.time}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => handleToggleCommentLike(v.id)}
                  className={`p-3 rounded-2xl transition-all active:scale-90 ${v.commentLikedByMe ? 'text-red-500 bg-red-500/10 border border-red-500/20' : 'text-white/40 hover:text-white/80 bg-white/5 border border-white/10'}`}
                >
                  <Heart className={`w-5 h-5 ${v.commentLikedByMe ? 'fill-current' : ''}`} />
                </button>
                
                {v.comment && (
                  <button 
                    onClick={() => setReplyingToId(replyingToId === v.id ? null : v.id)}
                    className={`p-3 rounded-2xl transition-all active:scale-90 ${replyingToId === v.id ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30' : 'text-white/40 hover:text-white/80 bg-white/5 border border-white/10'}`}
                  >
                    <MessageSquare className="w-5 h-5" />
                  </button>
                )}
                
                <button className="px-6 py-3 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-xl hover:bg-gray-100 italic">
                  GIFT
                </button>
              </div>
            </div>

            {v.replies && v.replies.map((reply, idx) => (
              <div key={idx} className="ml-18 flex items-start space-x-4 animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="w-1 h-8 bg-pink-600/40 rounded-full mt-1.5 flex-shrink-0" />
                <div className="flex flex-col">
                  <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] leading-none italic">You</p>
                  <p className="text-[14px] text-white/90 font-medium mt-2 leading-relaxed">{reply}</p>
                </div>
              </div>
            ))}

            {replyingToId === v.id && (
              <div className="ml-18 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center space-x-4 bg-white/5 border border-white/10 rounded-[1.5rem] p-2.5 pl-6 shadow-2xl focus-within:border-pink-500/50 transition-colors">
                  <input 
                    autoFocus
                    type="text" 
                    placeholder={`Reply to ${v.name}...`}
                    className="bg-transparent border-none outline-none text-[13px] font-medium text-white placeholder-white/20 flex-grow"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendReply(v.id)}
                  />
                  <button 
                    onClick={() => handleSendReply(v.id)}
                    className="p-3 bg-pink-600 rounded-2xl text-white disabled:opacity-50 active:scale-90 transition-all shadow-lg shadow-pink-600/20"
                    disabled={!replyText.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const StoryViewer: React.FC<{ stories: Story[], initialIndex: number, onClose: () => void }> = ({ stories, initialIndex, onClose }) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialIndex);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showActivity, setShowActivity] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const dragY = useMotionValue(0);
  const scale = useTransform(dragY, [0, 300], [1, 0.8]);
  const bgOpacity = useTransform(dragY, [0, 300], [0.8, 0]);
  const blurValue = useTransform(dragY, [0, 300], [20, 0]);
  const borderRadius = useTransform(dragY, [0, 300], [0, 40]);

  const currentStory = stories[currentStoryIndex];
  const storyMedia = currentStory.media || [];
  const isMyStory = currentStory.user === 'Your Story';

  useEffect(() => {
    if (showActivity || isPaused) return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [currentStoryIndex, currentMediaIndex, showActivity, isPaused]);

  const handleNext = () => {
    if (currentMediaIndex < storyMedia.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1);
    } else if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setCurrentMediaIndex(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1);
    } else if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      const prevMedia = stories[currentStoryIndex - 1].media;
      setCurrentMediaIndex(prevMedia?.length ? prevMedia.length - 1 : 0);
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 z-[100] touch-none flex items-center justify-center overflow-hidden"
      style={{ 
        backgroundColor: useTransform(bgOpacity, (v) => `rgba(0, 0, 0, ${v})`),
        backdropFilter: useTransform(blurValue, (v) => `blur(${v}px)`)
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: 800, transition: { duration: 0.1, ease: "circIn" } }}
    >
      <motion.div 
        drag="y"
        dragConstraints={{ top: 0, bottom: 1000 }}
        dragElastic={0.2}
        onDragStart={() => setIsDragging(true)}
        onDrag={(_, info) => {
          if (info.offset.y > 5) {
            onClose();
          }
        }}
        onDragEnd={() => {
          setIsDragging(false);
        }}
        style={{ 
          y: dragY,
          scale,
          borderRadius,
        }}
        className="w-full h-full relative overflow-hidden"
      >
        <div className="absolute top-6 left-6 right-6 z-50 flex space-x-2">
          {currentStory.media?.map((_, idx) => (
            <div key={idx} className="h-1.5 flex-grow bg-white/20 rounded-full overflow-hidden backdrop-blur-md">
              <div 
                className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all duration-75" 
                style={{ width: idx < currentMediaIndex ? '100%' : idx === currentMediaIndex ? `${progress}%` : '0%' }}
              />
            </div>
          ))}
        </div>

        <div className="absolute top-12 left-6 right-6 z-50 flex items-center justify-between">
          <div className="flex items-center space-x-4 group cursor-pointer">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-tr from-pink-600 to-orange-500 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
              <img src={currentStory.avatar} className="relative w-12 h-12 rounded-full border-2 border-white/20 shadow-2xl" alt="" />
            </div>
            <div className="flex flex-col">
              <span className="text-white text-[15px] font-black tracking-tight italic uppercase">{currentStory.user}</span>
              <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em] italic mt-1">4h ago</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-90">
            <X className="w-7 h-7 text-white" />
          </button>
        </div>

        <div 
          className="w-full h-full flex items-center justify-center relative select-none"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <img 
            src={storyMedia[currentMediaIndex]} 
            className="w-full h-full object-cover pointer-events-none" 
            alt="Story content" 
          />
          {/* Tappable areas for next/prev navigation */}
          {!isPaused && (
            <>
              <div className="absolute inset-y-0 left-0 w-1/4 z-40" onClick={(e) => { e.stopPropagation(); handlePrev(); }} />
              <div className="absolute inset-y-0 right-0 w-1/4 z-40" onClick={(e) => { e.stopPropagation(); handleNext(); }} />
            </>
          )}
        </div>

        {!showActivity && (
          <>
            {/* Sidebar Icons (Smile, Layers, Music) */}
            {!isMyStory && (
              <div className="absolute left-6 bottom-32 flex flex-col items-center space-y-8 z-50 animate-in slide-in-from-left duration-700">
                <button className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] active:scale-125 transition-all hover:text-pink-400">
                  <Smile className="w-6 h-6" />
                </button>
                <button className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] active:scale-125 transition-all hover:text-blue-400">
                  <Layers className="w-6 h-6" />
                </button>
                <button className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] active:scale-125 transition-all hover:text-purple-400">
                  <Music className="w-6 h-6" />
                </button>
              </div>
            )}

            <div className="absolute bottom-10 left-6 right-6 z-50 flex items-center space-x-5">
            {isMyStory ? (
              <div 
                className="flex-grow flex items-center justify-center space-x-4 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] py-4 px-8 cursor-pointer active:scale-95 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)] group"
                onClick={(e) => { e.stopPropagation(); setShowActivity(true); }}
              >
                <div className="flex -space-x-2">
                  {currentStory.viewers?.slice(0, 3).map((v, i) => (
                    <img key={i} src={v.avatar} className="w-5 h-5 rounded-full border-2 border-black shadow-lg" alt="" />
                  ))}
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-[12px] font-black uppercase tracking-[0.4em] text-white italic">
                    {currentStory.viewers?.length} Viewers
                  </span>
                  <ChevronUp className="w-5 h-5 text-pink-500 animate-bounce" />
                </div>
              </div>
            ) : (
              <>
                <div className="flex-grow bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[1.5rem] px-6 py-3.5 shadow-2xl focus-within:border-white/30 transition-colors">
                  <input 
                    type="text" 
                    placeholder="Send message..." 
                    className="bg-transparent text-white text-[15px] w-full outline-none placeholder-white/30 font-medium italic" 
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <button className="active:scale-125 transition-transform">
                  <Heart className="w-8 h-8 text-white drop-shadow-lg" />
                </button>
                <button className="active:scale-125 transition-transform">
                  <Send className="w-8 h-8 text-white drop-shadow-lg" />
                </button>
              </>
            )}
          </div>
          </>
        )}
      </motion.div>

      {showActivity && isMyStory && currentStory.viewers && (
        <>
          <div className="absolute inset-0 z-[110]" onClick={() => setShowActivity(false)} />
          <ActivityPanel viewers={currentStory.viewers} onClose={() => setShowActivity(false)} />
        </>
      )}
    </motion.div>
  );
};

// Simplified Video Player Component (Control bar visibility toggled on click, no pause toggle)
const VideoPlayer: React.FC<{ url: string }> = ({ url }) => {
  const [isPlaying] = useState(true); // Always auto-playing
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleVideoClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    if (showControls) {
      // If already showing, hide them immediately on the second click
      setShowControls(false);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    } else {
      // If hidden, show them and set a 3s auto-hide timer
      setShowControls(true);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div 
      className="relative w-full h-full bg-black cursor-pointer"
      onClick={() => handleVideoClick()}
    >
      <video 
        ref={videoRef}
        src={url} 
        className="w-full h-full object-cover" 
        autoPlay 
        loop 
        muted={isMuted}
        playsInline 
        onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
      />
      
      {/* Refined and Simplified Video Bar (Controlled by click toggle visibility) */}
      <div className={`absolute bottom-3 left-4 right-4 z-20 transition-all duration-300 pointer-events-none ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="glass bg-white/5 backdrop-blur-[35px] border border-white/10 rounded-[1.25rem] px-5 py-2 flex items-center space-x-4 shadow-2xl pointer-events-auto" onClick={(e) => e.stopPropagation()}>
          
          {/* Timestamp Display */}
          <div className="text-[11px] font-medium text-white/90 min-w-[75px] tabular-nums tracking-tight">
            {formatTime(currentTime)} / {formatTime(duration || 0)}
          </div>

          {/* Progress Slider */}
          <div className="flex-grow h-[3px] bg-white/20 rounded-full relative group/slider cursor-pointer">
             <div 
               className="absolute top-0 left-0 h-full bg-white/80 rounded-full"
               style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
             />
             <div 
               className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.4)] transition-transform group-hover/slider:scale-125"
               style={{ left: `${(currentTime / (duration || 1)) * 100}%`, transform: 'translate(-50%, -50%)' }}
             />
          </div>

          {/* Right End Icons Group (Retained CC and Volume) */}
          <div className="flex items-center space-x-4 text-white/80">
            <button className="hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}><Subtitles className="w-4 h-4" /></button>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
              className="hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PostItem: React.FC<{ post: Post }> = ({ post }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
      setCurrentMediaIndex(index);
    }
  };

  const toggleLike = () => setIsLiked(!isLiked);
  const toggleBookmark = () => setIsBookmarked(!isBookmarked);

  return (
    <article className="flex flex-col bg-[#0c0c0c] border-b border-white/5 mb-10 pb-4">
      <header 
        className="px-6 py-5 flex items-center justify-between"
      >
        <div 
          className="flex items-center space-x-4 cursor-pointer group"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-tr from-pink-600 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
            <img src={post.user.avatar} className="relative w-11 h-11 rounded-full object-cover border-2 border-white/10 shadow-xl" alt="" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-[15px] leading-none tracking-tight text-white italic uppercase">{post.user.name}</span>
            <span className="text-[10px] font-black text-white/40 tracking-[0.3em] mt-2 uppercase italic">{post.time}</span>
          </div>
        </div>
        <button className="p-2.5 hover:bg-white/5 rounded-2xl transition-all active:scale-90">
          <MoreHorizontal className="text-white/60 w-6 h-6" />
        </button>
      </header>
      
      <div className="px-5">
        <div className="relative w-full aspect-[4/5] bg-zinc-900 overflow-hidden rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] border border-white/10 group">
          {post.media.length > 1 && (
            <div className="absolute top-8 right-8 z-10 bg-black/60 backdrop-blur-2xl px-4 py-1.5 rounded-full text-[11px] font-black text-white tracking-[0.2em] border border-white/20 shadow-2xl">
              {currentMediaIndex + 1}/{post.media.length}
            </div>
          )}
          
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          >
            {post.media.map((item, idx) => (
              <div key={idx} className="flex-shrink-0 w-full h-full snap-center relative">
                {item.type === 'image' ? (
                  <img src={item.url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="" />
                ) : (
                  <VideoPlayer url={item.url} />
                )}
              </div>
            ))}
          </div>
          {post.media.length > 1 && (
            <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2.5 z-10">
              {post.media.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentMediaIndex ? 'bg-white w-6 shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-white/20 w-1.5'}`} 
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="px-6 py-6">
        <div className="flex justify-between items-center mb-6 px-1">
          <div className="flex items-center space-x-7">
            <button onClick={toggleLike} className="p-1 active:scale-[1.3] transition-all duration-300">
              <Heart 
                className={`w-8 h-8 transition-all ${isLiked ? 'text-red-500 fill-current drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'text-white hover:text-white/80'}`} 
              />
            </button>

            <button 
              className="flex items-center space-x-3 bg-white/5 border border-white/10 px-5 py-2.5 rounded-2xl text-white active:scale-95 transition-all hover:bg-white/10 hover:border-white/20 shadow-xl group"
              onClick={(e) => { e.stopPropagation(); }}
            >
              <Gift className="w-5 h-5 text-pink-500 group-hover:animate-bounce" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">Gift</span>
            </button>

            <button className="p-1 active:scale-110 transition-all hover:text-white/80">
              <MessageCircle className="w-8 h-8 text-white" />
            </button>
            <button className="p-1 active:scale-110 transition-all hover:text-white/80">
              <Send className="w-8 h-8 text-white" />
            </button>
          </div>
          <button onClick={toggleBookmark} className="p-1 active:scale-110 transition-all">
            <Bookmark 
              className={`w-8 h-8 transition-all ${isBookmarked ? 'text-white fill-current' : 'text-white hover:text-white/80'}`} 
            />
          </button>
        </div>
        <div 
          className="px-1 space-y-3"
        >
          <p className="text-[18px] font-black text-white tracking-tight italic">
            {(isLiked ? post.likes + 1 : post.likes).toLocaleString()} <span className="text-white/60 text-[14px] uppercase tracking-widest not-italic ml-1">Likes</span>
          </p>
          <div className="text-[16px] leading-relaxed">
            <span className="font-black mr-2 text-white italic uppercase tracking-tight">{post.user.name}</span>
            <span className="text-white/90 font-medium">{post.caption}</span>
          </div>
          <button className="text-white/40 text-[12px] font-black mt-4 uppercase tracking-[0.2em] hover:text-white/80 transition-all flex items-center space-x-2 group">
            <span className="italic">View all {post.comments} comments</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </footer>
    </article>
  );
};

const HomeTab: React.FC<{ 
  onStoryToggle?: (active: boolean) => void;
  onAddStory?: () => void;
}> = ({ onStoryToggle, onAddStory }) => {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  useEffect(() => {
    onStoryToggle?.(activeStoryIndex !== null);
  }, [activeStoryIndex, onStoryToggle]);

  return (
    <div className="flex flex-col animate-in fade-in duration-500 pb-20">
      <div 
        className="flex items-center space-x-7 overflow-x-auto scrollbar-hide px-6 pt-8 pb-6 border-b border-white/5 bg-[#0c0c0c]/80 backdrop-blur-xl sticky top-0 z-40"
      >
        {MOCK_STORIES.map((story, i) => (
          <div 
            key={story.id} 
            className="flex-shrink-0 flex flex-col items-center space-y-3 cursor-pointer active:scale-95 transition-all group"
            onClick={() => setActiveStoryIndex(i)}
          >
            <div 
              className="relative"
            >
              <div className={`p-[3px] rounded-full transition-all duration-500 group-hover:scale-105 ${story.viewed ? 'bg-white/10' : 'bg-gradient-to-tr from-pink-600 via-purple-600 to-orange-500 shadow-xl shadow-pink-500/20'}`}>
                <div className="w-[72px] h-[72px] rounded-full overflow-hidden border-[3px] border-[#0c0c0c]">
                  <img src={story.avatar} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                </div>
              </div>
              {i === 0 && (
                <div 
                  className="absolute bottom-1 right-1 bg-blue-600 rounded-full p-2 border-[3px] border-[#0c0c0c] shadow-xl cursor-pointer hover:bg-blue-500 transition-all z-10 active:scale-90"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddStory?.();
                  }}
                >
                  <Plus className="w-4 h-4 text-white stroke-[4]" />
                </div>
              )}
            </div>
            <span className="text-[12px] font-black text-white/90 tracking-tight leading-none text-center max-w-[80px] truncate italic uppercase">{story.user}</span>
          </div>
        ))}
      </div>

      <div 
        className="flex flex-col"
        style={{ height: '1000.5px' }}
      >
        {MOCK_POSTS.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>

      <AnimatePresence>
        {activeStoryIndex !== null && (
          <StoryViewer 
            key="story-viewer"
            stories={MOCK_STORIES} 
            initialIndex={activeStoryIndex} 
            onClose={() => setActiveStoryIndex(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomeTab;