import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  subscription_status: 'active' | 'inactive';
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category: 'ebook' | 'workshop';
  icon: string;
}

interface Purchase {
  id: string;
  user_id: string;
  product_id: string;
  purchase_date: string;
  renewal_date?: string;
}

interface AppContextType {
  user: User | null;
  products: Product[];
  purchases: Purchase[];
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  purchaseProduct: (productId: string) => Promise<void>;
  subscribe: (plan: 'monthly' | 'yearly') => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Roman Feast Chronicles',
    description: 'Experience the grandeur of ancient Roman banquets through interactive recipes and historical narratives.',
    price: '$12.99',
    category: 'ebook',
    icon: '🏛️'
  },
  {
    id: '2',
    name: 'Egyptian Bread Making',
    description: 'Master the ancient art of Egyptian bread making with traditional techniques and ingredients.',
    price: '$24.99',
    category: 'workshop',
    icon: '🍞'
  },
  {
    id: '3',
    name: 'Medieval Monastery Meals',
    description: 'Discover the simple yet profound culinary traditions of medieval monastic life.',
    price: '$15.99',
    category: 'ebook',
    icon: '⛪'
  },
  {
    id: '4',
    name: 'Ancient Fermentation Secrets',
    description: 'Learn the lost art of ancient fermentation techniques from around the world.',
    price: '$29.99',
    category: 'workshop',
    icon: '🍯'
  },
  {
    id: '5',
    name: 'Viking Feast Adventures',
    description: 'Journey through the harsh lands of the Vikings and their hearty, survival-based cuisine.',
    price: '$18.99',
    category: 'ebook',
    icon: '⚔️'
  },
  {
    id: '6',
    name: 'Spice Road Treasures',
    description: 'Follow the ancient spice routes and learn to recreate the exotic flavors that shaped history.',
    price: '$22.99',
    category: 'ebook',
    icon: '🌶️'
  }
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [products] = useState<Product[]>(mockProducts);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('ancientEatsUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Load user purchases
    const savedPurchases = localStorage.getItem('ancientEatsPurchases');
    if (savedPurchases) {
      setPurchases(JSON.parse(savedPurchases));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - in real app, this would call an API
    const mockUser: User = {
      id: '1',
      name: email.split('@')[0],
      email,
      subscription_status: 'active'
    };
    
    setUser(mockUser);
    localStorage.setItem('ancientEatsUser', JSON.stringify(mockUser));
  };

  const register = async (name: string, email: string, password: string) => {
    // Mock registration - in real app, this would call an API
    const mockUser: User = {
      id: Date.now().toString(),
      name,
      email,
      subscription_status: 'inactive'
    };
    
    setUser(mockUser);
    localStorage.setItem('ancientEatsUser', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    setPurchases([]);
    localStorage.removeItem('ancientEatsUser');
    localStorage.removeItem('ancientEatsPurchases');
  };

  const purchaseProduct = async (productId: string) => {
    if (!user) throw new Error('User must be logged in');
    
    const newPurchase: Purchase = {
      id: Date.now().toString(),
      user_id: user.id,
      product_id: productId,
      purchase_date: new Date().toISOString()
    };

    const updatedPurchases = [...purchases, newPurchase];
    setPurchases(updatedPurchases);
    localStorage.setItem('ancientEatsPurchases', JSON.stringify(updatedPurchases));
  };

  const subscribe = async (plan: 'monthly' | 'yearly') => {
    if (!user) throw new Error('User must be logged in');
    
    const updatedUser = {
      ...user,
      subscription_status: 'active' as const
    };
    
    setUser(updatedUser);
    localStorage.setItem('ancientEatsUser', JSON.stringify(updatedUser));
  };

  const value: AppContextType = {
    user,
    products,
    purchases,
    login,
    register,
    logout,
    purchaseProduct,
    subscribe
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}