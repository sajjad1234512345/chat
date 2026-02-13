
import React, { useState } from 'react';
import { Home, ShoppingBag, Wallet, MapPin, Building2, Heart, MessageCircle, PlusSquare, HandHeart, Plus, User, Clapperboard, Trophy, Briefcase, Megaphone } from 'lucide-react';
import { TabType } from './types';
import HomeTab from './components/HomeTab';
import ShoppingTab from './components/ShoppingTab';
import WalletTab from './components/WalletTab';
import NearbyTab from './components/NearbyTab';
import BusinessTab from './components/BusinessTab';
import GivingTab from './components/GivingTab';
import CreateTab from './components/CreateTab';
import ProfileTab from './components/ProfileTab';
import MessagesTab from './components/MessagesTab';
import ReelsTab from './components/ReelsTab';
import EventsTab from './components/EventsTab';
import JobsTab from './components/JobsTab';
import AdsTab from './components/AdsTab';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeTab />;
      case 'shopping': return <ShoppingTab />;
      case 'wallet': return <WalletTab />;
      case 'nearby': return <NearbyTab />;
      case 'giving': return <GivingTab />;
      case 'business': return <BusinessTab />;
      case 'profile': return <ProfileTab />;
      case 'reels': return <ReelsTab />;
      case 'events': return <EventsTab />;
      case 'jobs': return <JobsTab />;
      case 'ads': return <AdsTab />;
      case 'messages': return <MessagesTab onBack={() => setActiveTab('home')} />;
      case 'create': return <CreateTab onCancel={() => setActiveTab('home')} />;
      default: return <HomeTab />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] text-gray-900 pb-20 scrollbar-hide">
      {/* Top Header */}
      {!(['create', 'messages', 'reels'] as TabType[]).includes(activeTab) && (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 h-14 flex items-center justify-between">
          <h1 className="text-xl font-bold italic tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-nowrap cursor-pointer" onClick={() => setActiveTab('home')}>
            InstaMarket
          </h1>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Megaphone 
              onClick={() => setActiveTab('ads')}
              className={`w-5 h-5 sm:w-6 sm:h-6 cursor-pointer transition-colors ${activeTab === 'ads' ? 'text-red-500' : 'text-gray-700 hover:text-red-500'}`} 
            />
            <Trophy 
              onClick={() => setActiveTab('events')}
              className={`w-5 h-5 sm:w-6 sm:h-6 cursor-pointer transition-colors ${activeTab === 'events' ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'}`} 
            />
            <Briefcase 
              onClick={() => setActiveTab('jobs')}
              className={`w-5 h-5 sm:w-6 sm:h-6 cursor-pointer transition-colors ${activeTab === 'jobs' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`} 
            />
            <Clapperboard 
              onClick={() => setActiveTab('reels')}
              className={`w-5 h-5 sm:w-6 sm:h-6 cursor-pointer transition-colors ${activeTab === 'reels' ? 'text-pink-600' : 'text-gray-700 hover:text-pink-600'}`} 
            />
            <div className="relative">
              <MessageCircle 
                onClick={() => setActiveTab('messages')}
                className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer transition-colors text-gray-700 hover:text-pink-600" 
              />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-[7px] sm:text-[8px] text-white font-bold">3</span>
              </div>
            </div>
            <div 
              onClick={() => setActiveTab('profile')}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 cursor-pointer transition-all overflow-hidden ${activeTab === 'profile' ? 'border-pink-600 scale-110' : 'border-transparent hover:border-gray-200'}`}
            >
              <img 
                src="https://picsum.photos/seed/me/100/100" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-grow overflow-x-hidden scrollbar-hide">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-gray-200 h-16 flex items-center justify-around px-1">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center p-2 transition-all ${activeTab === 'home' ? 'text-pink-600 scale-110' : 'text-gray-500'}`}
        >
          <Home className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setActiveTab('shopping')}
          className={`flex flex-col items-center p-2 transition-all ${activeTab === 'shopping' ? 'text-pink-600 scale-110' : 'text-gray-500'}`}
        >
          <ShoppingBag className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setActiveTab('wallet')}
          className={`flex flex-col items-center p-2 transition-all ${activeTab === 'wallet' ? 'text-pink-600 scale-110' : 'text-gray-500'}`}
        >
          <Wallet className="w-5 h-5" />
        </button>
        
        {/* Central Create Button */}
        <button 
          onClick={() => setActiveTab('create')}
          className="relative -top-4 w-12 h-12 bg-gradient-to-tr from-purple-600 via-pink-600 to-orange-500 rounded-2xl shadow-xl flex items-center justify-center text-white transition-transform active:scale-90 hover:scale-105"
        >
          <Plus className="w-8 h-8 stroke-[3]" />
        </button>

        <button 
          onClick={() => setActiveTab('giving')}
          className={`flex flex-col items-center p-2 transition-all ${activeTab === 'giving' ? 'text-pink-600 scale-110' : 'text-gray-500'}`}
        >
          <HandHeart className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setActiveTab('nearby')}
          className={`flex flex-col items-center p-2 transition-all ${activeTab === 'nearby' ? 'text-pink-600 scale-110' : 'text-gray-500'}`}
        >
          <MapPin className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setActiveTab('business')}
          className={`flex flex-col items-center p-2 transition-all ${activeTab === 'business' ? 'text-pink-600 scale-110' : 'text-gray-500'}`}
        >
          <Building2 className="w-5 h-5" />
        </button>
      </nav>
    </div>
  );
};

export default App;
