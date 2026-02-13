
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Search, Filter, ShoppingCart, Star, ChevronRight, X, RotateCw, Heart, Plus, Store, Package } from 'lucide-react';
import { Product } from '../types';

const INITIAL_MOCK_PRODUCTS: Product[] = [
  {
    id: 'pr1',
    name: 'Basic White T-Shirt',
    price: 105,
    image: 'https://picsum.photos/seed/shirt1/400/500',
    category: 'Tops',
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
  },
  {
    id: 'pr3',
    name: 'Streetwear Cargo Pants',
    price: 145,
    image: 'https://picsum.photos/seed/pants1/400/500',
    category: 'Pants',
    rating: 4.5,
    reviews: 56,
    seller: 'UrbanEdge',
    description: 'Durable nylon cargo pants with multiple pockets.'
  }
];

const ShoppingTab: React.FC = () => {
  const [view, setView] = useState<'browse' | 'ar' | 'detail'>('browse');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [allProducts] = useState<Product[]>(INITIAL_MOCK_PRODUCTS);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) { console.error("Error accessing camera:", err); }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  useEffect(() => {
    if (view === 'ar') startCamera();
    else stopCamera();
    return () => stopCamera();
  }, [view]);

  if (view === 'ar') {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
        <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
          <button onClick={() => setView('browse')} className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white">
            <X className="w-6 h-6" />
          </button>
          <div className="flex space-x-2">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-widest">VirtualFit™ Active</div>
          </div>
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white">
            <RotateCw className="w-6 h-6" />
          </div>
        </header>

        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
        
        <div className="absolute bottom-10 left-0 right-0 px-6 flex flex-col items-center space-y-6">
          <div className="w-full max-w-sm flex space-x-4 overflow-x-auto scrollbar-hide py-2">
            {allProducts.map(p => (
              <div key={p.id} className="min-w-[80px] h-20 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl flex-shrink-0 cursor-pointer hover:border-white transition-all">
                <img src={p.image} className="w-full h-full object-cover" alt="" />
              </div>
            ))}
          </div>
          <button className="bg-white text-black px-12 py-4 rounded-full font-black tracking-widest shadow-2xl active:scale-95 transition-all">
            TAKE SNAPSHOT
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm flex-grow mr-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search products..." className="bg-transparent border-none outline-none w-full text-sm font-medium" />
        </div>
        <button className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Filter className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* AR Call-to-action */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white relative overflow-hidden group shadow-lg shadow-blue-500/20">
        <Camera className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10 transform group-hover:rotate-12 transition-transform duration-500" />
        <h3 className="text-xl font-black mb-1">Try Before You Buy</h3>
        <p className="text-blue-100 text-xs mb-6 font-medium">Use VirtualFit™ to see how items look in real-time.</p>
        <button 
          onClick={() => setView('ar')}
          className="bg-white text-blue-600 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
        >
          Open AR Camera
        </button>
      </div>

      {/* Categories */}
      <div className="flex space-x-3 overflow-x-auto scrollbar-hide py-1">
        {['All', 'Tops', 'Pants', 'Shoes', 'Accessories', 'Beauty'].map(cat => (
          <button key={cat} className={`flex-shrink-0 px-5 py-2 rounded-xl text-xs font-bold border transition-all ${cat === 'All' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-100'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-4">
        {allProducts.map(product => (
          <div key={product.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 group transition-all hover:shadow-lg">
            <div className="relative aspect-[4/5] bg-gray-50">
              <img src={product.image} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" alt={product.name} />
              <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm text-gray-700">
                <Heart className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <h4 className="text-sm font-bold text-gray-900 truncate mb-1">{product.name}</h4>
              <div className="flex items-center justify-between">
                <span className="font-black text-blue-600">${product.price}</span>
                <div className="flex items-center space-x-1 text-[10px] font-bold text-gray-400">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span>{product.rating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShoppingTab;
