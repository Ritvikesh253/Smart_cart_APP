import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'shop-owner' | 'vendor' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  vendorId: string;
  image: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  description: string;
  location: string;
  products: Product[];
}

export interface Order {
  id: string;
  shopOwnerId: string;
  vendorId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
}

export interface Message {
  id: string;
  from: string;
  to: string;
  content: string;
  date: string;
  read: boolean;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  products: Product[];
  vendors: Vendor[];
  cart: CartItem[];
  orders: Order[];
  messages: Message[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  placeOrder: () => void;
  sendMessage: (to: string, content: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Mock vendors data
  const [vendors] = useState<Vendor[]>([
    {
      id: '1',
      name: 'Fresh Farms Co.',
      email: 'contact@freshfarms.com',
      description: 'Premium organic produce from local farms',
      location: 'Springfield Valley',
      products: []
    },
    {
      id: '2',
      name: 'Dairy Delights',
      email: 'info@dairydelights.com',
      description: 'Fresh dairy products and artisanal cheese',
      location: 'Greenfield',
      products: []
    },
    {
      id: '3',
      name: 'Golden Bakery',
      email: 'hello@goldenbakery.com',
      description: 'Freshly baked bread and pastries daily',
      location: 'Downtown Market',
      products: []
    }
  ]);

  // Mock products data
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Organic Vegetables Mix',
      category: 'Vegetables',
      price: 24.99,
      quantity: 50,
      vendorId: '1',
      image: '/src/assets/product-vegetables.jpg'
    },
    {
      id: '2',
      name: 'Fresh Dairy Bundle',
      category: 'Dairy',
      price: 18.99,
      quantity: 30,
      vendorId: '2',
      image: '/src/assets/product-dairy.jpg'
    },
    {
      id: '3',
      name: 'Artisan Bread Collection',
      category: 'Bakery',
      price: 15.99,
      quantity: 40,
      vendorId: '3',
      image: '/src/assets/product-bakery.jpg'
    },
    {
      id: '4',
      name: 'Premium Fruit Basket',
      category: 'Fruits',
      price: 29.99,
      quantity: 25,
      vendorId: '1',
      image: '/src/assets/product-fruits.jpg'
    },
    {
      id: '5',
      name: 'Farm Fresh Tomatoes',
      category: 'Vegetables',
      price: 8.99,
      quantity: 100,
      vendorId: '1',
      image: '/src/assets/product-vegetables.jpg'
    },
    {
      id: '6',
      name: 'Organic Cheese Selection',
      category: 'Dairy',
      price: 22.99,
      quantity: 20,
      vendorId: '2',
      image: '/src/assets/product-dairy.jpg'
    }
  ]);

  const addToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId: product.id, quantity, product }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      vendorId: user?.id || ''
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const placeOrder = () => {
    if (cart.length === 0 || !user) return;

    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const newOrder: Order = {
      id: Date.now().toString(),
      shopOwnerId: user.id,
      vendorId: cart[0].product.vendorId,
      items: cart,
      total,
      status: 'pending',
      date: new Date().toISOString()
    };

    setOrders(prev => [...prev, newOrder]);
    clearCart();
  };

  const sendMessage = (to: string, content: string) => {
    if (!user) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      from: user.id,
      to,
      content,
      date: new Date().toISOString(),
      read: false
    };

    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        products,
        vendors,
        cart,
        orders,
        messages,
        addToCart,
        removeFromCart,
        clearCart,
        addProduct,
        updateProduct,
        deleteProduct,
        placeOrder,
        sendMessage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
