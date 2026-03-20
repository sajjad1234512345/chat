import React, { useState } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2, CreditCard } from 'lucide-react';
import { useCartStore } from '../src/services/cartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckoutScreen } from './CheckoutScreen';

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSheet: React.FC<CartSheetProps> = ({ isOpen, onClose }) => {
  const { items, removeItem, updateQuantity } = useCartStore();
  const [showCheckout, setShowCheckout] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + shipping;

  if (showCheckout) {
    return (
      <CheckoutScreen 
        onBack={() => setShowCheckout(false)} 
        onSuccess={() => {
          setShowCheckout(false);
          onClose();
          alert('Order placed successfully!');
        }} 
      />
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[200]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-zinc-900 text-white rounded-t-3xl z-[201] p-6 max-h-[80vh] flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black uppercase tracking-widest">Your Cart</h2>
              <button onClick={onClose} className="p-2 bg-white/10 rounded-full"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 bg-white/5 p-3 rounded-2xl">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">{item.name}</h4>
                    <p className="text-xs text-zinc-400">${item.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 bg-white/10 rounded-lg"><Minus className="w-3 h-3" /></button>
                    <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 bg-white/10 rounded-lg"><Plus className="w-3 h-3" /></button>
                    <button onClick={() => removeItem(item.id)} className="p-1 text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>${subtotal}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>${shipping}</span></div>
              <div className="flex justify-between font-black text-lg"><span>Total</span><span>${total}</span></div>
              <button 
                onClick={() => setShowCheckout(true)}
                className="w-full bg-pink-600 py-4 rounded-2xl font-black uppercase tracking-widest mt-4 flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-5 h-5" /> <span>Checkout</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
