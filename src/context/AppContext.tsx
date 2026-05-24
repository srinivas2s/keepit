'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Product, Alert, calculateStatus } from '@/lib/supabase';
import { demoUser } from '@/lib/demo-data';

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
    const savedAuth     = localStorage.getItem('keepit_auth');
    const savedDark     = localStorage.getItem('keepit_dark');
    const savedProducts = localStorage.getItem('keepit_products');
    const savedAlerts   = localStorage.getItem('keepit_alerts');

    // ── Auth ───────────────────────────────────────────────
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        setUser(authData);
        setIsAuthenticated(true);
      } catch { localStorage.removeItem('keepit_auth'); }
    }

    // ── Dark mode ──────────────────────────────────────────
    // Always sync the class with saved preference
    if (savedDark === 'true') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    // ── Products ───────────────────────────────────────────
    // DEMO DATA PURGE: remove old hardcoded demo products (prod-001 … prod-006)
    const DEMO_IDS = new Set(['prod-001','prod-002','prod-003','prod-004','prod-005','prod-006']);
    if (savedProducts) {
      try {
        const all = JSON.parse(savedProducts) as Product[];
        const real = all.filter(p => !DEMO_IDS.has(p.id));
        const withStatus = real.map(p => ({ ...p, status: calculateStatus(p.expiry_date) }));
        setProducts(withStatus);
        localStorage.setItem('keepit_products', JSON.stringify(withStatus));
      } catch {
        setProducts([]);
        localStorage.setItem('keepit_products', JSON.stringify([]));
      }
    } else {
      setProducts([]);
      localStorage.setItem('keepit_products', JSON.stringify([]));
    }

    // ── Alerts ─────────────────────────────────────────────
    // Purge alerts belonging to old demo products
    const DEMO_ALERT_IDS = new Set(['alert-001','alert-002','alert-003','alert-004','alert-005']);
    if (savedAlerts) {
      try {
        const all = JSON.parse(savedAlerts);
        const real = all.filter((a: { id: string }) => !DEMO_ALERT_IDS.has(a.id));
        setAlerts(real);
        localStorage.setItem('keepit_alerts', JSON.stringify(real));
      } catch {
        setAlerts([]);
        localStorage.setItem('keepit_alerts', JSON.stringify([]));
      }
    } else {
      setAlerts([]);
      localStorage.setItem('keepit_alerts', JSON.stringify([]));
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
