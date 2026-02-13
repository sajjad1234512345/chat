
import React from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Plus } from 'lucide-react';
import { Post, Story } from '../types';

const MOCK_STORIES: Story[] = [
  { id: '1', user: 'Hira', avatar: 'https://picsum.photos/seed/me/200/200', viewed: false },
  { id: '2', user: 'alex_j', avatar: 'https://picsum.photos/seed/alex/200/200', viewed: false },
  { id: '3', user: 'marta_k', avatar: 'https://picsum.photos/seed/marta/200/200', viewed: true },
  { id: '4', user: 'pixel_art', avatar: 'https://picsum.photos/seed/pixel/200/200', viewed: false },
  { id: '5', user: 'traveler', avatar: 'https://picsum.photos/seed/travel/200/200', viewed: false },
];

const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    user: { name: 'tech_guru', avatar: 'https://picsum.photos/seed/tech/100/100' },
    image: 'https://picsum.photos/seed/post1/600/600',
    likes: 1240,
    caption: 'Future-proofing the home office with clean lines and minimal tech. 💻🚀',
    comments: 45,
    time: '2 hours ago'
  },
  {
    id: 'p2',
    user: { name: 'art_gallery', avatar: 'https://picsum.photos/seed/art/100/100' },
    image: 'https://picsum.photos/seed/post2/600/800',
    likes: 890,
    caption: 'Exploring new depth through digital oil painting. What do you think? 🎨✨',
    comments: 12,
    time: '5 hours ago'
  }
];

const HomeTab: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-500">
      {/* Stories Section */}
      <div className="bg-white border-b border-gray-100 py-4 mb-2 overflow-x-auto flex space-x-4 px-4 scrollbar-hide">
        <div className="flex flex-col items-center space-y-1.5 flex-shrink-0">
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-100">
              <img src="https://picsum.photos/seed/me/200/200" className="w-full h-full object-cover" alt="My Story" />
            </div>
            <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-0.5 border-2 border-white">
              <Plus className="w-3 h-3" />
            </div>
          </div>
          <span className="text-[10px] font-medium text-gray-500">Your Story</span>
        </div>
        {MOCK_STORIES.map((story) => (
          <div key={story.id} className="flex flex-col items-center space-y-1.5 flex-shrink-0">
            <div className={`p-[2px] rounded-full ${story.viewed ? 'bg-gray-200' : 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600'}`}>
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white">
                <img src={story.avatar} className="w-full h-full object-cover" alt={story.user} />
              </div>
            </div>
            <span className="text-[10px] font-medium text-gray-800">{story.user}</span>
          </div>
        ))}
      </div>

      {/* Feed Posts */}
      <div className="space-y-4 pb-20">
        {MOCK_POSTS.map((post) => (
          <div key={post.id} className="bg-white border-b border-gray-100">
            {/* Post Header */}
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-gray-100">
                  <img src={post.user.avatar} className="w-full h-full object-cover" alt="" />
                </div>
                <span className="text-sm font-bold">{post.user.name}</span>
              </div>
              <MoreHorizontal className="w-5 h-5 text-gray-500" />
            </div>

            {/* Post Image */}
            <div className="aspect-square bg-gray-50">
              <img src={post.image} className="w-full h-full object-cover" alt="" />
            </div>

            {/* Post Actions */}
            <div className="p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  <Heart className="w-6 h-6 text-gray-700 hover:text-red-500 cursor-pointer" />
                  <MessageCircle className="w-6 h-6 text-gray-700" />
                  <Send className="w-6 h-6 text-gray-700" />
                </div>
                <Bookmark className="w-6 h-6 text-gray-700" />
              </div>

              {/* Post Meta */}
              <div className="space-y-1">
                <p className="text-sm font-black">{post.likes.toLocaleString()} likes</p>
                <p className="text-sm">
                  <span className="font-bold mr-2">{post.user.name}</span>
                  {post.caption}
                </p>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-tighter mt-1">{post.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeTab;
