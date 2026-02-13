
import React from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Plus } from 'lucide-react';
import { Post, Story } from '../types';

const MOCK_STORIES: Story[] = [
  { id: '1', user: 'Your Story', avatar: 'https://picsum.photos/seed/me/200/200', viewed: false },
  { id: '2', user: 'alex_j', avatar: 'https://picsum.photos/seed/alex/200/200', viewed: false },
  { id: '3', user: 'marta_k', avatar: 'https://picsum.photos/seed/marta/200/200', viewed: true },
  { id: '4', user: 'pixel_art', avatar: 'https://picsum.photos/seed/pixel/200/200', viewed: false },
  { id: '5', user: 'traveler', avatar: 'https://picsum.photos/seed/travel/200/200', viewed: false },
  { id: '6', user: 'foodie', avatar: 'https://picsum.photos/seed/food/200/200', viewed: true },
];

const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    user: { name: 'tech_guru', avatar: 'https://picsum.photos/seed/tech/100/100' },
    image: 'https://picsum.photos/seed/post1/600/600',
    likes: 1240,
    caption: 'Check out the new workstation setup! Ready for some productivity 💻🚀 #tech #workspace',
    comments: 45,
    time: '2 hours ago'
  },
  {
    id: 'p2',
    user: { name: 'art_gallery', avatar: 'https://picsum.photos/seed/art/100/100' },
    image: 'https://picsum.photos/seed/post2/600/800',
    likes: 890,
    caption: 'New oil painting series. What do you think of the color palette? 🎨✨',
    comments: 12,
    time: '5 hours ago'
  }
];

const HomeTab: React.FC = () => {
  return (
    <div className="max-w-md mx-auto">
      {/* Stories */}
      <div className="flex overflow-x-auto py-4 px-2 space-x-4 scrollbar-hide bg-white border-b border-gray-100">
        {MOCK_STORIES.map((story) => (
          <div key={story.id} className="flex flex-col items-center space-y-1 flex-shrink-0">
            <div className="relative">
              <div className={`p-[2px] rounded-full bg-gradient-to-tr ${story.user === 'Your Story' && !story.viewed ? 'from-transparent to-transparent' : (story.viewed ? 'from-gray-200 to-gray-300' : 'from-yellow-400 via-red-500 to-purple-600')}`}>
                <div className="bg-white p-[2px] rounded-full">
                  <img src={story.avatar} alt={story.user} className="w-16 h-16 rounded-full object-cover border border-gray-100" />
                </div>
              </div>
              {story.user === 'Your Story' && (
                <div className="absolute bottom-0.5 right-0.5 bg-blue-500 rounded-full border-2 border-white p-0.5 shadow-sm">
                  <Plus className="w-3 h-3 text-white stroke-[4]" />
                </div>
              )}
            </div>
            <span className="text-xs text-gray-600 truncate w-16 text-center">{story.user}</span>
          </div>
        ))}
      </div>

      {/* Feed */}
      <div className="space-y-4 pt-2">
        {MOCK_POSTS.map((post) => (
          <div key={post.id} className="bg-white border-b md:border border-gray-200 md:rounded-lg overflow-hidden">
            {/* Post Header */}
            <div className="flex items-center justify-between px-3 py-3">
              <div className="flex items-center space-x-3">
                <img src={post.user.avatar} className="w-8 h-8 rounded-full object-cover" alt="" />
                <span className="font-semibold text-sm">{post.user.name}</span>
              </div>
              <MoreHorizontal className="w-5 h-5 text-gray-500 cursor-pointer" />
            </div>

            {/* Post Image */}
            <img src={post.image} className="w-full aspect-square object-cover" alt="" />

            {/* Post Actions */}
            <div className="px-3 py-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-4">
                  <Heart className="w-6 h-6 text-gray-700 hover:text-red-500 cursor-pointer transition-colors" />
                  <MessageCircle className="w-6 h-6 text-gray-700 cursor-pointer" />
                  <Send className="w-6 h-6 text-gray-700 cursor-pointer" />
                </div>
                <Bookmark className="w-6 h-6 text-gray-700 cursor-pointer" />
              </div>

              {/* Likes & Caption */}
              <p className="font-bold text-sm mb-1">{post.likes.toLocaleString()} likes</p>
              <div className="text-sm">
                <span className="font-bold mr-2">{post.user.name}</span>
                {post.caption}
              </div>
              <button className="text-gray-500 text-sm mt-1">View all {post.comments} comments</button>
              <p className="text-[10px] text-gray-400 uppercase mt-2 tracking-wider">{post.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeTab;
