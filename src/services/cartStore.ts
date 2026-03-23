import { create } from 'zustand';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  seller_id: string;
};

interface CartState {
  items: CartItem[];
  subtotal: number;
  total: number;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  subtotal: 0,
  total: 0,
  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      let newItems;
      if (existingItem) {
        newItems = state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        newItems = [...state.items, { ...item, quantity: 1 }];
      }
      const subtotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
      return { items: newItems, subtotal, total: subtotal };
    }),
  removeItem: (id) =>
    set((state) => {
      const newItems = state.items.filter((i) => i.id !== id);
      const subtotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
      return { items: newItems, subtotal, total: subtotal };
    }),
  updateQuantity: (id, quantity) =>
    set((state) => {
      const newItems = state.items.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i
      ).filter(i => i.quantity > 0);
      const subtotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
      return { items: newItems, subtotal, total: subtotal };
    }),
  clearCart: () => set({ items: [], subtotal: 0, total: 0 }),
}));
