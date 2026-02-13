
import React from 'react';
/* Added Heart to the lucide-react imports to fix "Cannot find name 'Heart'" error on line 137 */
import { Settings, Grid, Bookmark, User, MoreHorizontal, Plus, ChevronDown, Heart } from 'lucide-react';

const ProfileTab: React.FC = () => {
  const stats = [
    { label: 'Posts', value: '42' },
    { label: 'Followers', value: '1.2k' },
    { label: 'Following', value: '850' },
  ];

  const highlights = [
    { id: 'h1', label: 'Travel', img: 'https://picsum.photos/seed/travel_h/150/150' },
    { id: 'h2', label: 'Tech', img: 'https://picsum.photos/seed/tech_h/150/150' },
    { id: 'h3', label: 'Food', img: 'https://picsum.photos/seed/food_h/150/150' },
    { id: 'h4', label: 'Art', img: 'https://picsum.photos/seed/art_h/150/150' },
    { id: 'new', label: 'New', img: null },
  ];

  const posts = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    url: `https://picsum.photos/seed/post_${i}/400/400`,
    type: i % 4 === 0 ? 'video' : 'image'
  }));

  return (
    <div className="bg-white min-h-screen max-w-lg mx-auto pb-24 animate-in fade-in duration-300">
      {/* Profile Header */}
      <div className="px-4 pt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold tracking-tight">hirarahman</h2>
            <ChevronDown className="w-4 h-4" />
          </div>
          <div className="flex items-center space-x-6">
            <Plus className="w-6 h-6" />
            <Settings className="w-6 h-6" />
          </div>
        </div>

        <div className="flex items-center mb-6">
          <div className="relative mr-8">
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
              <div className="bg-white p-1 rounded-full w-full h-full">
                <img 
                  src="https://picsum.photos/seed/me/200/200" 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover border border-gray-100"
                />
              </div>
            </div>
            <button className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 border-2 border-white">
              <Plus className="w-3 h-3" />
            </button>
          </div>
          
          <div className="flex-grow flex justify-around">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-bold text-lg leading-none">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h1 className="font-bold text-sm">Hira Rahman</h1>
          <p className="text-sm text-gray-800">Designer • Developer • Dreamer</p>
          <p className="text-sm text-gray-800">Building the future of social commerce 🚀</p>
          <a href="#" className="text-sm text-blue-900 font-medium">hirarahman.dev</a>
        </div>

        <div className="flex space-x-2 mb-8">
          <button className="flex-grow bg-gray-100 py-1.5 rounded-lg text-sm font-bold active:scale-95 transition-transform">
            Edit Profile
          </button>
          <button className="flex-grow bg-gray-100 py-1.5 rounded-lg text-sm font-bold active:scale-95 transition-transform">
            Share Profile
          </button>
          <button className="bg-gray-100 p-1.5 rounded-lg active:scale-95 transition-transform">
            <User className="w-5 h-5" />
          </button>
        </div>

        {/* Story Highlights */}
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide mb-8 py-1">
          {highlights.map((h) => (
            <div key={h.id} className="flex flex-col items-center space-y-1 flex-shrink-0">
              <div className="w-16 h-16 rounded-full border border-gray-200 p-[2px]">
                <div className="w-full h-full rounded-full bg-gray-50 flex items-center justify-center overflow-hidden">
                  {h.img ? (
                    <img src={h.img} alt={h.label} className="w-full h-full object-cover" />
                  ) : (
                    <Plus className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </div>
              <span className="text-[10px] font-medium text-gray-800">{h.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-t border-gray-100">
        <button className="flex-1 flex justify-center py-3 border-b-2 border-black">
          <Grid className="w-6 h-6" />
        </button>
        <button className="flex-1 flex justify-center py-3 text-gray-300">
          <Bookmark className="w-6 h-6" />
        </button>
        <button className="flex-1 flex justify-center py-3 text-gray-300">
          <User className="w-6 h-6" />
        </button>
      </div>

      {/* Post Grid */}
      <div className="grid grid-cols-3 gap-[2px]">
        {posts.map((post) => (
          <div key={post.id} className="aspect-square bg-gray-100 relative group cursor-pointer overflow-hidden">
            <img 
              src={post.url} 
              className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" 
              alt="Post" 
            />
            {post.type === 'video' && (
              <div className="absolute top-2 right-2">
                <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 text-white font-bold text-sm flex space-x-4">
                <span className="flex items-center space-x-1">
                  <Heart className="w-4 h-4 fill-current" />
                  <span>124</span>
                </span>
                <span className="flex items-center space-x-1">
                  <MoreHorizontal className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileTab;
