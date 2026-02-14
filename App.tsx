
import React, { useState } from 'react';
import { Home, ShoppingBag, Wallet, MapPin, Building2, MessageCircle, Plus, User, Clapperboard, Trophy, Briefcase, Megaphone, HandHeart, Search, Bell, Heart, MoreVertical } from 'lucide-react';
import { TabType } from './types';
import HomeTab from './components/HomeTab';
import SearchTab from './components/SearchTab';
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
      case 'search': return <SearchTab />;
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

  const isFullPage = (['create', 'messages'] as TabType[]).includes(activeTab);
  const hideHeader = isFullPage || activeTab === 'profile';

  return (
    <div className="flex flex-col min-h-screen bg-[#0c0c0c] text-white font-sans antialiased">
      {/* Header - Fixed Top (Up Bar) */}
      {!hideHeader && (
        <header className="sticky top-0 bg-[#0c0c0c] border-b border-white/5 px-4 h-14 flex items-center justify-between z-50">
          <h1 className="text-xl font-black italic brand-text">
            InstaMarket
          </h1>
          <div className="flex items-center space-x-5">
            <HeaderIcon icon={Megaphone} onClick={() => setActiveTab('ads')} active={activeTab === 'ads'} />
            <HeaderIcon icon={Trophy} onClick={() => setActiveTab('events')} active={activeTab === 'events'} />
            {/* Search moved to the Up Bar */}
            <HeaderIcon icon={Search} onClick={() => setActiveTab('search')} active={activeTab === 'search'} />
            <HeaderIcon icon={Clapperboard} onClick={() => setActiveTab('reels')} active={activeTab === 'reels'} />
            <div className="relative cursor-pointer" onClick={() => setActiveTab('messages')}>
              <MessageCircle className="w-5 h-5 text-white/70" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#e1306c] rounded-full flex items-center justify-center border border-black shadow-lg">
                <span className="text-[7px] text-white font-black">3</span>
              </div>
            </div>
            <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20 bg-zinc-800 cursor-pointer hover:scale-105 transition-transform" onClick={() => setActiveTab('profile')}>
               <img src="https://picsum.photos/seed/me/100/100" className="w-full h-full object-cover" alt="" />
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area - Increased to max-w-md for a "greater" container */}
      <main className={`relative z-10 flex-grow ${isFullPage ? '' : 'pb-14'}`}>
        <div className="max-w-md mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* Bottom Nav - Consistent with Header Style */}
      {!isFullPage && (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#0c0c0c] border-t border-white/5 h-14 flex items-center justify-around z-50 px-4 shadow-[0_-5px_30px_rgba(0,0,0,0.4)]">
          <NavItem icon={Home} active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          {/* Market (ShoppingBag) moved back to the bottom bar in place of search */}
          <NavItem icon={ShoppingBag} active={activeTab === 'shopping'} onClick={() => setActiveTab('shopping')} /> 
          <NavItem icon={Wallet} active={activeTab === 'wallet'} onClick={() => setActiveTab('wallet')} />
          
          <button 
            onClick={() => setActiveTab('create')}
            className="w-10 h-10 bg-gradient-to-tr from-[#ff416c] to-[#ff4b2b] text-white rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,75,43,0.4)] active:scale-90 transition-all transform -translate-y-1"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>

          <NavItem icon={HandHeart} active={activeTab === 'giving'} onClick={() => setActiveTab('giving'} />
          <NavItem icon={MapPin} active={activeTab === 'nearby'} onClick={() => setActiveTab('nearby')} />
          <NavItem icon={Building2} active={activeTab === 'business'} onClick={() => setActiveTab('business')} />
        </nav>
      )}
    </div>
  );
};

const HeaderIcon = ({ icon: Icon, onClick, active }: any) => (
  <button onClick={onClick} className={`transition-all ${active ? 'text-white' : 'text-white/40 hover:text-white'}`}>
    <Icon className="w-5 h-5" />
  </button>
);

const NavItem = ({ icon: Icon, active, onClick }: { icon: any, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`p-2 transition-all flex flex-col items-center justify-center relative group ${active ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
  >
    <Icon className={`w-[22px] h-[22px] transition-transform ${active ? 'stroke-[2.5] scale-105' : 'stroke-[2] group-hover:scale-110'}`} />
    {active && (
      <div className="absolute -bottom-1 w-1 h-1 bg-white rounded-full shadow-[0_0_8px_white]" />
    )}
  </button>
);

export default App;
