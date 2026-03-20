import React, { useState } from 'react';
import { ArrowLeft, CreditCard, MapPin } from 'lucide-react';
import { useCartStore } from '../src/services/cartStore';
import { supabase } from '../src/services/supabaseClient';
import { motion } from 'framer-motion';

interface CheckoutScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ onBack, onSuccess }) => {
  const { items, subtotal, total, clearCart } = useCartStore();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!address) return alert('Please enter your address');
    if (!supabase) return alert('Supabase is not configured');
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            items: items,
            total_price: total,
            shipping_address: address,
            status: 'pending',
          },
        ]);

      if (error) throw error;

      clearCart();
      onSuccess();
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 bg-zinc-900 text-white z-[202] p-6 overflow-y-auto"
    >
      <button onClick={onBack} className="mb-6 flex items-center space-x-2 text-zinc-400">
        <ArrowLeft className="w-5 h-5" /> <span>Back to Cart</span>
      </button>

      <h2 className="text-2xl font-black uppercase tracking-widest mb-6">Checkout</h2>

      <div className="space-y-4 mb-8">
        <div className="bg-white/5 p-4 rounded-2xl flex items-center space-x-3">
          <MapPin className="w-5 h-5 text-pink-500" />
          <input
            type="text"
            placeholder="Enter shipping address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-transparent w-full outline-none text-sm"
          />
        </div>
      </div>

      <div className="border-t border-white/10 pt-4 space-y-2 text-sm mb-8">
        <div className="flex justify-between font-black text-lg"><span>Total</span><span>${total}</span></div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-pink-600 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center space-x-2 disabled:opacity-50"
      >
        <CreditCard className="w-5 h-5" /> <span>{loading ? 'Processing...' : 'Place Order'}</span>
      </button>
    </motion.div>
  );
};
