
import React, { useState } from 'react';
import { Home, ShoppingBag, Wallet, MapPin, Building2, MessageCircle, Plus, User, Clapperboard, Trophy, Briefcase, Megaphone, HandHeart, Search, Bell, Heart } from 'lucide-react';
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

  const isFullPage = (['create', 'messages', 'reels', 'nearby'] as TabType[]).includes(activeTab);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] text-gray-900 font-sans antialiased">
      {/* Refined Header matching Screenshot */}
      {!isFullPage && (
        <header className="sticky top-0 bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between z-50">
          <h1 className="text-xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-500">
            InstaMarket
          </h1>
          <div className="flex items-center space-x-4">
            <HeaderIcon icon={Megaphone} onClick={() => setActiveTab('ads')} active={activeTab === 'ads'} />
            <HeaderIcon icon={Trophy} onClick={() => setActiveTab('events')} active={activeTab === 'events'} />
            <HeaderIcon icon={Briefcase} onClick={() => setActiveTab('jobs')} active={activeTab === 'jobs'} />
            <HeaderIcon icon={Clapperboard} onClick={() => setActiveTab('reels')} active={activeTab === 'reels'} />
            <div className="relative cursor-pointer" onClick={() => setActiveTab('messages')}>
              <MessageCircle className="w-6 h-6 text-gray-700" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-[8px] text-white font-black">3</span>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all ${activeTab === 'profile' ? 'border-gray-900' : 'border-transparent'}`}
            >
              <img src="https://picsum.photos/seed/me/100/100" className="w-full h-full object-cover" alt="Profile" />
            </button>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className={`flex-grow ${!isFullPage ? 'pb-20' : ''}`}>
        {renderContent()}
      </main>

      {/* 7-Item Bottom Navigation matching Screenshot */}
      {!(['reels', 'create', 'messages'] as TabType[]).includes(activeTab) && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 h-18 flex items-center justify-around z-50 px-2">
          <NavItem 
            icon={Home} 
            active={activeTab === 'home'} 
            onClick={() => setActiveTab('home')} 
          />
          <NavItem 
            icon={ShoppingBag} 
            active={activeTab === 'shopping'} 
            onClick={() => setActiveTab('shopping')} 
          />
          <NavItem 
            icon={Wallet} 
            active={activeTab === 'wallet'} 
            onClick={() => setActiveTab('wallet')} 
          />
          
          {/* Centered Large Plus Button */}
          <div className="relative -top-3">
            <button 
              onClick={() => setActiveTab('create')}
              className="w-14 h-14 bg-gradient-to-tr from-pink-600 via-red-500 to-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-pink-200 active:scale-90 transition-all"
            >
              <Plus className="w-8 h-8 stroke-[3]" />
            </button>
          </div>

          <NavItem 
            icon={HandHeart} 
            active={activeTab === 'giving'} 
            onClick={() => setActiveTab('giving')} 
          />
          <NavItem 
            icon={MapPin} 
            active={activeTab === 'nearby'} 
            onClick={() => setActiveTab('nearby')} 
          />
          <NavItem 
            icon={Building2} 
            active={activeTab === 'business'} 
            onClick={() => setActiveTab('business')} 
          />
        </nav>
      )}
    </div>
  );
};

const HeaderIcon = ({ icon: Icon, onClick, active }: any) => (
  <button onClick={onClick} className={`transition-colors ${active ? 'text-pink-600' : 'text-gray-600 hover:text-gray-900'}`}>
    <Icon className="w-6 h-6" />
  </button>
);

const NavItem = ({ icon: Icon, active, onClick }: { icon: any, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`p-3 transition-all ${active ? 'text-pink-600' : 'text-gray-400 hover:text-gray-600'}`}
  >
    <Icon className={`w-6 h-6 ${active ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
  </button>
);

export default App;
