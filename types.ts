
export type TabType = 'home' | 'shopping' | 'wallet' | 'nearby' | 'giving' | 'business' | 'create' | 'profile' | 'messages' | 'reels' | 'events' | 'jobs' | 'ads';

export interface Post {
  id: string;
  user: {
    name: string;
    avatar: string;
    isStory?: boolean;
  };
  image: string;
  likes: number;
  caption: string;
  comments: number;
  time: string;
}

export interface Story {
  id: string;
  user: string;
  avatar: string;
  viewed: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  seller: string;
  description: string;
}

export interface Transaction {
  id: string;
  type: 'incoming' | 'outgoing';
  title: string;
  amount: number;
  date: string;
  category: string;
}

export interface BusinessMetric {
  label: string;
  value: string | number;
  change: string;
  isPositive: boolean;
}

export type EmployeeRole = 'Admin' | 'Manager' | 'Editor' | 'Analyst';

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: EmployeeRole;
  avatar: string;
  status: 'Active' | 'Away' | 'Offline';
}

export interface GivingCampaign {
  id: string;
  title: string;
  description: string;
  image: string;
  goal: number;
  raised: number;
  donorCount: number;
  organizer: string;
  category: 'Medical' | 'Education' | 'Environment' | 'Disaster' | 'Community';
}

export interface ChatThread {
  id: string;
  user: {
    name: string;
    avatar: string;
    isOnline: boolean;
  };
  lastMessage: string;
  time: string;
  unreadCount: number;
}

export interface Reel {
  id: string;
  videoUrl: string;
  user: {
    name: string;
    avatar: string;
  };
  caption: string;
  likes: string;
  comments: string;
  audio: string;
}

export interface Bet {
  id: string;
  creator: {
    name: string;
    avatar: string;
    followers: number;
  };
  question: string;
  choices: { id: string; text: string; votes: number }[];
  stake: number;
  totalPot: number;
  endTime: string;
  hasVoted?: boolean;
  selectedChoiceId?: string;
  giftProduct?: Product;
  image?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  salary: string;
  type: 'Full-time' | 'Part-time' | 'Remote' | 'Contract';
  description: string;
  postedAt: string;
}
