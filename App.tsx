import React, { useState, useEffect } from 'react';
import { Home, ShoppingBag, Wallet, MapPin, Building2, MessageCircle, Plus, User, Clapperboard, Trophy, Briefcase, Megaphone, HandHeart, Search, Bell, Heart, MoreVertical, Wifi, Battery, Signal } from 'lucide-react';
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

const StatusBar = () => (
  <div className="h-7 px-6 flex justify-between items-center text-[10px] font-black text-white/40 z-[60] bg-[#0c0c0c] sticky top-0">
    <div className="flex items-center space-x-1">
      <span>9:41</span>
    </div>
    <div className="flex items-center space-x-1.5">
      <Signal className="w-3 h-3" />
      <Wifi className="w-3 h-3" />
      <Battery className="w-3 h-3 rotate-[-90deg]" />
    </div>
  </div>
);

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#0c0c0c] flex flex-col items-center justify-center animate-out fade-out duration-1000 fill-mode-forwards">
      <div className="relative">
        <div className="absolute inset-0 bg-pink-500/20 blur-[100px] rounded-full animate-pulse" />
        <h1 className="text-5xl font-black italic brand-text tracking-tighter relative z-10 animate-in zoom-in-95 duration-1000">
          InstaMarket
        </h1>
      </div>
      <div className="absolute bottom-12 flex flex-col items-center space-y-4">
        <div className="w-1 h-1 bg-white rounded-full animate-bounce" />
        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Visionary Commerce</p>
      </div>
    </div>
  );
};

const NotificationsTab = () => (
  <div className="p-6 animate-in fade-in duration-500 pb-20">
    <h2 className="text-2xl font-black mb-8">Activity</h2>
    <div className="space-y-6">
      {[
        { user: 'alex_j', action: 'liked your photo', time: '2m ago', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200' },
        { user: 'marta_k', action: 'started following you', time: '15m ago', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200' },
        { user: 'pixel_art', action: 'commented: "Incredible vibes! 🔥"', time: '1h ago', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200' },
        { user: 'dev_crew', action: 'shared your reel', time: '3h ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200' }
      ].map((notif, i) => (
        <div key={i} className="flex items-center space-x-4">
          <img src={notif.avatar} className="w-12 h-12 rounded-full object-cover border border-white/10" alt="" />
          <div className="flex-grow">
            <p className="text-sm"><span className="font-bold">{notif.user}</span> {notif.action}</p>
            <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-1">{notif.time}</p>
          </div>
          {i === 1 && (
             <button className="bg-pink-600 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">Follow</button>
          )}
        </div>
      ))}
    </div>
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [createMode, setCreateMode] = useState<'selection' | 'post'>('selection');
  const [isStoryActive, setIsStoryActive] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleAddStory = () => {
    setCreateMode('post');
    setActiveTab('create');
  };

  const handleCreatePost = () => {
    setCreateMode('selection');
    setActiveTab('create');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeTab onStoryToggle={setIsStoryActive} onAddStory={handleAddStory} />;
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
      case 'notifications': return <NotificationsTab />;
      case 'messages': return <MessagesTab onBack={() => setActiveTab('home')} />;
      case 'create': return <CreateTab onCancel={() => setActiveTab('home')} initialMode={createMode} />;
      default: return <HomeTab onStoryToggle={setIsStoryActive} onAddStory={handleAddStory} />;
    }
  };

  const isFullPage = (['create', 'messages'] as TabType[]).includes(activeTab) || isStoryActive;
  const hideHeader = isFullPage || activeTab === 'profile';
  const hideBottomNav = isFullPage;

  return (
    <div className="flex flex-col min-h-screen bg-[#0c0c0c] text-white font-sans antialiased overflow-x-hidden">
      {loading && <SplashScreen onComplete={() => setLoading(false)} />}
      
      {!isFullPage && <StatusBar />}

      {/* Header - Fixed Top (Up Bar) */}
      {!hideHeader && (
        <header className={`sticky top-7 bg-[#0c0c0c]/80 backdrop-blur-xl px-4 h-16 flex items-center justify-between z-50`}>
          <div className="flex items-center shrink-0">
            {activeTab !== 'business' && (
              <h1 
                className={`text-xl font-black italic cursor-pointer active:scale-95 transition-transform brand-text`}
                onClick={() => setActiveTab('home')}
              >
                InstaMarket
              </h1>
            )}
          </div>
          <div className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto scrollbar-hide ml-2">
            <HeaderIcon icon={Megaphone} onClick={() => setActiveTab('ads')} active={activeTab === 'ads'} />
            <HeaderIcon icon={Trophy} onClick={() => setActiveTab('events')} active={activeTab === 'events'} />
            <HeaderIcon icon={Search} onClick={() => setActiveTab('search')} active={activeTab === 'search'} />
            <HeaderIcon icon={Clapperboard} onClick={() => setActiveTab('reels')} active={activeTab === 'reels'} />
            
            <div className="relative group cursor-pointer p-1.5 flex items-center justify-center" onClick={() => setActiveTab('notifications')}>
              <Heart className={`w-5 h-5 transition-colors ${activeTab === 'notifications' ? 'text-white' : 'text-white/40'}`} />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full border-2 border-[#0c0c0c] shadow-lg animate-pulse" />
            </div>

            <div className="relative group cursor-pointer p-1.5 flex items-center justify-center" onClick={() => setActiveTab('messages')}>
              <MessageCircle className={`w-5 h-5 transition-colors ${activeTab === 'messages' ? 'text-white' : 'text-white/40'}`} />
              <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#e1306c] rounded-full flex items-center justify-center border-2 border-[#0c0c0c] shadow-lg">
                <span className="text-[7px] text-white font-black">3</span>
              </div>
            </div>
            
            <div className="p-1 flex items-center justify-center">
              <div 
                className={`w-8 h-8 rounded-full overflow-hidden border transition-all cursor-pointer active:scale-90 shadow-lg ${(activeTab as string) === 'profile' ? 'border-pink-500 ring-2 ring-pink-500/20' : 'border-white/20'}`} 
                onClick={() => setActiveTab('profile')}
              >
                 <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200" className="w-full h-full object-cover" alt="" />
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className={`relative z-10 flex-grow ${hideBottomNav ? '' : 'pb-14'}`}>
        <div className="w-full">
          {renderContent()}
        </div>
      </main>

      {/* Bottom Nav */}
      {!hideBottomNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#0c0c0c]/90 backdrop-blur-2xl border-t border-white/5 h-14 flex items-center justify-around z-50 px-2 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.6)]">
          <NavItem icon={Home} active={activeTab === 'home'} onClick={() => setActiveTab('home')} label="Home" />
          <NavItem icon={ShoppingBag} active={activeTab === 'shopping'} onClick={() => setActiveTab('shopping')} label="Market" /> 
          <NavItem icon={Wallet} active={activeTab === 'wallet'} onClick={() => setActiveTab('wallet')} label="Wallet" />
          
          <div className="flex items-center justify-center px-1">
            <button 
              onClick={handleCreatePost}
              className="w-12 h-12 bg-gradient-to-tr from-[#ff416c] to-[#ff4b2b] text-white rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(255,75,43,0.6)] active:scale-75 hover:scale-105 transition-all transform -translate-y-2 border border-white/10"
              aria-label="Create Post"
            >
              <Plus className="w-7 h-7 stroke-[3]" />
            </button>
          </div>

          <NavItem icon={HandHeart} active={activeTab === 'giving'} onClick={() => setActiveTab('giving')} label="Giving" />
          <NavItem icon={MapPin} active={activeTab === 'nearby'} onClick={() => setActiveTab('nearby')} label="Nearby" />
          <NavItem icon={Building2} active={activeTab === 'business'} onClick={() => setActiveTab('business')} label="Biz" />
        </nav>
      )}
    </div>
  );
};

const HeaderIcon = ({ icon: Icon, onClick, active }: any) => (
  <button 
    onClick={onClick} 
    className={`p-1.5 transition-all flex items-center justify-center rounded-xl active:bg-white/5 ${active ? 'text-white bg-white/5 shadow-inner' : 'text-white/40 hover:text-white'}`}
    aria-selected={active}
  >
    <Icon className="w-5 h-5 stroke-[2.5]" />
  </button>
);

const NavItem = ({ icon: Icon, active, onClick, label }: { icon: any, active: boolean, onClick: () => void, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex-1 h-full transition-all flex flex-col items-center justify-center relative group active:scale-95 ${active ? 'text-white' : 'text-white/30'}`}
    aria-label={label}
  >
    <div className={`p-1.5 rounded-xl transition-all ${active ? 'bg-white/5 shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]' : 'group-hover:bg-white/5'}`}>
      <Icon className={`w-6 h-6 transition-all ${active ? 'stroke-[2.5] scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'stroke-[2] group-hover:scale-110'}`} />
    </div>
    {active && (
      <div className="absolute -bottom-1 w-1 h-1 bg-white rounded-full shadow-[0_0_8px_white] animate-pulse" />
    )}
  </button>
);

export default App;