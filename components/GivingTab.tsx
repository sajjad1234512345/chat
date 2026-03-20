
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
        <div className="flex justify-between items-center mb-1 text-[8px] font-black text-white/60 uppercase tracking-widest">
          <span>{percent}% Raised</span>
        </div>
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-pink-500 rounded-full transition-all duration-1000"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  };

  if (view === 'create') {
    return (
      <div className="p-4 max-w-lg mx-auto bg-[#0c0c0c] min-h-screen animate-in slide-in-from-bottom duration-500">
        <header className="flex justify-between items-center mb-6">
          <button onClick={() => setView('browse')} className="p-2 bg-white/5 rounded-xl text-white">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <h2 className="text-base font-black text-white uppercase tracking-widest">Start a Cause</h2>
          <div className="w-9" />
        </header>

        <form onSubmit={handleCreateCampaign} className="space-y-4">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-4">
            <div>
              <label className="block text-[9px] font-black text-white/40 uppercase tracking-widest mb-1.5">Campaign Title</label>
              <input 
                required
                type="text" 
                placeholder="What's your cause?"
                className="w-full bg-transparent border-b border-white/10 py-2 outline-none focus:border-red-500 text-sm font-bold text-white"
                value={newCampaign.title}
                onChange={e => setNewCampaign({...newCampaign, title: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-black text-white/40 uppercase tracking-widest mb-1.5">Goal Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30" />
                  <input 
                    required
                    type="number" 
                    placeholder="5000"
                    className="w-full bg-transparent border-b border-white/10 py-2 pl-5 outline-none focus:border-red-500 text-sm font-bold text-white"
                    value={newCampaign.goal}
                    onChange={e => setNewCampaign({...newCampaign, goal: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-black text-white/40 uppercase tracking-widest mb-1.5">Category</label>
                <select 
                  className="w-full bg-transparent border-b border-white/10 py-2 outline-none focus:border-red-500 text-sm font-bold text-white appearance-none"
                  value={newCampaign.category}
                  onChange={e => setNewCampaign({...newCampaign, category: e.target.value as GivingCampaign['category']})}
                >
                  <option value="Community">Community</option>
                  <option value="Medical">Medical</option>
                  <option value="Education">Education</option>
                  <option value="Environment">Environment</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-black text-white/40 uppercase tracking-widest mb-1.5">Description</label>
              <textarea 
                required
                rows={3}
                placeholder="Tell the story of your cause..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-500/20 text-xs resize-none text-white leading-relaxed"
                value={newCampaign.description}
                onChange={e => setNewCampaign({...newCampaign, description: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-2xl font-black text-sm shadow-xl shadow-red-500/20 uppercase tracking-widest active:scale-95 transition-transform"
          >
            Launch Campaign
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-24 max-w-lg mx-auto bg-transparent min-h-screen animate-in fade-in duration-500">
      <header className="mb-6">
        <h2 className="text-4xl font-black text-white tracking-tighter">Giving</h2>
        <p className="text-[8px] text-white/40 font-black uppercase tracking-[0.2em] mt-1">Fund the change you want to see</p>
      </header>

      {/* Featured Section */}
      <div className="mb-6">
        <div className="relative h-64 rounded-[2.5rem] overflow-hidden shadow-2xl group border border-white/5">
          <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-6">
            <div className="bg-white/10 backdrop-blur-md w-fit px-3 py-1 rounded-full text-[8px] font-black text-white uppercase tracking-widest mb-3 border border-white/20">
              Featured Cause
            </div>
            <h3 className="text-white text-xl font-black mb-4 leading-tight">{campaigns[0].title}</h3>
            {renderProgressBar(campaigns[0].raised, campaigns[0].goal)}
            <div 
              onClick={() => { setSelectedCampaign(campaigns[0]); setView('detail'); }}
              className="mt-6 bg-white rounded-2xl py-3.5 flex items-center justify-center cursor-pointer active:scale-[0.98] transition-all shadow-2xl"
            >
              <span className="text-red-600 font-black text-[13px] uppercase tracking-[0.2em]">Donate Now</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 backdrop-blur-md p-4 rounded-3xl shadow-sm border border-white/10">
          <div className="flex items-center space-x-2 text-red-500 mb-1.5">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[8px] font-black uppercase tracking-wider">Total Raised</span>
          </div>
          <p className="text-2xl font-black text-white">$1.2M</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md p-4 rounded-3xl shadow-sm border border-white/10">
          <div className="flex items-center space-x-2 text-blue-500 mb-1.5">
            <Users className="w-4 h-4" />
            <span className="text-[8px] font-black uppercase tracking-wider">Supporters</span>
          </div>
          <p className="text-2xl font-black text-white">45.8K</p>
        </div>
      </div>

      {/* Categories */}
      <div className="flex space-x-3 overflow-x-auto scrollbar-hide mb-6 py-1">
        {['All', 'Medical', 'Education', 'Environment', 'Disaster', 'Community'].map(cat => (
          <button key={cat} className={`flex-shrink-0 px-5 py-2.5 rounded-2xl text-[10px] font-black transition-all ${cat === 'All' ? 'bg-red-600 text-white shadow-lg' : 'bg-white/5 text-white/40 border border-white/10 hover:border-red-500/30'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Campaign List */}
      <div className="space-y-4 pb-24">
        {campaigns.slice(1).map(campaign => (
          <div 
            key={campaign.id} 
            onClick={() => { setSelectedCampaign(campaign); setView('detail'); }}
            className="bg-white/5 backdrop-blur-md p-4 rounded-[2rem] border border-white/10 flex items-center space-x-4 group cursor-pointer transition-all hover:bg-white/10"
          >
            <div className="relative w-20 h-20 flex-shrink-0">
              <img src={campaign.image} className="w-full h-full rounded-[1.5rem] object-cover" alt="" />
              <div className="absolute -top-1.5 -left-1.5 p-1 bg-white rounded-lg shadow-md">
                <Heart className="w-3 h-3 text-red-500 fill-current" />
              </div>
              {campaign.id === 'c2' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#0c0c0c] animate-pulse" />
              )}
            </div>
            <div className="flex-grow min-w-0">
              <h4 className="font-black text-[13px] truncate mb-1 text-white">{campaign.title}</h4>
              <p className="text-[10px] text-white/40 mb-3 line-clamp-1">{campaign.description}</p>
              {renderProgressBar(campaign.raised, campaign.goal)}
            </div>
            <div className="flex-shrink-0">
              <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-red-500 transition-colors" />
            </div>
          </div>
        ))}
      </div>

      {/* Campaign Detail Modal View */}
      {view === 'detail' && selectedCampaign && (
        <div className="fixed inset-0 z-[100] bg-[#0c0c0c] animate-in slide-in-from-bottom duration-300">
           <div className="relative h-[35%]">
             <img src={selectedCampaign.image} className="w-full h-full object-cover" alt="" />
             <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
               <button onClick={() => setView('browse')} className="p-2 bg-black/40 backdrop-blur-xl rounded-xl text-white">
                 <ChevronRight className="w-5 h-5 rotate-180" />
               </button>
               <button className="p-2 bg-black/40 backdrop-blur-xl rounded-xl text-white">
                 <Filter className="w-5 h-5" />
               </button>
             </div>
             <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#0c0c0c] to-transparent" />
           </div>

           <div 
             className="px-6 relative z-10 bg-[#0c0c0c] rounded-t-[2.5rem] overflow-y-auto pb-24 border-t border-white/10 shadow-2xl"
             style={{ height: '427.547px', marginTop: '-77px' }}
           >
              <div className="w-10 h-1 bg-white/10 rounded-full mx-auto my-4" />
              
              <div className="flex justify-between items-start mb-4">
                <div>
                   <span className="text-[8px] font-black text-red-500 uppercase tracking-widest bg-red-500/10 px-2 py-0.5 rounded-md">
                     {selectedCampaign.category}
                   </span>
                   <h3 className="text-xl font-black text-white mt-1.5">{selectedCampaign.title}</h3>
                   <p className="text-[9px] text-white/40 font-bold mt-0.5 uppercase tracking-wider">Organized by {selectedCampaign.organizer}</p>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl mb-6 border border-white/5">
                {renderProgressBar(selectedCampaign.raised, selectedCampaign.goal)}
                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center space-x-1.5">
                    <Users className="w-3 h-3 text-white/30" />
                    <span className="text-[9px] font-bold text-white/60">{selectedCampaign.donorCount.toLocaleString()} Donors</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <DollarSign className="w-3 h-3 text-white/30" />
                    <span className="text-[9px] font-bold text-white/60">${(selectedCampaign.goal - selectedCampaign.raised).toLocaleString()} left</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                 <h4 className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-3">The Story</h4>
                 <p className="text-white/80 leading-relaxed text-xs font-medium">
                   {selectedCampaign.description}
                   <br /><br />
                   Your contribution goes directly towards impacting lives and fostering positive change within our community. Join us in our mission to create a better world for everyone.
                 </p>
              </div>

              <div 
                className="fixed bottom-0 left-0 right-0 p-4 bg-[#0c0c0c]/80 backdrop-blur-xl border-t border-white/10 flex items-center space-x-3"
                style={{ marginTop: '0px', marginBottom: '45px' }}
              >
                <button className="p-3 bg-white/5 rounded-xl text-white/60 border border-white/5">
                  <Heart className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleDonate}
                  className="flex-grow bg-red-600 text-white py-3 rounded-2xl font-black text-sm shadow-xl shadow-red-500/10 transition-all active:scale-95 uppercase tracking-wider"
                >
                  Donate $100
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default GivingTab;
