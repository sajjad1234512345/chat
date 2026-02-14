
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
  }
];

interface MessagesTabProps {
  onBack: () => void;
}

const MessagesTab: React.FC<MessagesTabProps> = ({ onBack }) => {
  const [selectedChat, setSelectedChat] = useState<ChatThread | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = MOCK_CHATS.filter(chat => 
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderChatList = () => (
    <div className="flex flex-col h-full bg-[#121212] text-white animate-in slide-in-from-right duration-300">
      <header className="px-4 py-1.5 flex items-center justify-between border-b border-white/10 backdrop-blur-xl">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-1 hover:bg-white/5 rounded-full transition-colors">
            <ChevronLeft className="w-7 h-7" />
          </button>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black tracking-tight">hirarahman</h2>
            <div className="w-2 h-2 bg-red-500 rounded-full shadow-sm shadow-red-500/50"></div>
          </div>
        </div>
        <button className="p-1 hover:bg-white/5 rounded-full">
          <Edit3 className="w-6 h-6" />
        </button>
      </header>

      {/* Search Bar */}
      <div className="px-4 py-3 border-b border-white/5">
        <div className="bg-white/5 border border-white/5 rounded-2xl px-4 py-2 flex items-center space-x-2 backdrop-blur-md">
          <Search className="w-4 h-4 text-white/30" />
          <input 
            type="text" 
            placeholder="Search messages..." 
            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-white/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Threads List */}
      <div className="flex-grow overflow-y-auto pb-20">
        <div className="px-4 py-4 flex items-center justify-between">
          <h3 className="font-black text-sm tracking-widest uppercase text-white/40">Messages</h3>
          <button className="text-blue-500 text-xs font-black uppercase">Requests</button>
        </div>
        
        {filteredChats.map(chat => (
          <div 
            key={chat.id} 
            onClick={() => setSelectedChat(chat)}
            className="flex items-center px-4 py-4 hover:bg-white/5 transition-colors cursor-pointer active:bg-white/10"
          >
            <div className="relative mr-4">
              <img src={chat.user.avatar} className="w-14 h-14 rounded-full object-cover shadow-sm ring-1 ring-white/10" alt="" />
              {chat.user.isOnline && (
                <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-zinc-900 shadow-sm shadow-green-500/30"></div>
              )}
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex justify-between items-center mb-0.5">
                <h4 className={`text-sm ${chat.unreadCount > 0 ? 'font-black' : 'font-bold'}`}>{chat.user.name}</h4>
                <span className="text-[10px] text-white/30 font-medium">{chat.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className={`text-xs truncate ${chat.unreadCount > 0 ? 'text-white font-black' : 'text-white/40 font-medium'}`}>
                  {chat.lastMessage}
                </p>
                {chat.unreadCount > 0 && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 flex-shrink-0"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderConversation = (chat: ChatThread) => (
    <div className="flex flex-col h-full bg-[#121212] text-white animate-in slide-in-from-right duration-300">
      <header className="px-4 py-1.5 flex items-center justify-between border-b border-white/10 backdrop-blur-xl bg-black/10">
        <div className="flex items-center space-x-3">
          <button onClick={() => setSelectedChat(null)} className="p-1 hover:bg-white/5 rounded-full">
            <ChevronLeft className="w-7 h-7" />
          </button>
          <div className="flex items-center space-x-2">
            <img src={chat.user.avatar} className="w-9 h-9 rounded-full object-cover ring-1 ring-white/20" alt="" />
            <div>
              <h4 className="text-sm font-black leading-none">{chat.user.name}</h4>
              <p className="text-[10px] text-green-500 font-black mt-1 uppercase tracking-widest">Active now</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-5 px-2">
          <Phone className="w-5 h-5 text-white/70" />
          <Video className="w-6 h-6 text-white/70" />
          <Info className="w-6 h-6 text-white/70" />
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-grow p-4 overflow-y-auto space-y-5 scrollbar-hide">
        <div className="flex flex-col items-center my-10">
           <div className="relative mb-4">
             <img src={chat.user.avatar} className="w-20 h-20 rounded-full object-cover shadow-2xl ring-2 ring-white/10" alt="" />
             <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#121212] rounded-full p-1 border border-white/10 flex items-center justify-center">
                <div className="w-full h-full bg-green-500 rounded-full" />
             </div>
           </div>
           <h3 className="font-black text-xl tracking-tight">{chat.user.name}</h3>
           <p className="text-xs text-white/40 font-bold mt-1 uppercase tracking-widest">Instagram • Following</p>
           <button className="mt-5 bg-white/5 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-white/5 hover:bg-white/10 transition-colors">View Profile</button>
        </div>

        {/* Mock Received Message */}
        <div className="flex items-end space-x-2 max-w-[85%]">
          <img src={chat.user.avatar} className="w-7 h-7 rounded-full object-cover mb-1 border border-white/10" alt="" />
          <div className="bg-white/5 backdrop-blur-md border border-white/5 p-3.5 rounded-2xl rounded-bl-none text-[14px] font-medium text-white/90">
            Hey! I saw your post. Is the item still available for purchase?
          </div>
        </div>

        {/* Mock Sent Message */}
        <div className="flex flex-col items-end space-y-1">
          <div className="bg-gradient-to-tr from-purple-600 to-pink-500 text-white p-3.5 rounded-2xl rounded-br-none text-[14px] font-semibold max-w-[85%] shadow-xl">
            Yes, it is! I'm still taking offers. Are you interested in the VirtualFit try-on first?
          </div>
          <span className="text-[9px] text-white/20 font-black mr-2 uppercase tracking-widest">Seen 2m ago</span>
        </div>

        <div className="flex items-end space-x-2 max-w-[85%]">
          <img src={chat.user.avatar} className="w-7 h-7 rounded-full object-cover mb-1 border border-white/10" alt="" />
          <div className="bg-white/5 backdrop-blur-md border border-white/5 p-3.5 rounded-2xl rounded-bl-none text-[14px] font-medium text-white/90">
            Definitely! Just sent you a request on the marketplace tab. Let's talk more there.
          </div>
        </div>
      </div>

      {/* Footer / Input Area */}
      <footer className="p-4 border-t border-white/10 bg-black/10 backdrop-blur-xl">
        <div className="bg-white/5 border border-white/5 rounded-[2rem] p-1.5 flex items-center space-x-3 backdrop-blur-md shadow-2xl">
          <button className="bg-blue-600 p-2.5 rounded-full text-white shadow-lg active:scale-95 transition-transform">
            <Camera className="w-4 h-4" />
          </button>
          <input 
            type="text" 
            placeholder="Message..." 
            className="bg-transparent flex-grow border-none outline-none text-sm py-2 text-white placeholder-white/20 font-medium"
          />
          <div className="flex items-center space-x-4 pr-3">
            <Mic className="w-5 h-5 text-white/40" />
            <ImageIcon className="w-5 h-5 text-white/40" />
            <Smile className="w-5 h-5 text-white/40" />
            <Send className="w-5 h-5 text-pink-500 cursor-pointer active:scale-90 transition-transform" />
          </div>
        </div>
      </footer>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[110] bg-[#121212]">
      {selectedChat ? renderConversation(selectedChat) : renderChatList()}
    </div>
  );
};

export default MessagesTab;
