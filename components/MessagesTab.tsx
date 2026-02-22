import React, { useState } from 'react';
import { ChevronLeft, Search, Edit3, Camera, Info, Video, Phone, Image as ImageIcon, Smile, Mic, Send } from 'lucide-react';
import { ChatThread } from '../types';

const MOCK_CHATS: ChatThread[] = [
  {
    id: '2',
    user: { name: 'marta_k', avatar: 'https://picsum.photos/seed/marta/100/100', isOnline: false },
    lastMessage: 'Sent you the payment for the coffee. Check your wallet! ☕️',
    time: '1h ago',
    unreadCount: 0
  },
  {
    id: '5',
    user: { name: 'foodie_adventures', avatar: 'https://picsum.photos/seed/food/100/100', isOnline: false },
    lastMessage: 'That pizza place you posted about was incredible!',
    time: '2d ago',
    unreadCount: 0
  },
  {
    id: '1',
    user: { name: 'alex_j', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200', isOnline: true },
    lastMessage: 'Are we still on for the VirtualFit demo tomorrow?',
    time: '2m ago',
    unreadCount: 1
  }
];

interface MessagesTabProps {
  onBack: () => void;
}

const MessagesTab: React.FC<MessagesTabProps> = ({ onBack }) => {
  const [selectedChat, setSelectedChat] = useState<ChatThread | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = [...MOCK_CHATS]
    .filter(chat => chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => (a.unreadCount > 0 ? -1 : 1));

  const renderChatList = () => (
    <div className="px-6 pt-1 h-full text-white animate-in fade-in duration-500 pb-20 overflow-y-auto">
      <div className="flex items-center justify-between mb-0.5">
        <h2 className="text-xl font-black">Messages</h2>
        <div className="flex items-center space-x-1">
          <button className="p-1.5 text-white/40 hover:text-white transition-colors">
            <Edit3 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search Bar - More Compact */}
      <div className="mb-4">
        <div className="bg-white/5 border border-white/5 rounded-xl px-3 py-2 flex items-center space-x-3 backdrop-blur-md">
          <Search className="w-3.5 h-3.5 text-white/30" />
          <input 
            type="text" 
            placeholder="Search conversations..." 
            className="bg-transparent border-none outline-none text-[13px] w-full text-white placeholder-white/20 font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-5">
        {filteredChats.map(chat => (
          <div 
            key={chat.id} 
            onClick={() => setSelectedChat(chat)}
            className="flex items-center space-x-3.5 cursor-pointer group active:opacity-70 transition-opacity"
          >
            <div className="relative shrink-0">
              <img src={chat.user.avatar} className="w-11 h-11 rounded-full object-cover border border-white/10" alt="" />
              {chat.user.isOnline && (
                <div className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#121212]"></div>
              )}
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-[13px] truncate">
                <span className="font-bold">{chat.user.name}</span>{' '}
                <span className={`text-white/50 ${chat.unreadCount > 0 ? 'font-black text-white' : ''}`}>
                  {chat.lastMessage}
                </span>
              </p>
              <p className="text-[9px] text-white/20 font-black uppercase tracking-wider mt-0.5">
                {chat.time}
              </p>
            </div>
            {chat.unreadCount > 0 && (
              <div className="w-1.5 h-1.5 bg-pink-600 rounded-full shrink-0 shadow-[0_0_8px_rgba(236,72,153,0.5)]"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderConversation = (chat: ChatThread) => (
    <div className="fixed inset-0 z-[110] bg-[#0c0c0c] flex flex-col h-full text-white animate-in slide-in-from-right duration-300">
      <header className="px-6 py-3 flex items-center justify-between border-b border-white/5 backdrop-blur-xl bg-black/10">
        <div className="flex items-center space-x-4">
          <button onClick={() => setSelectedChat(null)} className="p-1 text-white/40 hover:text-white transition-colors">
            <ChevronLeft className="w-7 h-7" />
          </button>
          <div className="flex items-center space-x-3">
            <img src={chat.user.avatar} className="w-9 h-9 rounded-full object-cover border border-white/10" alt="" />
            <div>
              <h4 className="text-[13px] font-bold leading-none">{chat.user.name}</h4>
              <p className="text-[8px] text-green-500 font-black mt-1 uppercase tracking-widest">Active now</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-5 text-white/60">
          <Phone className="w-4.5 h-4.5" />
          <Video className="w-5.5 h-5.5" />
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-grow p-6 overflow-y-auto space-y-6 scrollbar-hide">
        <div className="flex flex-col items-center my-10">
           <div className="relative mb-4">
             <img src={chat.user.avatar} className="w-20 h-20 rounded-full object-cover shadow-2xl ring-2 ring-white/10" alt="" />
             <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#121212] rounded-full p-1 border border-white/10 flex items-center justify-center">
                <div className="w-full h-full bg-green-500 rounded-full" />
             </div>
           </div>
           <h3 className="font-black text-xl tracking-tight">{chat.user.name}</h3>
           <p className="text-[10px] text-white/30 font-black mt-1 uppercase tracking-[0.3em]">Instagram • Following</p>
           <button className="mt-6 bg-white/5 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/5 hover:bg-white/10 transition-colors">View Profile</button>
        </div>

        {/* Mock Received Message */}
        <div className="flex items-end space-x-3 max-w-[85%]">
          <img src={chat.user.avatar} className="w-7 h-7 rounded-full object-cover mb-1 border border-white/10 shrink-0" alt="" />
          <div className="bg-white/5 backdrop-blur-md border border-white/5 p-4 rounded-[1.5rem] rounded-bl-none text-[14px] font-medium text-white/90 leading-relaxed">
            Hey! I saw your post. Is the item still available for purchase?
          </div>
        </div>

        {/* Mock Sent Message */}
        <div className="flex flex-col items-end space-y-1">
          <div className="bg-gradient-to-tr from-purple-600 to-pink-500 text-white p-4 rounded-[1.5rem] rounded-br-none text-[14px] font-semibold max-w-[85%] shadow-xl leading-relaxed">
            Yes, it is! I'm still taking offers. Are you interested in the VirtualFit try-on first?
          </div>
          <span className="text-[9px] text-white/20 font-black mr-2 uppercase tracking-widest">Seen 2m ago</span>
        </div>

        <div className="flex items-end space-x-3 max-w-[85%]">
          <img src={chat.user.avatar} className="w-7 h-7 rounded-full object-cover mb-1 border border-white/10 shrink-0" alt="" />
          <div className="bg-white/5 backdrop-blur-md border border-white/5 p-4 rounded-[1.5rem] rounded-bl-none text-[14px] font-medium text-white/90 leading-relaxed">
            Definitely! Just sent you a request on the marketplace tab. Let's talk more there.
          </div>
        </div>
      </div>

      {/* Footer / Input Area */}
      <footer className="p-6 border-t border-white/5 bg-black/10 backdrop-blur-xl">
        <div className="bg-white/5 border border-white/5 rounded-[2rem] p-2 flex items-center space-x-3 backdrop-blur-md shadow-2xl">
          <button className="bg-blue-600 p-2.5 rounded-full text-white shadow-lg active:scale-95 transition-transform">
            <Camera className="w-4.5 h-4.5" />
          </button>
          <input 
            type="text" 
            placeholder="Message..." 
            className="bg-transparent flex-grow border-none outline-none text-sm px-2 text-white placeholder-white/20 font-medium"
          />
          <div className="flex items-center space-x-4 pr-3">
            <Mic className="w-5 h-5 text-white/20" />
            <Smile className="w-5 h-5 text-white/20" />
            <Send className="w-5 h-5 text-pink-500 cursor-pointer active:scale-90 transition-transform" />
          </div>
        </div>
      </footer>
    </div>
  );

  return (
    <div className="bg-[#0c0c0c] h-full flex flex-col">
      {selectedChat ? renderConversation(selectedChat) : renderChatList()}
    </div>
  );
};

export default MessagesTab;