
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
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-300">
      <header className="px-4 py-1.5 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-1 hover:bg-gray-50 rounded-full transition-colors">
            <ChevronLeft className="w-7 h-7" />
          </button>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold">hirarahman</h2>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
        </div>
        <button className="p-1 hover:bg-gray-50 rounded-full">
          <Edit3 className="w-6 h-6" />
        </button>
      </header>

      {/* Search Bar (Moved Up) */}
      <div className="px-4 py-2 border-b border-gray-50">
        <div className="bg-gray-100 rounded-xl px-4 py-2 flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search messages..." 
            className="bg-transparent border-none outline-none text-sm w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Active Stories / Online Users */}
      <div className="flex overflow-x-auto py-3 px-4 space-x-5 scrollbar-hide border-b border-gray-50">
        {MOCK_CHATS.filter(c => c.user.isOnline).map(chat => (
          <div key={chat.id} className="flex flex-col items-center space-y-1 flex-shrink-0">
            <div className="relative">
              <img src={chat.user.avatar} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" alt="" />
              <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <span className="text-[10px] text-gray-600 font-medium truncate w-16 text-center">{chat.user.name}</span>
          </div>
        ))}
        {/* Placeholder if none online */}
        {MOCK_CHATS.filter(c => c.user.isOnline).length === 0 && (
          <div className="py-2 text-[10px] text-gray-400 font-medium italic">No friends online right now</div>
        )}
      </div>

      {/* Threads List */}
      <div className="flex-grow overflow-y-auto pb-20">
        <div className="px-4 py-2 flex items-center justify-between">
          <h3 className="font-bold text-sm">Messages</h3>
          <button className="text-blue-500 text-xs font-bold">Requests</button>
        </div>
        
        {filteredChats.map(chat => (
          <div 
            key={chat.id} 
            onClick={() => setSelectedChat(chat)}
            className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer active:bg-gray-100"
          >
            <div className="relative mr-4">
              <img src={chat.user.avatar} className="w-14 h-14 rounded-full object-cover shadow-sm" alt="" />
              {chat.user.isOnline && (
                <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex justify-between items-center mb-0.5">
                <h4 className={`text-sm ${chat.unreadCount > 0 ? 'font-black' : 'font-semibold'}`}>{chat.user.name}</h4>
                <span className="text-[10px] text-gray-400">{chat.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className={`text-xs truncate ${chat.unreadCount > 0 ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>
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
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-300">
      <header className="px-4 py-1.5 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <button onClick={() => setSelectedChat(null)} className="p-1 hover:bg-gray-50 rounded-full">
            <ChevronLeft className="w-7 h-7" />
          </button>
          <div className="flex items-center space-x-2">
            <img src={chat.user.avatar} className="w-8 h-8 rounded-full object-cover" alt="" />
            <div>
              <h4 className="text-sm font-bold leading-none">{chat.user.name}</h4>
              <p className="text-[10px] text-green-500 font-bold mt-1">Active now</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Phone className="w-5 h-5 text-gray-700" />
          <Video className="w-6 h-6 text-gray-700" />
          <div className="relative">
            <Info className="w-6 h-6 text-gray-700" />
          </div>
        </div>
      </header>

      {/* Messages Area (Simulated) */}
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        <div className="flex flex-col items-center my-8">
           <img src={chat.user.avatar} className="w-20 h-20 rounded-full object-cover mb-4 shadow-lg" alt="" />
           <h3 className="font-black text-lg">{chat.user.name}</h3>
           <p className="text-xs text-gray-400 font-medium">Instagram • Following</p>
           <button className="mt-4 bg-gray-100 px-4 py-1.5 rounded-lg text-xs font-bold">View Profile</button>
        </div>

        {/* Mock Received Message */}
        <div className="flex items-end space-x-2 max-w-[80%]">
          <img src={chat.user.avatar} className="w-6 h-6 rounded-full object-cover mb-1" alt="" />
          <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-none text-sm">
            Hey! I saw your post. Is the item still available for purchase?
          </div>
        </div>

        {/* Mock Sent Message */}
        <div className="flex flex-col items-end space-y-1">
          <div className="bg-gradient-to-tr from-purple-600 to-pink-500 text-white p-3 rounded-2xl rounded-br-none text-sm max-w-[80%] shadow-md">
            Yes, it is! I'm still taking offers. Are you interested in the VirtualFit try-on first?
          </div>
          <span className="text-[8px] text-gray-400 font-bold mr-2 uppercase">Seen 2m ago</span>
        </div>

        <div className="flex items-end space-x-2 max-w-[80%]">
          <img src={chat.user.avatar} className="w-6 h-6 rounded-full object-cover mb-1" alt="" />
          <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-none text-sm">
            Definitely! Just sent you a request on the marketplace tab. Let's talk more there.
          </div>
        </div>
      </div>

      {/* Footer / Input Area */}
      <footer className="p-4 border-t border-gray-100">
        <div className="bg-gray-100 rounded-[2rem] p-1.5 flex items-center space-x-3">
          <button className="bg-blue-500 p-2 rounded-full text-white">
            <Camera className="w-4 h-4" />
          </button>
          <input 
            type="text" 
            placeholder="Message..." 
            className="bg-transparent flex-grow border-none outline-none text-sm py-2"
          />
          <div className="flex items-center space-x-3 pr-2">
            <Mic className="w-5 h-5 text-gray-500" />
            <ImageIcon className="w-5 h-5 text-gray-500" />
            <Smile className="w-5 h-5 text-gray-500" />
            <Send className="w-5 h-5 text-blue-500 cursor-pointer" />
          </div>
        </div>
      </footer>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[110] bg-white">
      {selectedChat ? renderConversation(selectedChat) : renderChatList()}
    </div>
  );
};

export default MessagesTab;
