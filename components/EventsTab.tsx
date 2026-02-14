
import React, { useState, useRef } from 'react';
import { Trophy, Plus, Clock, Users, DollarSign, ChevronRight, X, AlertCircle, CheckCircle2, Gift, Package, Image as ImageIcon, Camera } from 'lucide-react';
import { Bet, Product } from '../types';

const MY_COMPANY_PRODUCTS: Product[] = [
  {
    id: 'pr1',
    name: 'Basic White T-Shirt',
    price: 105,
    image: 'https://picsum.photos/seed/shirt1/400/500',
    category: 'Top Body',
    rating: 4.8,
    reviews: 124,
    seller: 'MinimalStore',
    description: 'A premium cotton t-shirt for daily comfort.'
  },
  {
    id: 'pr2',
    name: 'Rice Moisturizing Cream',
    price: 19,
    image: 'https://picsum.photos/seed/cream1/400/500',
    category: 'Skincare',
    rating: 4.9,
    reviews: 840,
    seller: 'SkinBio',
    description: 'Natural rice extract cream for glowing skin.'
  }
];

const MOCK_BETS: Bet[] = [
  {
    id: 'b1',
    creator: { name: 'alex_j', avatar: 'https://picsum.photos/seed/alex/100/100', followers: 1500 },
    question: 'Who will win the upcoming Grand Prix?',
    choices: [
      { id: 'c1', text: 'Max Verstappen', votes: 120 },
      { id: 'c2', text: 'Lewis Hamilton', votes: 85 },
      { id: 'c3', text: 'Charles Leclerc', votes: 45 }
    ],
    stake: 50,
    totalPot: 12500,
    endTime: '2h 15m',
    giftProduct: MY_COMPANY_PRODUCTS[0],
    image: 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'b2',
    creator: { name: 'pixel_art', avatar: 'https://picsum.photos/seed/pixel/100/100', followers: 2300 },
    question: 'Will Bitcoin cross $100k by the end of this month?',
    choices: [
      { id: 'c1', text: 'Yes, absolutely', votes: 450 },
      { id: 'c2', text: 'No chance', votes: 210 }
    ],
    stake: 100,
    totalPot: 66000,
    endTime: '5d 12h'
  }
];

const EventsTab: React.FC = () => {
  const [bets, setBets] = useState<Bet[]>(MOCK_BETS);
  const [view, setView] = useState<'browse' | 'create'>('browse');
  const [currentUserFollowers] = useState(1200);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newBet, setNewBet] = useState({
    question: '',
    stake: '',
    duration: '24h',
    choices: ['', ''],
    selectedGiftId: '',
    image: ''
  });

  const handleCreateBet = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUserFollowers < 1000) return;

    const selectedGift = MY_COMPANY_PRODUCTS.find(p => p.id === newBet.selectedGiftId);

    const bet: Bet = {
      id: `bet-${Date.now()}`,
      creator: { name: 'Hira R.', avatar: 'https://picsum.photos/seed/me/100/100', followers: currentUserFollowers },
      question: newBet.question,
      choices: newBet.choices.map((text, i) => ({ id: `choice-${i}`, text, votes: 0 })),
      stake: parseFloat(newBet.stake),
      totalPot: 0,
      endTime: newBet.duration,
      giftProduct: selectedGift,
      image: newBet.image
    };

    setBets([bet, ...bets]);
    setView('browse');
    setNewBet({ question: '', stake: '', duration: '24h', choices: ['', ''], selectedGiftId: '', image: '' });
  };

  const handleVote = (betId: string, choiceId: string) => {
    setBets(bets.map(bet => {
      if (bet.id === betId && !bet.hasVoted) {
        return {
          ...bet,
          hasVoted: true,
          selectedChoiceId: choiceId,
          totalPot: bet.totalPot + bet.stake,
          choices: bet.choices.map(c => 
            c.id === choiceId ? { ...c, votes: c.votes + 1 } : c
          )
        };
      }
      return bet;
    }));
  };

  const addChoiceField = () => {
    if (newBet.choices.length < 5) {
      setNewBet({ ...newBet, choices: [...newBet.choices, ''] });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewBet({ ...newBet, image: event.target?.result as string });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  if (view === 'create') {
    return (
      <div className="bg-[#121212] min-h-screen p-6 pb-24 animate-in slide-in-from-right duration-300">
        <header className="flex items-center space-x-4 mb-8">
          <button onClick={() => setView('browse')} className="p-2 bg-white/10 rounded-full">
            <X className="w-6 h-6 text-white/40" />
          </button>
          <h2 className="text-2xl font-black text-white">Create a Bet</h2>
        </header>

        {currentUserFollowers < 1000 ? (
          <div className="bg-orange-500/10 p-6 rounded-3xl border border-orange-500/20 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-orange-500 mx-auto" />
            <h3 className="font-bold text-lg text-orange-500">Followers Required</h3>
            <p className="text-sm text-white/40">You need at least 1,000 followers to host community bets.</p>
            <button onClick={() => setView('browse')} className="w-full bg-orange-500 text-white py-3 rounded-2xl font-bold">Back to Events</button>
          </div>
        ) : (
          <form onSubmit={handleCreateBet} className="space-y-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative w-full aspect-[16/9] bg-white/5 border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center text-white/20 space-y-2 cursor-pointer hover:bg-white/10 transition-all overflow-hidden"
            >
              {newBet.image ? (
                <>
                  <img src={newBet.image} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </>
              ) : (
                <>
                  <ImageIcon className="w-10 h-10" />
                  <span className="text-sm font-bold uppercase tracking-widest">Add Bet Cover</span>
                </>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/40 uppercase mb-2">The Question</label>
              <textarea 
                required
                rows={3}
                placeholder="What is the bet about?"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-orange-500/20 text-sm font-medium text-white placeholder-white/10"
                value={newBet.question}
                onChange={e => setNewBet({...newBet, question: e.target.value})}
              />
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-white/40 uppercase mb-2">Choices</label>
              {newBet.choices.map((choice, i) => (
                <input 
                  key={i}
                  required
                  type="text"
                  placeholder={`Choice ${i + 1}`}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-orange-500/20 text-sm font-medium text-white placeholder-white/10"
                  value={choice}
                  onChange={e => {
                    const newChoices = [...newBet.choices];
                    newChoices[i] = e.target.value;
                    setNewBet({...newBet, choices: newChoices});
                  }}
                />
              ))}
              {newBet.choices.length < 5 && (
                <button type="button" onClick={addChoiceField} className="text-orange-500 text-xs font-bold flex items-center space-x-1 pl-2">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add another choice</span>
                </button>
              )}
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-orange-500/20 active:scale-95 transition-transform">
              LAUNCH BET
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto bg-transparent min-h-screen pb-24">
      <header className="flex justify-between items-center mb-6 px-2">
        <div>
          <h2 className="text-2xl font-black text-white">Events & Bets</h2>
          <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-0.5">Stake, Vote & Win</p>
        </div>
        <button 
          onClick={() => setView('create')}
          className="p-3 bg-gradient-to-tr from-orange-500 to-yellow-500 rounded-2xl text-white shadow-lg active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4 mb-8 px-2">
        <div className="bg-white/5 backdrop-blur-md p-5 rounded-3xl shadow-sm border border-white/10">
          <div className="flex items-center space-x-2 text-orange-500 mb-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-wider">Total Pot Today</span>
          </div>
          <p className="text-xl font-black text-white">$245.8K</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md p-5 rounded-3xl shadow-sm border border-white/10">
          <div className="flex items-center space-x-2 text-blue-500 mb-2">
            <Users className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-wider">Active Bettors</span>
          </div>
          <p className="text-xl font-black text-white">12.4K</p>
        </div>
      </div>

      {/* Bet List */}
      <div className="space-y-8 px-2">
        {bets.map(bet => (
          <div key={bet.id} className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-0 shadow-sm border border-white/10 relative overflow-hidden group">
            {bet.giftProduct && (
              <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-1.5 rounded-full flex items-center space-x-1.5 shadow-md z-10 animate-pulse">
                <Gift className="w-3 h-3" />
                <span className="text-[9px] font-black uppercase tracking-widest">Bonus Gift</span>
              </div>
            )}

            {bet.image && (
              <div className="w-full h-48 overflow-hidden relative">
                <img src={bet.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60" alt="Bet cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c] via-transparent to-transparent pointer-events-none" />
              </div>
            )}

            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center space-x-3">
                  <img src={bet.creator.avatar} className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10" alt="" />
                  <div>
                    <h4 className="text-sm font-black text-white">{bet.creator.name}</h4>
                    <p className="text-[9px] text-white/30 font-black uppercase tracking-[0.2em]">Verified Creator</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/5">
                  <Clock className="w-3 h-3 text-orange-500" />
                  <span className="text-[10px] font-black text-white/60 uppercase">{bet.endTime} left</span>
                </div>
              </div>

              <h3 className="text-lg font-black text-white mb-6 leading-tight tracking-tight">{bet.question}</h3>

              <div className="space-y-3 mb-6">
                {bet.choices.map(choice => {
                  const totalVotes = bet.choices.reduce((acc, c) => acc + c.votes, 0);
                  const percentage = totalVotes > 0 ? Math.round((choice.votes / totalVotes) * 100) : 0;
                  const isSelected = bet.selectedChoiceId === choice.id;

                  return (
                    <button 
                      key={choice.id}
                      disabled={bet.hasVoted}
                      onClick={() => handleVote(bet.id, choice.id)}
                      className={`w-full relative h-12 rounded-2xl overflow-hidden border transition-all ${bet.hasVoted ? 'cursor-default' : 'hover:bg-white/5 active:scale-[0.98]'} ${isSelected ? 'border-orange-500 bg-orange-500/10' : 'border-white/10 bg-white/5'}`}
                    >
                      {bet.hasVoted && (
                        <div 
                          className={`absolute left-0 top-0 bottom-0 transition-all duration-1000 ${isSelected ? 'bg-orange-500/20' : 'bg-white/10'}`}
                          style={{ width: `${percentage}%` }}
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-between px-4">
                        <span className={`text-sm font-bold ${isSelected ? 'text-orange-500' : 'text-white/80'}`}>{choice.text}</span>
                        {bet.hasVoted && (
                          <span className="text-xs font-black text-white/40">{percentage}%</span>
                        )}
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-orange-500" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-white/10">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Min. Stake</span>
                  <span className="text-xl font-black text-orange-500 tracking-tighter">${bet.stake}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Total Pot</span>
                  <span className="text-xl font-black text-white tracking-tighter">${bet.totalPot.toLocaleString()}</span>
                </div>
              </div>

              {bet.hasVoted && (
                <div className="mt-5 p-3 bg-green-500/10 rounded-2xl flex items-center justify-center space-x-2 border border-green-500/20 animate-in zoom-in-95">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-bold text-green-500">Vote recorded. Good luck!</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsTab;
