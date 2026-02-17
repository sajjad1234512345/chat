import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Plus, Play, Pause, RotateCcw, RotateCw, Subtitles, Volume2, VolumeX, Maximize, X, ChevronLeft, ChevronRight, Smile, Eye, MessageSquare, ChevronUp } from 'lucide-react';
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
      className={`absolute inset-x-0 bottom-0 z-[120] bg-[#121212] rounded-t-[2.5rem] border-t border-white/10 p-4 flex flex-col shadow-[0_-20px_80px_rgba(0,0,0,0.9)] overflow-hidden ${!isDragging ? 'transition-all duration-300 ease-out' : ''}`}
      style={{ height: `${panelHeight}vh` }}
      onClick={(e) => e.stopPropagation()}
    >
      <div 
        className="w-full pt-1 pb-6 cursor-ns-resize flex justify-center flex-shrink-0 select-none touch-none active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        <div className="w-12 h-1.5 bg-white/20 rounded-full" />
      </div>
      
      <div className="flex items-center justify-between mb-6 flex-shrink-0 px-2 pointer-events-none">
        <div className="flex items-center space-x-3">
          <h3 className="text-sm font-black tracking-tight text-white uppercase italic">Activity</h3>
          <div className="bg-white/10 px-2 py-0.5 rounded-full flex items-center justify-center min-w-[20px]">
            <span className="text-[9px] text-white/50 font-black">{viewers.length}</span>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto space-y-4 scrollbar-hide pb-10">
        {viewers.map((v) => (
          <div key={v.id} className="flex flex-col space-y-3 px-1">
            <div className="flex items-center justify-between group">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img src={v.avatar} className="w-10 h-10 rounded-full object-cover border border-white/10" alt="" />
                  {v.hasLiked && (
                    <div className="absolute -bottom-0.5 -right-0.5 bg-pink-600 rounded-full p-0.5 border-2 border-[#121212]">
                      <Heart className="w-1.5 h-1.5 text-white fill-current" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <p className="text-[13px] font-black tracking-tight leading-none text-white">{v.name}</p>
                  {v.comment ? (
                    <p className="text-[11px] text-white/70 font-medium italic mt-1 line-clamp-1 leading-tight">"{v.comment}"</p>
                  ) : (
                    <p className="text-[9px] text-white/30 font-black uppercase tracking-[0.2em] mt-1.5">{v.time}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleToggleCommentLike(v.id)}
                  className={`p-2 rounded-xl transition-all ${v.commentLikedByMe ? 'text-red-500 bg-red-500/10' : 'text-white/20 hover:text-white/60 bg-white/5'}`}
                >
                  <Heart className={`w-4 h-4 ${v.commentLikedByMe ? 'fill-current' : ''}`} />
                </button>
                
                {v.comment && (
                  <button 
                    onClick={() => setReplyingToId(replyingToId === v.id ? null : v.id)}
                    className={`p-2 rounded-xl transition-all ${replyingToId === v.id ? 'bg-pink-600 text-white' : 'text-white/20 hover:text-white/60 bg-white/5'}`}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                )}
                
                <button className="px-4 py-2 bg-white text-black rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg ml-1">
                  GIFT
                </button>
              </div>
            </div>

            {v.replies && v.replies.map((reply, idx) => (
              <div key={idx} className="ml-12 flex items-start space-x-3 animate-in fade-in slide-in-from-left-2 duration-300">
                <div className="w-1 h-5 bg-pink-600/30 rounded-full mt-1.5 flex-shrink-0" />
                <div className="flex flex-col">
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none">You</p>
                  <p className="text-[12px] text-white/90 font-medium mt-1 leading-tight">{reply}</p>
                </div>
              </div>
            ))}

            {replyingToId === v.id && (
              <div className="ml-12 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-2xl p-1.5 pl-4">
                  <input 
                    autoFocus
                    type="text" 
                    placeholder={`Reply to ${v.name}...`}
                    className="bg-transparent border-none outline-none text-[11px] font-medium text-white placeholder-white/20 flex-grow"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendReply(v.id)}
                  />
                  <button 
                    onClick={() => handleSendReply(v.id)}
                    className="p-2 bg-pink-600 rounded-xl text-white disabled:opacity-50 active:scale-90 transition-all"
                    disabled={!replyText.trim()}
                  >
                    <Send className="w-3 h-3" />
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
  
  const currentStory = stories[currentStoryIndex];
  const storyMedia = currentStory.media || [];
  const isMyStory = currentStory.user === 'Your Story';

  useEffect(() => {
    if (showActivity) return;
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
  }, [currentStoryIndex, currentMediaIndex, showActivity]);

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
    <div className="fixed inset-0 z-[100] bg-black animate-in fade-in duration-300">
      <div className="absolute top-4 left-4 right-4 z-50 flex space-x-1">
        {currentStory.media?.map((_, idx) => (
          <div key={idx} className="h-1 flex-grow bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-75" 
              style={{ width: idx < currentMediaIndex ? '100%' : idx === currentMediaIndex ? `${progress}%` : '0%' }}
            />
          </div>
        ))}
      </div>

      <div className="absolute top-8 left-4 right-4 z-50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src={currentStory.avatar} className="w-8 h-8 rounded-full border border-white/20" alt="" />
          <span className="text-white text-xs font-black tracking-tight">{currentStory.user}</span>
          <span className="text-white/40 text-[10px] font-bold">4h</span>
        </div>
        <button onClick={onClose} className="p-2 text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="w-full h-full flex items-center justify-center relative">
        <img 
          src={storyMedia[currentMediaIndex]} 
          className="w-full h-full object-cover" 
          alt="Story content" 
        />
        <div className="absolute inset-y-0 left-0 w-1/3 z-40" onClick={handlePrev} />
        <div className="absolute inset-y-0 right-0 w-1/3 z-40" onClick={handleNext} />
      </div>

      {!showActivity && (
        <div className="absolute bottom-6 left-4 right-4 z-50 flex items-center space-x-4">
          {isMyStory ? (
            <div 
              className="flex-grow flex items-center justify-center space-x-3 bg-black/30 backdrop-blur-xl border border-white/10 rounded-[1.2rem] py-2 px-5 cursor-pointer active:scale-95 transition-all shadow-2xl"
              onClick={() => setShowActivity(true)}
            >
              <div className="flex -space-x-1.5">
                {currentStory.viewers?.slice(0, 3).map((v, i) => (
                  <img key={i} src={v.avatar} className="w-3.5 h-3.5 rounded-full border border-black" alt="" />
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white">
                  {currentStory.viewers?.length} Viewers
                </span>
                <ChevronUp className="w-3 h-3 text-white/60 animate-bounce" />
              </div>
            </div>
          ) : (
            <>
              <div className="flex-grow bg-black/20 backdrop-blur-xl border border-white/20 rounded-full px-5 py-2.5">
                <input 
                  type="text" 
                  placeholder="Send message..." 
                  className="bg-transparent text-white text-sm w-full outline-none placeholder-white/40 font-medium" 
                />
              </div>
              <Heart className="w-6 h-6 text-white" />
              <Send className="w-6 h-6 text-white" />
            </>
          )}
        </div>
      )}

      {showActivity && isMyStory && currentStory.viewers && (
        <>
          <div className="absolute inset-0 z-[110]" onClick={() => setShowActivity(false)} />
          <ActivityPanel viewers={currentStory.viewers} onClose={() => setShowActivity(false)} />
        </>
      )}
    </div>
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
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
      setCurrentMediaIndex(index);
    }
  };

  return (
    <article className="flex flex-col bg-[#0c0c0c] border-b border-white/5 mb-10">
      <header className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src={post.user.avatar} className="w-10 h-10 rounded-full object-cover border border-white/10" alt="" />
          <div className="flex flex-col">
            <span className="font-bold text-[14px] leading-none tracking-tight">{post.user.name}</span>
            <span className="text-[9px] font-black text-white/30 tracking-[0.2em] mt-1 uppercase">{post.time}</span>
          </div>
        </div>
        <MoreHorizontal className="text-white/40 cursor-pointer w-5 h-5" />
      </header>
      
      <div className="px-4">
        <div className="relative w-full aspect-[4/5] bg-zinc-900 overflow-hidden rounded-[2.5rem] shadow-2xl border border-white/10">
          {post.media.length > 1 && (
            <div className="absolute top-6 right-6 z-10 bg-black/40 backdrop-blur-xl px-3 py-1 rounded-full text-[10px] font-black text-white tracking-widest border border-white/10">
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
                  <img src={item.url} className="w-full h-full object-cover" alt="" />
                ) : (
                  <VideoPlayer url={item.url} />
                )}
              </div>
            ))}
          </div>
          {post.media.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
              {post.media.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentMediaIndex ? 'bg-white scale-125' : 'bg-white/20'}`} 
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="p-5">
        <div className="flex justify-between items-center mb-4 px-1">
          <div className="flex items-center space-x-6">
            <Heart className="w-6 h-6 hover:text-red-500 transition-colors cursor-pointer" />
            <MessageCircle className="w-6 h-6 cursor-pointer" />
            <Send className="w-6 h-6 cursor-pointer" />
          </div>
          <Bookmark className="w-6 h-6 cursor-pointer" />
        </div>
        <div className="px-1">
          <p className="text-[14px] font-black text-white mb-1.5 tracking-tight">{post.likes.toLocaleString()} likes</p>
          <p className="text-[14px] leading-relaxed">
            <span className="font-bold mr-2">{post.user.name}</span>
            <span className="text-white/80 font-medium">{post.caption}</span>
          </p>
          <button className="text-white/30 text-[10px] font-black mt-2.5 uppercase tracking-widest hover:text-white/60 transition-colors">
            View all {post.comments} comments
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
      <div className="flex items-center space-x-5 overflow-x-auto scrollbar-hide px-5 pt-5 pb-4 border-b border-white/5 bg-[#0c0c0c]">
        {MOCK_STORIES.map((story, i) => (
          <div 
            key={story.id} 
            className="flex-shrink-0 flex flex-col items-center space-y-2 cursor-pointer active:scale-95 transition-transform"
            onClick={() => setActiveStoryIndex(i)}
          >
            <div className="relative">
              <div className={`p-[2px] rounded-full ${story.viewed ? 'bg-white/10' : 'insta-gradient-border'}`}>
                <div className="w-[66px] h-[66px] rounded-full overflow-hidden border-2 border-[#0c0c0c]">
                  <img src={story.avatar} className="w-full h-full object-cover" alt="" />
                </div>
              </div>
              {i === 0 && (
                <div 
                  className="absolute bottom-1 right-1 bg-blue-500 rounded-full p-1 border-2 border-[#0c0c0c] shadow-lg cursor-pointer hover:bg-blue-400 transition-colors z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddStory?.();
                  }}
                >
                  <Plus className="w-3 h-3 text-white stroke-[4]" />
                </div>
              )}
            </div>
            <span className="text-[10px] font-bold text-white tracking-tight leading-none text-center">{story.user}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col">
        {MOCK_POSTS.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>

      {activeStoryIndex !== null && (
        <StoryViewer 
          stories={MOCK_STORIES} 
          initialIndex={activeStoryIndex} 
          onClose={() => setActiveStoryIndex(null)} 
        />
      )}
    </div>
  );
};

export default HomeTab;