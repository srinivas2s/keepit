'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Product, Alert, FamilyMember, calculateStatus, supabase } from '@/lib/supabase';

interface AppState {
  user: User | null;
  products: Product[];
  alerts: Alert[];
  familyMembers: FamilyMember[];
  isAuthenticated: boolean;
  isDarkMode: boolean;
  isLoading: boolean;
  login: (phoneOrEmail: string, name?: string) => Promise<void>;
  logout: () => void;
  toggleDarkMode: () => void;
  addProduct: (product: Omit<Product, 'id' | 'user_id' | 'created_at' | 'qr_code' | 'status'> & { owner_name?: string }) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  markAlertRead: (id: string) => Promise<void>;
  markAllAlertsRead: () => Promise<void>;
  getProduct: (id: string) => Product | undefined;
  getUnreadAlertCount: () => number;
  searchProducts: (query: string) => Product[];
  filterProducts: (status: string) => Product[];
  inviteFamilyMember: (name: string, email: string, role: string) => Promise<void>;
  removeFamilyMember: (id: string) => Promise<void>;
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

  // ── Initial State Loading ─────────────────────────────────
  useEffect(() => {
    const savedAuth = localStorage.getItem('keepit_auth');
    const savedDark = localStorage.getItem('keepit_dark');

    // Theme setup
    if (savedDark === 'true') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    // Local authentication fallback
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        setUser(authData);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('keepit_auth');
      }
    }

    setIsLoading(false);
  }, []);

  // ── Database Sync Effect when Authenticated User Changes ──
  useEffect(() => {
    if (!user) {
      setProducts([]);
      setAlerts([]);
      setFamilyMembers([]);
      return;
    }

    const loadData = async () => {
      try {
        // Fetch Products
        const { data: dbProducts, error: prodErr } = await supabase
          .from('products')
          .select('*')
          .eq('user_id', user.id);

        if (!prodErr && dbProducts) {
          const withStatus = dbProducts.map(p => ({
            ...p,
            status: calculateStatus(p.expiry_date)
          }));
          setProducts(withStatus);
          localStorage.setItem('keepit_products', JSON.stringify(withStatus));
        } else {
          const savedProducts = localStorage.getItem('keepit_products');
          if (savedProducts) setProducts(JSON.parse(savedProducts));
        }

        // Fetch Family Members
        const { data: dbFamily, error: famErr } = await supabase
          .from('family_members')
          .select('*')
          .eq('user_id', user.id);

        if (!famErr && dbFamily) {
          const formatted = dbFamily.map(m => ({
            id: m.id,
            name: m.name,
            email: m.email,
            role: m.role,
            avatarColor: m.avatar_color,
            joinedAt: m.created_at
          }));
          setFamilyMembers(formatted);
          localStorage.setItem('keepit_family_members', JSON.stringify(formatted));
        } else {
          const savedFamily = localStorage.getItem('keepit_family_members');
          if (savedFamily) setFamilyMembers(JSON.parse(savedFamily));
        }

        // Fetch Alerts
        const { data: dbAlerts, error: alertErr } = await supabase
          .from('alerts')
          .select('*')
          .eq('user_id', user.id);

        if (!alertErr && dbAlerts) {
          setAlerts(dbAlerts);
          localStorage.setItem('keepit_alerts', JSON.stringify(dbAlerts));
        } else {
          const savedAlerts = localStorage.getItem('keepit_alerts');
          if (savedAlerts) setAlerts(JSON.parse(savedAlerts));
        }
      } catch (e) {
        console.error('Error synchronizing with Supabase:', e);
      }
    };

    loadData();
  }, [user]);

  // ── Authentication API ────────────────────────────────────
  const login = async (phoneOrEmail: string, name?: string) => {
    setIsLoading(true);
    try {
      const queryField = phoneOrEmail.includes('@') ? 'email' : 'phone';
      
      const { data: existingUser, error: queryError } = await supabase
        .from('users')
        .select('*')
        .eq(queryField, phoneOrEmail)
        .maybeSingle();

      let userData: User;

      if (existingUser) {
        userData = existingUser;
      } else {
        // Create new user if not exists
        const newId = 'usr-' + Math.random().toString(36).substring(2, 11);
        const newUser = {
          id: newId,
          phone: phoneOrEmail.includes('@') ? '' : phoneOrEmail,
          email: phoneOrEmail.includes('@') ? phoneOrEmail : '',
          name: name || 'User',
          created_at: new Date().toISOString(),
        };

        const { data: insertedUser, error: insertError } = await supabase
          .from('users')
          .insert(newUser)
          .select()
          .single();

        if (insertError) {
          userData = { ...newUser, id: newId };
        } else {
          userData = insertedUser;
        }
      }

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('keepit_auth', JSON.stringify(userData));
    } catch (err) {
      console.error('Login action error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('keepit_auth');
    localStorage.removeItem('keepit_products');
    localStorage.removeItem('keepit_family_members');
    localStorage.removeItem('keepit_alerts');
  };

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem('keepit_dark', String(next));
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // ── Products API ─────────────────────────────────────────
  const addProduct = async (product: Omit<Product, 'id' | 'user_id' | 'created_at' | 'qr_code' | 'status'> & { owner_name?: string }) => {
    if (!user) return;
    const newProduct = {
      user_id: user.id,
      name: product.name,
      brand: product.brand,
      retailer: product.retailer,
      purchase_date: product.purchase_date,
      warranty_months: product.warranty_months,
      expiry_date: product.expiry_date,
      amount_paid: product.amount_paid,
      receipt_url: product.receipt_url || '',
      qr_code: `keepit-${Date.now()}`,
      status: calculateStatus(product.expiry_date),
      owner_name: product.owner_name || 'You',
    };

    try {
      const { data, error } = await supabase
        .from('products')
        .insert(newProduct)
        .select()
        .single();

      if (!error && data) {
        setProducts(prev => [data, ...prev]);
        localStorage.setItem('keepit_products', JSON.stringify([data, ...products]));
      } else {
        const localProduct: Product = {
          ...newProduct,
          id: 'prod-' + Date.now(),
          created_at: new Date().toISOString(),
        };
        const updated = [localProduct, ...products];
        setProducts(updated);
        localStorage.setItem('keepit_products', JSON.stringify(updated));
      }
    } catch {
      const localProduct: Product = {
        ...newProduct,
        id: 'prod-' + Date.now(),
        created_at: new Date().toISOString(),
      };
      const updated = [localProduct, ...products];
      setProducts(updated);
      localStorage.setItem('keepit_products', JSON.stringify(updated));
    }
  };

  const deleteProduct = async (id: string) => {
    if (!user) return;
    try {
      await supabase
        .from('products')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
    } catch (e) {
      console.error(e);
    }
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('keepit_products', JSON.stringify(updated));
  };

  // ── Alerts API ───────────────────────────────────────────
  const markAlertRead = async (id: string) => {
    if (!user) return;
    try {
      await supabase
        .from('alerts')
        .update({ is_read: true })
        .eq('id', id)
        .eq('user_id', user.id);
    } catch (e) {
      console.error(e);
    }
    const updated = alerts.map(a => a.id === id ? { ...a, is_read: true } : a);
    setAlerts(updated);
    localStorage.setItem('keepit_alerts', JSON.stringify(updated));
  };

  const markAllAlertsRead = async () => {
    if (!user) return;
    try {
      await supabase
        .from('alerts')
        .update({ is_read: true })
        .eq('user_id', user.id);
    } catch (e) {
      console.error(e);
    }
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

  // ── Family Members API ───────────────────────────────────
  const inviteFamilyMember = async (name: string, email: string, role: string) => {
    if (!user) return;
    const colors = ['#1565C0', '#F59E0B', '#10B981', '#EC4899', '#8B5CF6', '#3B82F6', '#EF4444'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newMember = {
      user_id: user.id,
      name,
      email,
      role,
      avatar_color: randomColor,
    };

    try {
      const { data, error } = await supabase
        .from('family_members')
        .insert(newMember)
        .select()
        .single();

      if (!error && data) {
        const formatted: FamilyMember = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          avatarColor: data.avatar_color,
          joinedAt: data.created_at,
        };
        const updated = [...familyMembers, formatted];
        setFamilyMembers(updated);
        localStorage.setItem('keepit_family_members', JSON.stringify(updated));
      } else {
        const formatted: FamilyMember = {
          id: 'fam-' + Date.now(),
          name,
          email,
          role,
          avatarColor: randomColor,
          joinedAt: new Date().toISOString(),
        };
        const updated = [...familyMembers, formatted];
        setFamilyMembers(updated);
        localStorage.setItem('keepit_family_members', JSON.stringify(updated));
      }
    } catch {
      const formatted: FamilyMember = {
        id: 'fam-' + Date.now(),
        name,
        email,
        role,
        avatarColor: randomColor,
        joinedAt: new Date().toISOString(),
      };
      const updated = [...familyMembers, formatted];
      setFamilyMembers(updated);
      localStorage.setItem('keepit_family_members', JSON.stringify(updated));
    }
  };

  const removeFamilyMember = async (id: string) => {
    if (!user) return;
    try {
      await supabase
        .from('family_members')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
    } catch (e) {
      console.error(e);
    }
    const updated = familyMembers.filter(m => m.id !== id);
    setFamilyMembers(updated);
    localStorage.setItem('keepit_family_members', JSON.stringify(updated));
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
