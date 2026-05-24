'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Product, Alert, FamilyMember, calculateStatus } from '@/lib/supabase';
import { demoUser } from '@/lib/demo-data';

interface AppState {
  user: User | null;
  products: Product[];
  alerts: Alert[];
  familyMembers: FamilyMember[];
  isAuthenticated: boolean;
  isDarkMode: boolean;
  isLoading: boolean;
  login: (phone: string, name?: string) => void;
  logout: () => void;
  toggleDarkMode: () => void;
  addProduct: (product: Omit<Product, 'id' | 'user_id' | 'created_at' | 'qr_code' | 'status'> & { owner_name?: string }) => void;
  deleteProduct: (id: string) => void;
  markAlertRead: (id: string) => void;
  markAllAlertsRead: () => void;
  getProduct: (id: string) => Product | undefined;
  getUnreadAlertCount: () => number;
  searchProducts: (query: string) => Product[];
  filterProducts: (status: string) => Product[];
  inviteFamilyMember: (name: string, email: string, role: string) => void;
  removeFamilyMember: (id: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedAuth     = localStorage.getItem('keepit_auth');
    const savedDark     = localStorage.getItem('keepit_dark');
    const savedProducts = localStorage.getItem('keepit_products');
    const savedAlerts   = localStorage.getItem('keepit_alerts');
    const savedFamily   = localStorage.getItem('keepit_family_members');

    // ── Auth ───────────────────────────────────────────────
    let currentUserId = 'demo-user-001';
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        setUser(authData);
        setIsAuthenticated(true);
        currentUserId = authData.id;
      } catch { localStorage.removeItem('keepit_auth'); }
    }

    // ── Dark mode ──────────────────────────────────────────
    if (savedDark === 'true') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    // ── Family Members ─────────────────────────────────────
    const defaultFamily: FamilyMember[] = [
      { id: 'fam-1', name: 'Priya Sharma', email: 'priya@example.com', role: 'Wife', avatarColor: '#EC4899', joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'fam-2', name: 'Aarav Sharma', email: 'aarav@example.com', role: 'Son', avatarColor: '#10B981', joinedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() }
    ];

    let currentFamily: FamilyMember[] = defaultFamily;
    if (savedFamily) {
      try {
        currentFamily = JSON.parse(savedFamily);
        setFamilyMembers(currentFamily);
      } catch {
        setFamilyMembers(defaultFamily);
        localStorage.setItem('keepit_family_members', JSON.stringify(defaultFamily));
      }
    } else {
      setFamilyMembers(defaultFamily);
      localStorage.setItem('keepit_family_members', JSON.stringify(defaultFamily));
    }

    // ── Products ───────────────────────────────────────────
    const defaultProducts = (userId: string): Product[] => [
      {
        id: 'prod-family-1',
        user_id: 'fam-1',
        owner_name: 'Priya Sharma (Wife)',
        name: 'Dyson Airwrap Multi-Styler',
        brand: 'Dyson',
        retailer: 'Reliance Digital',
        purchase_date: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        warranty_months: 24,
        expiry_date: new Date(Date.now() + 540 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        amount_paid: 49900,
        receipt_url: '',
        qr_code: 'keepit-dyson-airwrap',
        status: 'active',
        created_at: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'prod-family-2',
        user_id: 'fam-2',
        owner_name: 'Aarav Sharma (Son)',
        name: 'PlayStation 5 Console',
        brand: 'Sony',
        retailer: 'Amazon',
        purchase_date: new Date(Date.now() - 380 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        warranty_months: 12,
        expiry_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        amount_paid: 54990,
        receipt_url: '',
        qr_code: 'keepit-ps5-console',
        status: 'expired',
        created_at: new Date(Date.now() - 380 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'prod-family-3',
        user_id: userId,
        owner_name: 'You',
        name: 'iPhone 15 Pro Max',
        brand: 'Apple',
        retailer: 'Apple Store',
        purchase_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        warranty_months: 12,
        expiry_date: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        amount_paid: 159900,
        receipt_url: '',
        qr_code: 'keepit-iphone15',
        status: 'active',
        created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const DEMO_IDS = new Set(['prod-001','prod-002','prod-003','prod-004','prod-005','prod-006']);
    if (savedProducts) {
      try {
        const all = JSON.parse(savedProducts) as Product[];
        const real = all.filter(p => !DEMO_IDS.has(p.id));
        const withStatus = real.map(p => ({ ...p, status: calculateStatus(p.expiry_date) }));
        setProducts(withStatus);
        localStorage.setItem('keepit_products', JSON.stringify(withStatus));
      } catch {
        const dp = defaultProducts(currentUserId);
        setProducts(dp);
        localStorage.setItem('keepit_products', JSON.stringify(dp));
      }
    } else {
      const dp = defaultProducts(currentUserId);
      setProducts(dp);
      localStorage.setItem('keepit_products', JSON.stringify(dp));
    }

    // ── Alerts ─────────────────────────────────────────────
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

  const inviteFamilyMember = (name: string, email: string, role: string) => {
    const randomColors = ['#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EF4444'];
    const newMember: FamilyMember = {
      id: `fam-${Date.now()}`,
      name,
      email,
      role,
      avatarColor: randomColors[Math.floor(Math.random() * randomColors.length)],
      joinedAt: new Date().toISOString()
    };
    const updated = [...familyMembers, newMember];
    setFamilyMembers(updated);
    localStorage.setItem('keepit_family_members', JSON.stringify(updated));
  };

  const removeFamilyMember = (id: string) => {
    const updated = familyMembers.filter(m => m.id !== id);
    setFamilyMembers(updated);
    localStorage.setItem('keepit_family_members', JSON.stringify(updated));
  };

  const addProduct = (product: Omit<Product, 'id' | 'user_id' | 'created_at' | 'qr_code' | 'status'> & { owner_name?: string }) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      user_id: user?.id || 'demo-user-001',
      owner_name: product.owner_name || 'You',
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
        familyMembers,
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
        inviteFamilyMember,
        removeFamilyMember
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
