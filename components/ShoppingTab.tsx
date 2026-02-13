
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Search, Filter, ShoppingCart, Star, ChevronRight, X, RotateCw, Heart, Plus, Store, Package, Trash2, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { Product } from '../types';

const INITIAL_MOCK_PRODUCTS: Product[] = [
  {
    id: 'pr1',
    name: 'Basic White T-Shirt',
    price: 105,
    image: 'https://picsum.photos/seed/shirt1/400/500',
    category: 'Top Body',
    rating: 4.8,
    reviews: 124,
    seller: 'MinimalStore',
    description: 'A premium cotton t-shirt for daily comfort. Sustainable material, relaxed fit.'
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
    description: 'Natural rice extract cream for glowing skin. Deep hydration for 24 hours.'
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
    description: 'Durable nylon cargo pants with multiple pockets. Perfect for urban exploration.'
  }
];

const ShoppingTab: React.FC = () => {
  const [view, setView] = useState<'browse' | 'ar' | 'custom' | 'detail' | 'my-market' | 'add-product'>('browse');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>(INITIAL_MOCK_PRODUCTS);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  
  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'Top Body',
    description: '',
    enableAR: true
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    if (view === 'ar') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [view]);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      id: `my-${Date.now()}`,
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      image: `https://picsum.photos/seed/${newProduct.name}/400/500`,
      category: newProduct.category,
      rating: 0,
      reviews: 0,
      seller: 'You',
      description: newProduct.description
    };
    setMyProducts([...myProducts, product]);
    setAllProducts([...allProducts, product]);
    setView('my-market');
    setNewProduct({ name: '', price: '', category: 'Top Body', description: '', enableAR: true });
  };

  const deleteProduct = (id: string) => {
    setMyProducts(myProducts.filter(p => p.id !== id));
    setAllProducts(allProducts.filter(p => p.id !== id));
  };

  if (view === 'ar') {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        {/* AR Header */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 glass rounded-b-3xl">
          <button onClick={() => setView('browse')} className="p-2 bg-white/20 rounded-full">
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="flex bg-white/20 rounded-full px-4 py-1 space-x-4 text-white text-sm font-medium">
            <span className="border-b-2 border-white pb-1">Top Body</span>
            <span>Pants</span>
            <span>Foot</span>
          </div>
          <button className="p-2 bg-white/20 rounded-full">
            <ShoppingCart className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Camera Feed */}
        <div className="flex-grow relative overflow-hidden bg-gray-900">
          <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="w-64 h-64 bg-white/10 backdrop-blur-sm border-2 border-dashed border-white/50 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs text-center px-4">Align your torso here for VirtualFit try-on</span>
             </div>
          </div>
          <div className="absolute bottom-32 left-0 right-0 px-4 overflow-x-auto flex space-x-4 scrollbar-hide py-4">
             {allProducts.filter(p => p.category === 'Top Body').map(p => (
               <div key={p.id} className="min-w-[120px] glass p-2 rounded-2xl flex flex-col items-center">
                 <img src={p.image} className="w-16 h-16 rounded-xl object-cover mb-2" />
                 <span className="text-[10px] text-white font-bold">${p.price}</span>
               </div>
             ))}
          </div>
        </div>

        {/* AR Controls */}
        <div className="absolute bottom-0 left-0 right-0 h-24 dark-glass rounded-t-3xl flex items-center justify-around px-8">
          <div className="flex flex-col items-center">
            <div className="p-3 bg-white/20 rounded-full mb-1">
              <RotateCw className="w-6 h-6 text-white" />
            </div>
            <span className="text-[10px] text-white">Rotate</span>
          </div>
          <button className="w-16 h-16 rounded-full border-4 border-white/30 p-1">
            <div className="w-full h-full bg-white rounded-full" />
          </button>
          <div className="flex flex-col items-center">
            <div className="p-3 bg-white/20 rounded-full mb-1">
              <Filter className="w-6 h-6 text-white" />
            </div>
            <span className="text-[10px] text-white">Filters</span>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'my-market') {
    return (
      <div className="bg-[#fafafa] min-h-screen p-6">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button onClick={() => setView('browse')} className="p-2 bg-white rounded-full shadow-sm">
              <ChevronRight className="w-6 h-6 rotate-180" />
            </button>
            <h2 className="text-2xl font-bold">My Market</h2>
          </div>
          <button 
            onClick={() => setView('add-product')}
            className="bg-pink-600 text-white p-3 rounded-2xl shadow-lg shadow-pink-200"
          >
            <Plus className="w-6 h-6" />
          </button>
        </header>

        {/* Sales Summary */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Total Sales</p>
            <h4 className="text-2xl font-black text-gray-900">$0.00</h4>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Active Items</p>
            <h4 className="text-2xl font-black text-gray-900">{myProducts.length}</h4>
          </div>
        </div>

        {/* Listings */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg mb-2">My Listings</h3>
          {myProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <Store className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No active listings</p>
              <button 
                onClick={() => setView('add-product')}
                className="mt-4 text-pink-600 font-bold text-sm"
              >
                Start Selling +
              </button>
            </div>
          ) : (
            myProducts.map(p => (
              <div key={p.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img src={p.image} className="w-16 h-16 rounded-2xl object-cover" />
                  <div>
                    <h4 className="font-bold text-sm">{p.name}</h4>
                    <p className="text-pink-600 font-bold text-sm">${p.price}</p>
                    <div className="flex items-center mt-1 text-[10px] text-gray-400">
                       <Package className="w-3 h-3 mr-1" />
                       {p.category}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors">
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => deleteProduct(p.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (view === 'add-product') {
    return (
      <div className="bg-white min-h-screen p-6 pb-24">
        <header className="flex items-center space-x-4 mb-8">
          <button onClick={() => setView('my-market')} className="p-2 bg-gray-50 rounded-full">
            <ChevronRight className="w-6 h-6 rotate-180" />
          </button>
          <h2 className="text-2xl font-bold">List an Item</h2>
        </header>

        <form onSubmit={handleAddProduct} className="space-y-6">
          {/* Photo Upload Placeholder */}
          <div className="w-full aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-gray-400 space-y-2 cursor-pointer hover:bg-gray-100 transition-colors">
            <ImageIcon className="w-12 h-12" />
            <span className="text-sm font-medium">Add Product Photos</span>
            <span className="text-[10px]">Up to 5 images</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Product Name</label>
              <input 
                required
                type="text" 
                placeholder="e.g. Vintage Denim Jacket"
                className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-pink-200 text-sm"
                value={newProduct.name}
                onChange={e => setNewProduct({...newProduct, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Price ($)</label>
                <input 
                  required
                  type="number" 
                  placeholder="0.00"
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-pink-200 text-sm"
                  value={newProduct.price}
                  onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Category</label>
                <select 
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-pink-200 text-sm appearance-none"
                  value={newProduct.category}
                  onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                >
                  <option>Top Body</option>
                  <option>Pants</option>
                  <option>Skincare</option>
                  <option>Tech</option>
                  <option>Foot</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Description</label>
              <textarea 
                rows={4}
                placeholder="Tell buyers about your item..."
                className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-pink-200 text-sm resize-none"
                value={newProduct.description}
                onChange={e => setNewProduct({...newProduct, description: e.target.value})}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
               <div className="flex items-center space-x-3">
                 <Camera className="w-5 h-5 text-pink-500" />
                 <div>
                    <p className="text-sm font-bold">Enable AR VirtualFit</p>
                    <p className="text-[10px] text-gray-400">Allow users to try this item virtually</p>
                 </div>
               </div>
               <button 
                type="button"
                onClick={() => setNewProduct({...newProduct, enableAR: !newProduct.enableAR})}
                className={`w-12 h-6 rounded-full transition-colors relative ${newProduct.enableAR ? 'bg-pink-500' : 'bg-gray-300'}`}
               >
                 <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${newProduct.enableAR ? 'translate-x-7' : 'translate-x-1'}`} />
               </button>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-black text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-gray-200 hover:bg-gray-900"
          >
            PUBLISH LISTING
          </button>
        </form>
      </div>
    );
  }

  if (view === 'detail' && selectedProduct) {
    return (
      <div className="bg-white min-h-screen pb-20 overflow-y-auto">
        <div className="relative">
          <button onClick={() => setView('browse')} className="absolute top-4 left-4 z-10 p-2 glass rounded-full">
            <ChevronRight className="w-6 h-6 rotate-180" />
          </button>
          <img src={selectedProduct.image} className="w-full h-[400px] object-cover" />
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button className="p-3 glass rounded-full"><Heart className="w-6 h-6" /></button>
            <button className="p-3 glass rounded-full"><ShoppingCart className="w-6 h-6" /></button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
              <p className="text-pink-600 font-semibold">{selectedProduct.seller}</p>
            </div>
            <div className="text-2xl font-bold text-gray-800">${selectedProduct.price}</div>
          </div>

          <div className="flex items-center space-x-2 mb-4">
             <div className="flex text-yellow-400">
               {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 fill-current ${i >= Math.floor(selectedProduct.rating) ? 'text-gray-300' : ''}`} />)}
             </div>
             <span className="text-sm font-medium">{selectedProduct.rating}</span>
             <span className="text-xs text-gray-400">({selectedProduct.reviews} reviews)</span>
          </div>

          <div className="flex space-x-4 border-b mb-6">
            <button className="pb-2 border-b-2 border-pink-600 font-semibold text-sm">Detail</button>
            <button className="pb-2 text-gray-400 text-sm">Features</button>
            <button className="pb-2 text-gray-400 text-sm">Reviews</button>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            {selectedProduct.description}
          </p>

          <button className="w-full bg-black text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-900 transition-colors shadow-xl">
            PURCHASE NOW
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 max-w-lg mx-auto">
      {/* Search & Tabs */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex-grow bg-white border border-gray-200 rounded-2xl px-4 py-3 flex items-center space-x-3 shadow-sm">
          <Search className="w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search marketplace..." className="bg-transparent border-none outline-none w-full text-sm" />
        </div>
        <button 
          onClick={() => setView('my-market')}
          className="p-3 bg-white rounded-2xl text-gray-700 shadow-sm border border-gray-100 hover:scale-105 transition-transform"
        >
          <Store className="w-6 h-6" />
        </button>
        <button onClick={() => setView('ar')} className="p-3 bg-pink-100 rounded-2xl text-pink-600 shadow-sm transition-transform hover:scale-105 active:scale-95">
          <Camera className="w-6 h-6" />
        </button>
      </div>

      {/* Featured Banner */}
      <div className="relative h-48 rounded-3xl overflow-hidden mb-8 shadow-lg group">
        <img src="https://picsum.photos/seed/shopbanner/800/400" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-8">
          <h3 className="text-white text-2xl font-bold mb-2">Summer Collection</h3>
          <p className="text-white/80 text-sm mb-4">Up to 40% OFF on all activewear</p>
          <button className="bg-white text-black px-6 py-2 rounded-xl text-sm font-bold w-fit">SHOP NOW</button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex space-x-6 overflow-x-auto scrollbar-hide mb-8 py-1">
        {['All', 'Fashion', 'Beauty', 'Tech', 'Home', 'Art'].map(cat => (
          <button key={cat} className={`flex-shrink-0 text-sm font-medium ${cat === 'All' ? 'text-pink-600 border-b-2 border-pink-600 pb-1' : 'text-gray-400'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {allProducts.map(product => (
          <div 
            key={product.id} 
            onClick={() => { setSelectedProduct(product); setView('detail'); }}
            className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm group cursor-pointer transition-all hover:shadow-md"
          >
            <div className="relative h-48 overflow-hidden">
              <img src={product.image} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              <div className="absolute top-2 right-2 glass p-2 rounded-full">
                <Heart className="w-4 h-4 text-pink-600" />
              </div>
            </div>
            <div className="p-3">
              <h4 className="font-semibold text-sm truncate">{product.name}</h4>
              <p className="text-xs text-gray-400 mb-2">{product.seller}</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">${product.price}</span>
                <div className="flex items-center text-[10px] bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded-lg">
                  <Star className="w-3 h-3 fill-current mr-1" />
                  {product.rating}
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
