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
  detailedDescription?: string;
  sampleContent?: string;
  historicalContext?: string;
  ingredients?: string[];
  techniques?: string[];
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
    icon: '🏛️',
    detailedDescription: 'Dive deep into the opulent world of Roman dining culture, from the simple meals of common citizens to the extravagant banquets of emperors. This comprehensive guide includes authentic recipes, dining etiquette, and the social significance of food in ancient Rome.',
    historicalContext: 'Roman dining was a complex social ritual that reflected status, wealth, and cultural values. The wealthy Romans would host elaborate dinner parties called "convivium" that could last for hours, featuring multiple courses and entertainment.',
    ingredients: ['Garum (fermented fish sauce)', 'Honey', 'Wine', 'Olive oil', 'Various herbs and spices', 'Wheat flour'],
    sampleContent: 'Recipe for Libum (Roman Cheesecake): Mix 2 pounds of cheese with 1 pound of wheat flour. Add one egg and mix well. Shape into a loaf, wrap in bay leaves, and bake slowly on a hearth stone...'
  },
  {
    id: '2',
    name: 'Egyptian Bread Making',
    description: 'Master the ancient art of Egyptian bread making with traditional techniques and ingredients.',
    price: '$24.99',
    category: 'workshop',
    icon: '🍞',
    detailedDescription: 'Learn the sacred art of bread making as practiced by ancient Egyptian bakers. This hands-on workshop covers traditional fermentation methods, ancient grain varieties, and the spiritual significance of bread in Egyptian culture.',
    historicalContext: 'Bread was the cornerstone of ancient Egyptian diet and economy. Egyptian bakers were highly respected craftsmen, and bread was so important it was used as currency and offered to the gods in religious ceremonies.',
    techniques: ['Wild yeast cultivation', 'Clay oven construction', 'Ancient grain milling', 'Traditional kneading methods', 'Sacred baking rituals'],
    ingredients: ['Emmer wheat', 'Wild yeast starter', 'Nile water', 'Date syrup', 'Sesame seeds'],
    sampleContent: 'Day 1: Creating your wild yeast starter using ancient methods. We begin by mixing emmer flour with Nile-style water and allowing natural fermentation to occur over several days...'
  },
  {
    id: '3',
    name: 'Medieval Monastery Meals',
    description: 'Discover the simple yet profound culinary traditions of medieval monastic life.',
    price: '$15.99',
    category: 'ebook',
    icon: '⛪',
    detailedDescription: 'Explore the humble yet nourishing cuisine of medieval monasteries, where food was prepared with prayer and consumed in contemplative silence. Learn about seasonal eating, preservation techniques, and the spiritual aspects of cooking.',
    historicalContext: 'Medieval monasteries were centers of agricultural innovation and food preservation. Monks developed many techniques for brewing, cheese-making, and herb cultivation that influenced European cuisine for centuries.',
    ingredients: ['Barley', 'Root vegetables', 'Herbs from monastery gardens', 'Preserved meats', 'Monastery-brewed ale', 'Fresh dairy'],
    sampleContent: 'Brother Benedict\'s Pottage: A hearty stew made from barley, turnips, and whatever vegetables the monastery garden provided. This simple dish sustained monks through long days of prayer and labor...'
  },
  {
    id: '4',
    name: 'Ancient Fermentation Secrets',
    description: 'Learn the lost art of ancient fermentation techniques from around the world.',
    price: '$29.99',
    category: 'workshop',
    icon: '🍯',
    detailedDescription: 'Master the ancient science of fermentation through hands-on practice with traditional methods from various cultures. Create your own fermented foods using time-tested techniques that predate modern refrigeration.',
    historicalContext: 'Fermentation was humanity\'s first biotechnology, allowing our ancestors to preserve food, create alcoholic beverages, and develop complex flavors. Different cultures developed unique fermentation traditions based on local ingredients and climate.',
    techniques: ['Wild fermentation', 'Clay vessel preparation', 'Traditional timing methods', 'Natural preservation', 'Flavor development'],
    ingredients: ['Various grains and vegetables', 'Wild yeasts and bacteria', 'Sea salt', 'Honey', 'Traditional fermentation vessels'],
    sampleContent: 'Creating Kvass: This ancient Slavic fermented beverage begins with stale bread and natural fermentation. The process teaches patience and observation as you learn to read the signs of proper fermentation...'
  },
  {
    id: '5',
    name: 'Viking Feast Adventures',
    description: 'Journey through the harsh lands of the Vikings and their hearty, survival-based cuisine.',
    price: '$18.99',
    category: 'ebook',
    icon: '⚔️',
    detailedDescription: 'Experience the robust flavors of Viking cuisine, designed for warriors and seafarers who needed sustaining meals for long journeys and harsh winters. Learn about preservation techniques, foraging, and the social aspects of Viking feasting.',
    historicalContext: 'Viking cuisine was shaped by the harsh Scandinavian climate and the need for portable, long-lasting foods during raids and exploration. Feasting was central to Viking culture, strengthening bonds between warriors and celebrating victories.',
    ingredients: ['Preserved fish', 'Game meats', 'Root vegetables', 'Wild berries', 'Fermented dairy', 'Mead and ale'],
    sampleContent: 'Preparing for a Viking Feast: The great hall fills with smoke from the central fire as whole animals roast on spits. Mead flows freely as warriors share tales of their adventures...'
  },
  {
    id: '6',
    name: 'Spice Road Treasures',
    description: 'Follow the ancient spice routes and learn to recreate the exotic flavors that shaped history.',
    price: '$22.99',
    category: 'ebook',
    icon: '🌶️',
    detailedDescription: 'Embark on a culinary journey along the ancient spice routes, discovering how precious spices transformed cuisines and economies across continents. Learn to use traditional spice combinations and preservation methods.',
    historicalContext: 'The spice trade was one of the most important economic forces in ancient history, connecting East and West and driving exploration and cultural exchange. Spices were literally worth their weight in gold.',
    ingredients: ['Cinnamon', 'Black pepper', 'Cardamom', 'Saffron', 'Star anise', 'Cloves', 'Nutmeg'],
    sampleContent: 'The Merchant\'s Blend: A carefully guarded recipe from ancient Damascus, combining seven precious spices in proportions that create a flavor profile both exotic and harmonious...'
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
