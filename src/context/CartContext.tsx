import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import cartService, {type CartItem, type CartSummary } from '../services/cartService';
import { useAuth } from './AuthContext';

interface CartState {
  items: CartItem[];
  summary: CartSummary;
  loading: boolean;
  error: string | null;
}

interface CartContextValue extends CartState {
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (cartId: number, quantity: number) => Promise<void>;
  removeItem: (cartId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'SET_SUMMARY'; payload: CartSummary }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  items: [],
  summary: { itemCount: 0, totalAmount: 0 },
  loading: false,
  error: null,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_ITEMS':
      return { ...state, items: action.payload, loading: false, error: null };
    case 'SET_SUMMARY':
      return { ...state, summary: action.payload };
    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(item => item.productId === action.payload.productId);
      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = action.payload;
        return { ...state, items: updatedItems };
      }
      return { ...state, items: [...state.items, action.payload] };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    case 'CLEAR_CART':
      return { ...state, items: [], summary: { itemCount: 0, totalAmount: 0 } };
    default:
      return state;
  }
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuth();

  const setLoading = (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading });
  const setError = (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error });

  const refreshCart = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const [items, summary] = await Promise.all([
        cartService.getCartItems(),
        cartService.getCartSummary(),
      ]);
      dispatch({ type: 'SET_ITEMS', payload: items });
      dispatch({ type: 'SET_SUMMARY', payload: summary });
    } catch (error) {
      setError('獲取購物車失敗');
    }
  };

  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      setLoading(true);
      const item = await cartService.addToCart({ productId, quantity });
      dispatch({ type: 'ADD_ITEM', payload: item });
      
      // 更新摘要
      const summary = await cartService.getCartSummary();
      dispatch({ type: 'SET_SUMMARY', payload: summary });
    } catch (error) {
      setError('添加到購物車失敗');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartId: number, quantity: number) => {
    try {
      setLoading(true);
      const item = await cartService.updateCartItem(cartId, quantity);
      dispatch({ type: 'UPDATE_ITEM', payload: item });
      
      // 更新摘要
      const summary = await cartService.getCartSummary();
      dispatch({ type: 'SET_SUMMARY', payload: summary });
    } catch (error) {
      setError('更新數量失敗');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (cartId: number) => {
    try {
      setLoading(true);
      await cartService.removeFromCart(cartId);
      dispatch({ type: 'REMOVE_ITEM', payload: cartId });
      
      // 更新摘要
      const summary = await cartService.getCartSummary();
      dispatch({ type: 'SET_SUMMARY', payload: summary });
    } catch (error) {
      setError('移除商品失敗');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await cartService.clearCart();
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      setError('清空購物車失敗');
    } finally {
      setLoading(false);
    }
  };

  // 用戶登入時載入購物車
  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [user]);

  const value: CartContextValue = {
    ...state,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};