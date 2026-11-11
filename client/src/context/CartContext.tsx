import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, DeliveryZone, Promotion } from '../types/index.js';
import { api } from '../api/client.js';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (sku: string) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  deliveryZone: DeliveryZone | null;
  setDeliveryZone: (zone: DeliveryZone | null) => void;
  appliedCoupon: { code: string; discount: number; promo?: Promotion } | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  deliveryFee: number;
  finalTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'clevara_cart_items_v1';
const ZONE_STORAGE_KEY = 'clevara_selected_zone_v1';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [deliveryZone, setDeliveryZoneState] = useState<DeliveryZone | null>(() => {
    try {
      const stored = localStorage.getItem(ZONE_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; promo?: Promotion } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to sync cart to localStorage:', e);
    }
  }, [cart]);

  const setDeliveryZone = (zone: DeliveryZone | null) => {
    setDeliveryZoneState(zone);
    if (zone) {
      localStorage.setItem(ZONE_STORAGE_KEY, JSON.stringify(zone));
    } else {
      localStorage.removeItem(ZONE_STORAGE_KEY);
    }
  };

  const addToCart = (newItem: CartItem) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.sku === newItem.sku);
      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = Math.min(updated[existingIdx].quantity + newItem.quantity, newItem.maxStock);
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty
        };
        return updated;
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (sku: string) => {
    setCart(prev => prev.filter(item => item.sku !== sku));
  };

  const updateQuantity = (sku: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(sku);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.sku === sku) {
          return {
            ...item,
            quantity: Math.min(quantity, item.maxStock)
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const applyCoupon = async (code: string) => {
    try {
      const res = await api.validateCoupon(code, subtotal);
      if (res.valid) {
        setAppliedCoupon({ code: code.toUpperCase(), discount: res.discount });
        return { success: true, message: `Coupon ${code.toUpperCase()} applied! Saved Rs. ${res.discount}.` };
      }
      return { success: false, message: res.message || 'Invalid coupon.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to validate coupon.' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const deliveryFee = deliveryZone ? Number(deliveryZone.fee) : 0;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        deliveryZone,
        setDeliveryZone,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        deliveryFee,
        finalTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
