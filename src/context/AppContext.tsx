'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Product, Alert, calculateStatus } from '@/lib/supabase';
import { demoUser, demoProducts, demoAlerts } from '@/lib/demo-data';

interface AppState {
  user: User | null;
  products: Product[];
  alerts: Alert[];
  isAuthenticated: boolean;
  isDarkMode: boolean;
  isLoading: boolean;
  login: (phone: string, name?: string) => void;
  logout: () => void;
  toggleDarkMode: () => void;
  addProduct: (product: Omit<Product, 'id' | 'user_id' | 'created_at' | 'qr_code' | 'status'>) => void;
  deleteProduct: (id: string) => void;
  markAlertRead: (id: string) => void;
  markAllAlertsRead: () => void;
  getProduct: (id: string) => Product | undefined;
  getUnreadAlertCount: () => number;
  searchProducts: (query: string) => Product[];
  filterProducts: (status: string) => Product[];
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for auth state
    const savedAuth = localStorage.getItem('keepit_auth');
    const savedDark = localStorage.getItem('keepit_dark');
    const savedProducts = localStorage.getItem('keepit_products');
    const savedAlerts = localStorage.getItem('keepit_alerts');

    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      setUser(authData);
      setIsAuthenticated(true);
    }

    if (savedDark === 'true') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    if (savedProducts) {
      const prods = JSON.parse(savedProducts) as Product[];
      // Recalculate statuses
      setProducts(prods.map(p => ({ ...p, status: calculateStatus(p.expiry_date) })));
    } else {
      // Load demo data with recalculated statuses
      const updatedProducts = demoProducts.map(p => ({
        ...p,
        status: calculateStatus(p.expiry_date),
      }));
      setProducts(updatedProducts);
      localStorage.setItem('keepit_products', JSON.stringify(updatedProducts));
    }

    if (savedAlerts) {
      setAlerts(JSON.parse(savedAlerts));
    } else {
      setAlerts(demoAlerts);
      localStorage.setItem('keepit_alerts', JSON.stringify(demoAlerts));
    }

    setIsLoading(false);
  }, []);

  const login = (phone: string, name?: string) => {
    const userData: User = {
      ...demoUser,
      phone,
      name: name || demoUser.name,
    };
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('keepit_auth', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('keepit_auth');
  };

  const toggleDarkMode = () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    localStorage.setItem('keepit_dark', String(newValue));
    if (newValue) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const addProduct = (product: Omit<Product, 'id' | 'user_id' | 'created_at' | 'qr_code' | 'status'>) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      user_id: user?.id || 'demo-user-001',
      created_at: new Date().toISOString(),
      qr_code: `keepit-prod-${Date.now()}`,
      status: calculateStatus(product.expiry_date),
    };
    const updated = [newProduct, ...products];
    setProducts(updated);
    localStorage.setItem('keepit_products', JSON.stringify(updated));
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('keepit_products', JSON.stringify(updated));
  };

  const markAlertRead = (id: string) => {
    const updated = alerts.map(a => a.id === id ? { ...a, is_read: true } : a);
    setAlerts(updated);
    localStorage.setItem('keepit_alerts', JSON.stringify(updated));
  };

  const markAllAlertsRead = () => {
    const updated = alerts.map(a => ({ ...a, is_read: true }));
    setAlerts(updated);
    localStorage.setItem('keepit_alerts', JSON.stringify(updated));
  };

  const getProduct = (id: string) => products.find(p => p.id === id);

  const getUnreadAlertCount = () => alerts.filter(a => !a.is_read).length;

  const searchProducts = (query: string) => {
    const q = query.toLowerCase();
    return products.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.retailer.toLowerCase().includes(q)
    );
  };

  const filterProducts = (status: string) => {
    if (status === 'all') return products;
    return products.filter(p => p.status === status);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        products,
        alerts,
        isAuthenticated,
        isDarkMode,
        isLoading,
        login,
        logout,
        toggleDarkMode,
        addProduct,
        deleteProduct,
        markAlertRead,
        markAllAlertsRead,
        getProduct,
        getUnreadAlertCount,
        searchProducts,
        filterProducts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
