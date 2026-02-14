
import React, { useState } from 'react';
import { 
  Plus, HandHeart, Heart, Users, ChevronRight, X, Image as ImageIcon, 
  Search, Filter, ShieldCheck, TrendingUp, DollarSign
} from 'lucide-react';
import { GivingCampaign } from '../types';

const INITIAL_CAMPAIGNS: GivingCampaign[] = [
  {
    id: 'c1',
    title: 'Support Clean Water Initiative',
    description: 'Providing sustainable clean water solutions for rural communities in Southeast Asia. Your donation helps build wells and filtration systems.',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=800',
    goal: 50000,
    raised: 32450,
    donorCount: 1240,
    organizer: 'WaterFirst NGO',
    category: 'Environment'
  },
  {
    id: 'c2',
    title: 'Emergency Medical Relief Fund',
    description: 'Rapid response funding for medical supplies and personnel in disaster-affected areas. Every second counts.',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=800',
    goal: 100000,
    raised: 89000,
    donorCount: 4500,
    organizer: 'HealthBridge',
    category: 'Medical'
  },
  {
    id: 'c3',
    title: 'Coding Scholarships for Youth',
    description: 'Empowering the next generation of developers through intensive bootcamps and mentorship programs.',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
    goal: 25000,
    raised: 12000,
    donorCount: 890,
    organizer: 'TechFuture Foundation',
    category: 'Education'
  }
];

const GivingTab: React.FC = () => {
  const [view, setView] = useState<'browse' | 'create' | 'detail'>('browse');
  const [campaigns, setCampaigns] = useState<GivingCampaign[]>(INITIAL_CAMPAIGNS);
  const [selectedCampaign, setSelectedCampaign] = useState<GivingCampaign | null>(null);
  const [showDonationSuccess, setShowDonationSuccess] = useState(false);

  const [newCampaign, setNewCampaign] = useState({
    title: '',
    description: '',
    goal: '',
    category: 'Community' as GivingCampaign['category']
  });

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const campaign: GivingCampaign = {
      id: `gc-${Date.now()}`,
      title: newCampaign.title,
      description: newCampaign.description,
      image: `https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800`,
      goal: parseFloat(newCampaign.goal),
      raised: 0,
      donorCount: 0,
      organizer: 'You',
      category: newCampaign.category
    };
    setCampaigns([campaign, ...campaigns]);
    setView('browse');
    setNewCampaign({ title: '', description: '', goal: '', category: 'Community' });
  };

  const handleDonate = () => {
    if (selectedCampaign) {
      const updated = campaigns.map(c => 
        c.id === selectedCampaign.id 
          ? { ...c, raised: c.raised + 100, donorCount: c.donorCount + 1 } 
          : c
      );
      setCampaigns(updated);
      setShowDonationSuccess(true);
      setTimeout(() => setShowDonationSuccess(false), 3000);
    }
  };

  const renderProgressBar = (raised: number, goal: number) => {
    const percent = Math.min(Math.round((raised / goal) * 100), 100);
    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-1 text-[10px] font-bold text-white/50 uppercase tracking-widest">
          <span>{percent}% Raised</span>
          <span>Goal: ${goal.toLocaleString()}</span>
        </div>
        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full transition-all duration-1000"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  };

  if (view === 'create') {
    return (
      <div className="bg-[#1c1c1c] min-h-screen p-6 pb-24 animate-in slide-in-from-right duration-300">
        <header className="flex items-center space-x-4 mb-8">
          <button onClick={() => setView('browse')} className="p-2 bg-white/10 rounded-full">
            <X className="w-6 h-6 text-white/40" />
          </button>
          <h2 className="text-2xl font-black text-white">Start a Campaign</h2>
        </header>

        <form onSubmit={handleCreateCampaign} className="space-y-6">
          <div className="w-full aspect-[16/9] bg-white/5 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-white/30 space-y-2 cursor-pointer hover:bg-white/10 transition-colors overflow-hidden">
            <ImageIcon className="w-12 h-12" />
            <span className="text-sm font-medium">Add Campaign Banner</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/40 uppercase mb-2">Campaign Title</label>
              <input 
                required
                type="text" 
                placeholder="What are you fundraising for?"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-rose-500/20 text-sm font-medium text-white"
                value={newCampaign.title}
                onChange={e => setNewCampaign({...newCampaign, title: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase mb-2">Goal Amount ($)</label>
                <input 
                  required
                  type="number" 
                  placeholder="5000"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-rose-500/20 text-sm font-medium text-white"
                  value={newCampaign.goal}
                  onChange={e => setNewCampaign({...newCampaign, goal: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase mb-2">Category</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-rose-500/20 text-sm font-medium appearance-none text-white"
                  value={newCampaign.category}
                  onChange={e => setNewCampaign({...newCampaign, category: e.target.value as any})}
                >
                  <option className="bg-zinc-900">Community</option>
                  <option className="bg-zinc-900">Medical</option>
                  <option className="bg-zinc-900">Education</option>
                  <option className="bg-zinc-900">Environment</option>
                  <option className="bg-zinc-900">Disaster</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/40 uppercase mb-2">Description</label>
              <textarea 
                required
                rows={4}
                placeholder="Tell the story of your cause..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-rose-500/20 text-sm resize-none text-white"
                value={newCampaign.description}
                onChange={e => setNewCampaign({...newCampaign, description: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-rose-500/20"
          >
            LAUNCH CAMPAIGN
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto bg-transparent min-h-screen">
      <header className="flex justify-between items-center mb-6 px-2">
        <div>
          <h2 className="text-2xl font-black text-white">Giving</h2>
          <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-0.5">Fund the change you want to see</p>
        </div>
        <button 
          onClick={() => setView('create')}
          className="p-3 bg-gradient-to-tr from-rose-500 to-pink-500 rounded-2xl text-white shadow-lg active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
      </header>

      {/* Featured Section */}
      <div className="mb-8 px-2">
        <div className="relative h-64 rounded-[2.5rem] overflow-hidden shadow-2xl group border border-white/5">
          <img src={campaigns[0].image} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6">
            <div className="bg-white/20 backdrop-blur-md w-fit px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest mb-3 border border-white/30">
              Featured Cause
            </div>
            <h3 className="text-white text-xl font-black mb-4">{campaigns[0].title}</h3>
            {renderProgressBar(campaigns[0].raised, campaigns[0].goal)}
            <button 
              onClick={() => { setSelectedCampaign(campaigns[0]); setView('detail'); }}
              className="mt-4 w-full bg-white text-rose-600 py-3 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-transform"
            >
              DONATE NOW
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4 mb-8 px-2">
        <div className="bg-white/5 backdrop-blur-md p-5 rounded-3xl shadow-sm border border-white/10">
          <div className="flex items-center space-x-2 text-rose-500 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-wider">Total Raised</span>
          </div>
          <p className="text-xl font-black text-white">$1.2M</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md p-5 rounded-3xl shadow-sm border border-white/10">
          <div className="flex items-center space-x-2 text-blue-500 mb-2">
            <Users className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-wider">Supporters</span>
          </div>
          <p className="text-xl font-black text-white">45.8K</p>
        </div>
      </div>

      {/* Categories */}
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide mb-6 py-1 px-2">
        {['All', 'Medical', 'Education', 'Environment', 'Disaster', 'Community'].map(cat => (
          <button key={cat} className={`flex-shrink-0 px-5 py-2 rounded-2xl text-xs font-black transition-all ${cat === 'All' ? 'bg-rose-500 text-white shadow-lg' : 'bg-white/5 text-white/40 border border-white/10 hover:border-rose-500/30'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Campaign List */}
      <div className="space-y-4 px-2 pb-24">
        {campaigns.slice(1).map(campaign => (
          <div 
            key={campaign.id} 
            onClick={() => { setSelectedCampaign(campaign); setView('detail'); }}
            className="bg-white/5 backdrop-blur-md p-4 rounded-[2rem] shadow-sm border border-white/10 flex items-center space-x-4 group cursor-pointer transition-all hover:bg-white/10"
          >
            <div className="relative w-24 h-24 flex-shrink-0">
              <img src={campaign.image} className="w-full h-full rounded-3xl object-cover" alt="" />
              <div className="absolute -top-1 -left-1 p-1 bg-white rounded-lg shadow-sm">
                <Heart className="w-3 h-3 text-rose-500 fill-current" />
              </div>
            </div>
            <div className="flex-grow min-w-0">
              <h4 className="font-black text-sm truncate mb-1 text-white">{campaign.title}</h4>
              <p className="text-[10px] text-white/40 mb-3 line-clamp-1">{campaign.description}</p>
              {renderProgressBar(campaign.raised, campaign.goal)}
            </div>
            <div className="flex-shrink-0">
              <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-rose-500 transition-colors" />
            </div>
          </div>
        ))}
      </div>

      {/* Campaign Detail Modal View */}
      {view === 'detail' && selectedCampaign && (
        <div className="fixed inset-0 z-[100] bg-[#121212] animate-in slide-in-from-bottom duration-300">
           <div className="relative h-2/5">
             <img src={selectedCampaign.image} className="w-full h-full object-cover" alt="" />
             <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
               <button onClick={() => setView('browse')} className="p-3 bg-black/40 backdrop-blur-xl rounded-2xl text-white">
                 <ChevronRight className="w-6 h-6 rotate-180" />
               </button>
               <button className="p-3 bg-black/40 backdrop-blur-xl rounded-2xl text-white">
                 <Filter className="w-6 h-6" />
               </button>
             </div>
             <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#121212] to-transparent" />
           </div>

           <div className="px-8 -mt-6 relative z-10 bg-[#121212] rounded-t-[3rem] h-3/5 overflow-y-auto pb-32 border-t border-white/10 shadow-2xl">
              <div className="w-12 h-1 bg-white/10 rounded-full mx-auto my-6" />
              
              <div className="flex justify-between items-start mb-6">
                <div>
                   <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-500/10 px-3 py-1 rounded-lg">
                     {selectedCampaign.category}
                   </span>
                   <h3 className="text-2xl font-black text-white mt-2">{selectedCampaign.title}</h3>
                   <p className="text-xs text-white/40 font-bold mt-1">Organized by {selectedCampaign.organizer}</p>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl mb-8 border border-white/5">
                {renderProgressBar(selectedCampaign.raised, selectedCampaign.goal)}
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-white/30" />
                    <span className="text-xs font-bold text-white/60">{selectedCampaign.donorCount.toLocaleString()} Donors</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-white/30" />
                    <span className="text-xs font-bold text-white/60">${(selectedCampaign.goal - selectedCampaign.raised).toLocaleString()} left</span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                 <h4 className="text-sm font-black uppercase tracking-widest text-white/40 mb-4">The Story</h4>
                 <p className="text-white/80 leading-relaxed text-sm font-medium">
                   {selectedCampaign.description}
                   <br /><br />
                   Your contribution goes directly towards impacting lives and fostering positive change within our community. Join us in our mission to create a better world for everyone.
                 </p>
              </div>

              <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#121212]/80 backdrop-blur-xl border-t border-white/10 flex items-center space-x-4">
                <button className="p-4 bg-white/5 rounded-2xl text-white/60 border border-white/5">
                  <Heart className="w-6 h-6" />
                </button>
                <button 
                  onClick={handleDonate}
                  className="flex-grow bg-gradient-to-r from-rose-500 to-pink-600 text-white py-4 rounded-3xl font-black text-lg shadow-xl shadow-rose-500/10 transition-all active:scale-95"
                >
                  DONATE $100
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default GivingTab;
