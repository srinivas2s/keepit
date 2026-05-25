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
  login: (email: string, password?: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
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

  // ── Theme Setup ───────────────────────────────────────────
  useEffect(() => {
    const savedDark = localStorage.getItem('keepit_dark');
    if (savedDark === 'true') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // ── Listen to Supabase Auth State Changes ─────────────────
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsLoading(true);
      if (session?.user) {
        const sessionUser = session.user;
        
        // Sync user profile in public.users table
        const { data: existingUser, error: queryError } = await supabase
          .from('users')
          .select('*')
          .eq('id', sessionUser.id)
          .maybeSingle();

        let finalUser: User;
        
        if (existingUser) {
          finalUser = existingUser;
        } else {
          // If the profile does not exist yet (e.g. from sign up), insert it
          const fallbackPhone = `phone-${sessionUser.id.substring(0, 8)}`;
          const newUser = {
            id: sessionUser.id,
            phone: sessionUser.phone || sessionUser.user_metadata?.phone || fallbackPhone,
            email: sessionUser.email || '',
            name: sessionUser.user_metadata?.name || sessionUser.email?.split('@')[0] || 'User',
            created_at: new Date().toISOString()
          };

          const { data: insertedUser, error: insertError } = await supabase
            .from('users')
            .insert(newUser)
            .select()
            .single();

          finalUser = insertError ? newUser : insertedUser;
        }

        setUser(finalUser);
        setIsAuthenticated(true);
        localStorage.setItem('keepit_auth', JSON.stringify(finalUser));
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setProducts([]);
        setAlerts([]);
        setFamilyMembers([]);
        localStorage.removeItem('keepit_auth');
        localStorage.removeItem('keepit_products');
        localStorage.removeItem('keepit_family_members');
        localStorage.removeItem('keepit_alerts');
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ── Database Sync Effect when Authenticated User Changes ──
  useEffect(() => {
    if (!user) return;

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
        }

        // Fetch Alerts
        const { data: dbAlerts, error: alertErr } = await supabase
          .from('alerts')
          .select('*')
          .eq('user_id', user.id);

        if (!alertErr && dbAlerts) {
          setAlerts(dbAlerts);
          localStorage.setItem('keepit_alerts', JSON.stringify(dbAlerts));
        }
      } catch (e) {
        console.error('Error synchronizing with Supabase:', e);
      }
    };

    loadData();
  }, [user]);

  // ── Authentication API ────────────────────────────────────
  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: password || 'KeepItPassword123!',
      });
      if (error) throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, phone: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
          }
        }
      });
      
      if (error) throw error;

      if (data?.user) {
        // Automatically insert their profile to public.users linked directly to their auth id
        const newUserProfile = {
          id: data.user.id,
          phone: phone || `phone-${data.user.id.substring(0, 8)}`,
          name,
          email,
          created_at: new Date().toISOString()
        };

        await supabase.from('users').insert(newUserProfile);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
    } finally {
      setIsLoading(false);
    }
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

    const { data, error } = await supabase
      .from('products')
      .insert(newProduct)
      .select()
      .single();

    if (!error && data) {
      setProducts(prev => [data, ...prev]);
      localStorage.setItem('keepit_products', JSON.stringify([data, ...products]));
    } else {
      console.error('Error inserting product to database:', error);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    
    if (!error) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      localStorage.setItem('keepit_products', JSON.stringify(updated));
    }
  };

  // ── Alerts API ───────────────────────────────────────────
  const markAlertRead = async (id: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('alerts')
      .update({ is_read: true })
      .eq('id', id)
      .eq('user_id', user.id);

    if (!error) {
      const updated = alerts.map(a => a.id === id ? { ...a, is_read: true } : a);
      setAlerts(updated);
      localStorage.setItem('keepit_alerts', JSON.stringify(updated));
    }
  };

  const markAllAlertsRead = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('alerts')
      .update({ is_read: true })
      .eq('user_id', user.id);

    if (!error) {
      const updated = alerts.map(a => ({ ...a, is_read: true }));
      setAlerts(updated);
      localStorage.setItem('keepit_alerts', JSON.stringify(updated));
    }
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
      console.error('Error inviting family member to database:', error);
    }
  };

  const removeFamilyMember = async (id: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('family_members')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    
    if (!error) {
      const updated = familyMembers.filter(m => m.id !== id);
      setFamilyMembers(updated);
      localStorage.setItem('keepit_family_members', JSON.stringify(updated));
    }
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
        signUp,
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
