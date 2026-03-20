
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Users, Clock, DollarSign, ChevronRight, TrendingUp, Star, Flame, Gift, Search, Filter, Plus, Share2, MoreHorizontal, Check } from 'lucide-react';
import { Bet, Product } from '../types';

const mockBets: Bet[] = [
  {
    id: '1',
    creator: { name: 'CryptoWhale', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200', followers: 12500 },
    question: 'Will Bitcoin hit $100k by end of 2026?',
    choices: [
      { id: 'a', text: 'Yes, definitely', votes: 450 },
      { id: 'b', text: 'No way', votes: 120 }
    ],
    stake: 10,
    totalPot: 5700,
    endTime: '2026-12-31T23:59:59Z',
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=800',
    giftProduct: {
      id: 'g1',
      name: 'Visionary VR Headset',
      price: 599,
      image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=400',
      category: 'Tech',
      rating: 4.8,
      reviews: 120,
      seller: 'MetaVision',
      description: 'The future of gaming.'
    }
  },
  {
    id: '2',
    creator: { name: 'FashionGuru', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200', followers: 45000 },
    question: 'Which color will dominate the 2027 Spring Collection?',
    choices: [
      { id: 'c', text: 'Neon Green', votes: 890 },
      { id: 'd', text: 'Electric Blue', votes: 1200 },
      { id: 'e', text: 'Sunset Orange', votes: 450 }
    ],
    stake: 5,
    totalPot: 12700,
    endTime: '2026-04-15T18:00:00Z',
    image: 'https://images.unsplash.com/photo-1539109132314-34a77ae70fe2?q=80&w=800'
  },
  {
    id: '3',
    creator: { name: 'TechInsider', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200', followers: 8900 },
    question: 'Will the next iPhone have a completely portless design?',
    choices: [
      { id: 'f', text: 'Yes, MagSafe only', votes: 230 },
      { id: 'g', text: 'No, USB-C stays', votes: 560 }
    ],
    stake: 20,
    totalPot: 15800,
    endTime: '2026-09-10T10:00:00Z',
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=800'
  }
];

const BettingTab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeBets, setActiveBets] = useState<Bet[]>(mockBets);

  const handleVote = (betId: string, choiceId: string) => {
    setActiveBets(prev => prev.map(bet => {
      if (bet.id === betId) {
        return {
          ...bet,
          hasVoted: true,
          selectedChoiceId: choiceId,
          choices: bet.choices.map(c => 
            c.id === choiceId ? { ...c, votes: c.votes + 1 } : c
          )
        };
      }
      return bet;
    }));
  };

  return (
    <div className="flex flex-col flex-grow w-full bg-[#0c0c0c] pb-20 animate-in fade-in duration-500">
      {/* Search & Filter */}
      <div className="px-6 pt-4 space-y-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-white/20 group-focus-within:text-pink-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all"
            placeholder="Search games & predictions..."
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-2">
          {['All', 'Trending', 'Crypto', 'Fashion', 'Tech', 'Sports'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                selectedCategory === cat 
                  ? 'bg-pink-600 text-white shadow-[0_0_15px_rgba(219,39,119,0.4)]' 
                  : 'bg-white/5 text-white/40 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Games */}
      <div className="px-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/40">Active Predictions</h2>
          <button className="text-[10px] font-black uppercase tracking-widest text-pink-500">View All</button>
        </div>

        <div className="space-y-6">
          {activeBets.map((bet) => (
            <motion.div
              key={bet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden group hover:border-white/20 transition-all"
            >
              {/* Bet Header */}
              <div className="p-5 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img src={bet.creator.avatar} className="w-10 h-10 rounded-2xl object-cover border border-white/10" alt="" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-pink-600 rounded-lg flex items-center justify-center border-2 border-[#0c0c0c]">
                      <Star className="w-2 h-2 text-white fill-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white">{bet.creator.name}</h3>
                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">
                      {bet.creator.followers.toLocaleString()} Followers
                    </p>
                  </div>
                </div>
                <button className="p-2 text-white/20 hover:text-white transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Bet Content */}
              <div className="p-5 space-y-4">
                <h4 className="text-lg font-black leading-tight tracking-tight text-white group-hover:text-pink-500 transition-colors">
                  {bet.question}
                </h4>
                
                {bet.image && (
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10">
                    <img src={bet.image} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center space-x-2">
                       <div className="px-2 py-1 bg-pink-600 rounded-lg flex items-center space-x-1">
                          <Flame className="w-3 h-3 text-white" />
                          <span className="text-[9px] font-black text-white uppercase tracking-widest">Hot</span>
                       </div>
                    </div>
                  </div>
                )}

                {/* Gift Product */}
                {bet.giftProduct && (
                  <div className="bg-white/5 rounded-2xl p-3 border border-white/10 flex items-center space-x-3 group/gift cursor-pointer hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10">
                      <img src={bet.giftProduct.image} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Prize Pool Gift</p>
                      <h5 className="text-xs font-black text-white truncate">{bet.giftProduct.name}</h5>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-emerald-500">${bet.giftProduct.price}</p>
                      <Gift className="w-3.5 h-3.5 text-pink-500 ml-auto mt-1" />
                    </div>
                  </div>
                )}

                {/* Choices */}
                <div className="space-y-2">
                  {bet.choices.map((choice) => {
                    const totalVotes = bet.choices.reduce((acc, curr) => acc + curr.votes, 0);
                    const percentage = totalVotes > 0 ? Math.round((choice.votes / totalVotes) * 100) : 0;
                    const isSelected = bet.selectedChoiceId === choice.id;

                    return (
                      <button
                        key={choice.id}
                        disabled={bet.hasVoted}
                        onClick={() => handleVote(bet.id, choice.id)}
                        className={`w-full relative h-12 rounded-2xl overflow-hidden border transition-all ${
                          bet.hasVoted 
                            ? isSelected 
                              ? 'border-pink-500 bg-pink-500/10' 
                              : 'border-white/5 bg-white/5'
                            : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                        }`}
                      >
                        {/* Progress Bar */}
                        {bet.hasVoted && (
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            className={`absolute inset-y-0 left-0 ${isSelected ? 'bg-pink-500/20' : 'bg-white/5'}`}
                          />
                        )}

                        <div className="absolute inset-0 px-4 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {bet.hasVoted && isSelected && <Check className="w-4 h-4 text-pink-500" />}
                            <span className={`text-xs font-black uppercase tracking-widest ${isSelected ? 'text-pink-500' : 'text-white'}`}>
                              {choice.text}
                            </span>
                          </div>
                          {bet.hasVoted && (
                            <span className="text-xs font-black text-white/40">{percentage}%</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bet Footer */}
              <div className="px-5 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">
                      Pot: ${bet.totalPot.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-orange-500" />
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                      2d Left
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-white/40 hover:text-white transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="bg-white text-black px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all">
                    Stake Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Create New Game FAB */}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-pink-600 rounded-3xl flex items-center justify-center shadow-[0_10px_30px_rgba(219,39,119,0.4)] border border-white/20 active:scale-90 transition-all z-50">
        <Plus className="w-6 h-6 text-white stroke-[3]" />
      </button>
    </div>
  );
};

export default BettingTab;
