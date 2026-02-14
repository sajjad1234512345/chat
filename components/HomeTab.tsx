
import React, { useState, useRef } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Plus, Play, Pause, RotateCcw, RotateCw, Subtitles, Volume2, Maximize, X } from 'lucide-react';
import { Post, Story } from '../types';

const MOCK_STORIES: Story[] = [
  { id: '1', user: 'Your Story', avatar: 'https://picsum.photos/seed/u0/200/200', viewed: false },
  { id: '2', user: 'Hira', avatar: 'https://picsum.photos/seed/u1/200/200', viewed: false },
  { id: '3', user: 'alex_j', avatar: 'https://picsum.photos/seed/u2/200/200', viewed: false },
  { id: '4', user: 'marta_k', avatar: 'https://picsum.photos/seed/u3/200/200', viewed: false },
  { id: '5', user: 'pixel_art', avatar: 'https://picsum.photos/seed/u4/200/200', viewed: false },
  { id: '6', user: 'dev_crew', avatar: 'https://picsum.photos/seed/u5/200/200', viewed: false },
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
  },
  {
    id: 'p3',
    user: { name: 'art_lover', avatar: 'https://picsum.photos/seed/art/100/100' },
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800' }
    ],
    likes: 12450,
    caption: 'Minimalist beauty in chaos.',
    comments: 89,
    time: '2 HOURS AGO'
  }
];

const HomeTab: React.FC = () => {
  return (
    <div className="flex flex-col animate-in fade-in duration-500 pb-20">
      {/* Stories Bar - Slightly larger for the wider container */}
      <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide px-4 py-4 border-b border-white/5 bg-[#0c0c0c]">
        {MOCK_STORIES.map((story, i) => (
          <div key={story.id} className="flex-shrink-0 flex flex-col items-center space-y-1.5">
            <div className="relative">
              <div className={`p-[2.5px] rounded-full ${i === 0 ? 'bg-zinc-700' : 'insta-gradient-border'}`}>
                <div className="w-[66px] h-[66px] rounded-full overflow-hidden border-2 border-black">
                  <img src={story.avatar} className="w-full h-full object-cover" alt="" />
                </div>
              </div>
              {i === 0 && (
                <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-0.5 border-2 border-black">
                  <Plus className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <span className="text-[10px] font-bold text-white/80">{story.user}</span>
          </div>
        ))}
      </div>

      {/* Main Feed */}
      <div className="flex flex-col">
        {MOCK_POSTS.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

const PostItem: React.FC<{ post: Post }> = ({ post }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
      setCurrentMediaIndex(index);
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
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
      
      {/* Media Content - Larger aspect ratio (4:5) for more impact */}
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
                {(item.type === 'image' || (item.type === 'video' && videoError)) ? (
                  <img 
                    src={videoError ? 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1200&auto=format&fit=crop' : item.url} 
                    className="w-full h-full object-cover" 
                    alt="" 
                  />
                ) : (
                  <div className="w-full h-full relative group">
                    <video 
                      ref={videoRef}
                      src={item.url} 
                      className="w-full h-full object-cover" 
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      onError={() => setVideoError(true)}
                    />

                    {/* Compact Glass Control Bar */}
                    {!videoError && (
                      <div className="absolute bottom-6 left-6 right-6 z-20 pointer-events-auto">
                          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-4 flex items-center space-x-4 shadow-2xl">
                            <button className="text-white/70 hover:text-white transition-colors">
                                <RotateCcw className="w-5 h-5" />
                            </button>
                            
                            <button onClick={togglePlay} className="text-white hover:scale-110 transition-transform">
                                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                            </button>

                            <button className="text-white/70 hover:text-white transition-colors">
                                <RotateCw className="w-5 h-5" />
                            </button>

                            <div className="flex items-center space-x-2 text-[10px] font-black text-white/80 tabular-nums">
                                <span>5:23</span>
                                <span className="text-white/30">/</span>
                                <span>23:28</span>
                            </div>

                            {/* Progress Slider */}
                            <div className="flex-grow h-1.5 bg-white/10 rounded-full relative">
                                <div className="absolute top-0 left-0 w-[24%] h-full bg-white rounded-full" />
                                <div className="absolute top-1/2 left-[24%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-white/20" />
                            </div>

                            <div className="flex items-center space-x-4 text-white/70">
                                <button className="hover:text-white transition-colors">
                                  <Volume2 className="w-4 h-4" />
                                </button>
                                <button className="hover:text-white transition-colors">
                                  <Maximize className="w-4 h-4" />
                                </button>
                            </div>
                          </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Carousel Dots */}
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

export default HomeTab;
