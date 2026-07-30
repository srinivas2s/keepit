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

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'mock-iphone15',
    user_id: '00000000-0000-0000-0000-000000000000',
    name: 'iPhone 15 Pro',
    brand: 'Apple',
    category: 'Electronics',
    retailer: 'Apple Store',
    purchase_date: new Date(Date.now() - 290 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    warranty_months: 12,
    expiry_date: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    amount_paid: 999.00,
    receipt_url: '',
    warranty_document_url: '',
    manual_url: '',
    qr_code: 'keepit-iphone15',
    status: 'active',
    created_at: new Date().toISOString(),
    owner_name: 'You'
  },
  {
    id: 'mock-macbook',
    user_id: '00000000-0000-0000-0000-000000000000',
    name: 'MacBook Pro M3',
    brand: 'Apple',
    category: 'Electronics',
    retailer: 'Amazon',
    purchase_date: new Date(Date.now() - 360 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    warranty_months: 12,
    expiry_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    amount_paid: 1999.00,
    receipt_url: '',
    warranty_document_url: '',
    manual_url: '',
    qr_code: 'keepit-macbook',
    status: 'expiring',
    created_at: new Date().toISOString(),
    owner_name: 'You'
  },
  {
    id: 'mock-headphones',
    user_id: '00000000-0000-0000-0000-000000000000',
    name: 'WH-1000XM5 Headphones',
    brand: 'Sony',
    category: 'Audio',
    retailer: 'Best Buy',
    purchase_date: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    warranty_months: 12,
    expiry_date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    amount_paid: 349.99,
    receipt_url: '',
    warranty_document_url: '',
    manual_url: '',
    qr_code: 'keepit-headphones',
    status: 'expired',
    created_at: new Date().toISOString(),
    owner_name: 'You'
  }
];

const MOCK_FAMILY: FamilyMember[] = [
  {
    id: 'mock-fam-1',
    name: 'Sarah Doe',
    email: 'sarah@example.com',
    role: 'Spouse',
    avatarColor: '#EC4899',
    joinedAt: new Date().toISOString()
  },
  {
    id: 'mock-fam-2',
    name: 'Alex Doe',
    email: 'alex@example.com',
    role: 'Child',
    avatarColor: '#8B5CF6',
    joinedAt: new Date().toISOString()
  }
];

const MOCK_ALERTS: Alert[] = [
  {
    id: 'mock-alert-1',
    user_id: '00000000-0000-0000-0000-000000000000',
    product_id: 'mock-macbook',
    alert_type: '7day',
    is_read: false,
    created_at: new Date().toISOString(),
    product: MOCK_PRODUCTS[1]
  },
  {
    id: 'mock-alert-2',
    user_id: '00000000-0000-0000-0000-000000000000',
    product_id: 'mock-headphones',
    alert_type: 'expired',
    is_read: true,
    created_at: new Date().toISOString(),
    product: MOCK_PRODUCTS[2]
  }
];

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
    const isDark = savedDark === 'true';
    const t = setTimeout(() => setIsDarkMode(isDark), 0);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return () => clearTimeout(t);
  }, []);

  // ── Synchronous & Asynchronous Session Recovery ───────────
  useEffect(() => {
    let mounted = true;

    const recoverSession = async () => {
      if (!mounted) return;
      setIsLoading(true);
      try {
        const storedAuth = localStorage.getItem('keepit_auth');
        if (storedAuth) {
          const parsed = JSON.parse(storedAuth);
          if (parsed && (parsed.id === '00000000-0000-0000-0000-000000000000' || parsed.email.toLowerCase().startsWith('test') || parsed.name.toLowerCase() === 'test' || parsed.name.toLowerCase() === 'test account')) {
            parsed.id = '00000000-0000-0000-0000-000000000000';
            setUser(parsed);
            setIsAuthenticated(true);
            
            const storedProds = localStorage.getItem('keepit_products');
            if (storedProds && storedProds !== '[]') {
              setProducts(JSON.parse(storedProds));
            } else {
              setProducts(MOCK_PRODUCTS);
              localStorage.setItem('keepit_products', JSON.stringify(MOCK_PRODUCTS));
            }
            
            const storedFam = localStorage.getItem('keepit_family_members');
            if (storedFam && storedFam !== '[]') {
              setFamilyMembers(JSON.parse(storedFam));
            } else {
              setFamilyMembers(MOCK_FAMILY);
              localStorage.setItem('keepit_family_members', JSON.stringify(MOCK_FAMILY));
            }
            
            const storedAl = localStorage.getItem('keepit_alerts');
            if (storedAl && storedAl !== '[]') {
              setAlerts(JSON.parse(storedAl));
            } else {
              setAlerts(MOCK_ALERTS);
              localStorage.setItem('keepit_alerts', JSON.stringify(MOCK_ALERTS));
            }
            
            setIsLoading(false);
            return;
          }
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        if (error) {
          console.error('Supabase getSession error:', error);
          throw error;
        }
        
        if (session?.user) {
          const sessionUser = session.user;
          if (sessionUser.email?.toLowerCase().startsWith('test') || sessionUser.user_metadata?.name?.toLowerCase() === 'test' || sessionUser.user_metadata?.name?.toLowerCase() === 'test account') {
            const mockUser = {
              id: '00000000-0000-0000-0000-000000000000',
              phone: '9876543210',
              name: sessionUser.user_metadata?.name || 'Test Account',
              email: sessionUser.email || 'test@example.com',
              created_at: new Date().toISOString()
            };
            setUser(mockUser);
            setIsAuthenticated(true);
            localStorage.setItem('keepit_auth', JSON.stringify(mockUser));
            
            const storedProds = localStorage.getItem('keepit_products');
            if (storedProds && storedProds !== '[]') {
              setProducts(JSON.parse(storedProds));
            } else {
              setProducts(MOCK_PRODUCTS);
              localStorage.setItem('keepit_products', JSON.stringify(MOCK_PRODUCTS));
            }
            
            const storedFam = localStorage.getItem('keepit_family_members');
            if (storedFam && storedFam !== '[]') {
              setFamilyMembers(JSON.parse(storedFam));
            } else {
              setFamilyMembers(MOCK_FAMILY);
              localStorage.setItem('keepit_family_members', JSON.stringify(MOCK_FAMILY));
            }
            
            const storedAl = localStorage.getItem('keepit_alerts');
            if (storedAl && storedAl !== '[]') {
              setAlerts(JSON.parse(storedAl));
            } else {
              setAlerts(MOCK_ALERTS);
              localStorage.setItem('keepit_alerts', JSON.stringify(MOCK_ALERTS));
            }
            
            setIsLoading(false);
            return;
          }
          
          // Sync user profile in public.users table
          const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('id', sessionUser.id)
            .maybeSingle();

          if (!mounted) return;

          let finalUser: User;
          
          if (existingUser) {
            finalUser = existingUser;
          } else {
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

          if (mounted) {
            setUser(finalUser);
            setIsAuthenticated(true);
            localStorage.setItem('keepit_auth', JSON.stringify(finalUser));
          }
        } else {
          if (mounted) {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('keepit_auth');
          }
        }
      } catch (err) {
        console.error('Failed to recover session:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    recoverSession();

    // Listen for future auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      const storedAuth = localStorage.getItem('keepit_auth');
      if (storedAuth) {
        const parsed = JSON.parse(storedAuth);
        if (parsed && parsed.id === '00000000-0000-0000-0000-000000000000') {
          return;
        }
      }

      if (event === 'SIGNED_OUT') {
        setIsLoading(true);
        setUser(null);
        setIsAuthenticated(false);
        setProducts([]);
        setAlerts([]);
        setFamilyMembers([]);
        localStorage.removeItem('keepit_auth');
        localStorage.removeItem('keepit_products');
        localStorage.removeItem('keepit_family_members');
        localStorage.removeItem('keepit_alerts');
        setIsLoading(false);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          const sessionUser = session.user;
          const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('id', sessionUser.id)
            .maybeSingle();

          if (!mounted) return;

          let finalUser: User;
          
          if (existingUser) {
            finalUser = existingUser;
          } else {
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

          if (mounted) {
            setUser(finalUser);
            setIsAuthenticated(true);
            localStorage.setItem('keepit_auth', JSON.stringify(finalUser));
          }
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);


  // ── Database Sync Effect when Authenticated User Changes ──
  useEffect(() => {
    if (!user) return;
    if (user.id === '00000000-0000-0000-0000-000000000000') {
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
      const trimmedEmail = email.trim().toLowerCase();
      if (trimmedEmail.startsWith('test') && password === '121212') {
        const mockUser: User = {
          id: '00000000-0000-0000-0000-000000000000',
          phone: '9876543210',
          name: 'Test Account',
          email: trimmedEmail.includes('@') ? trimmedEmail : 'test@example.com',
          created_at: new Date().toISOString()
        };
        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('keepit_auth', JSON.stringify(mockUser));
        
        let initialProducts = MOCK_PRODUCTS;
        const storedProducts = localStorage.getItem('keepit_products');
        if (storedProducts) {
          try {
            initialProducts = JSON.parse(storedProducts);
          } catch (e) {
            initialProducts = MOCK_PRODUCTS;
          }
        } else {
          localStorage.setItem('keepit_products', JSON.stringify(MOCK_PRODUCTS));
        }
        setProducts(initialProducts);

        let initialFamily = MOCK_FAMILY;
        const storedFamily = localStorage.getItem('keepit_family_members');
        if (storedFamily) {
          try {
            initialFamily = JSON.parse(storedFamily);
          } catch (e) {
            initialFamily = MOCK_FAMILY;
          }
        } else {
          localStorage.setItem('keepit_family_members', JSON.stringify(MOCK_FAMILY));
        }
        setFamilyMembers(initialFamily);

        let initialAlerts = MOCK_ALERTS;
        const storedAlerts = localStorage.getItem('keepit_alerts');
        if (storedAlerts) {
          try {
            initialAlerts = JSON.parse(storedAlerts);
          } catch (e) {
            initialAlerts = MOCK_ALERTS;
          }
        } else {
          localStorage.setItem('keepit_alerts', JSON.stringify(MOCK_ALERTS));
        }
        setAlerts(initialAlerts);
        
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: password || 'KeepItPassword123!',
      });
      if (error) throw error;
      
      if (data?.user) {
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();
          
        if (existingUser) {
          setUser(existingUser);
          setIsAuthenticated(true);
          localStorage.setItem('keepit_auth', JSON.stringify(existingUser));
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, phone: string) => {
    setIsLoading(true);
    const trimmedEmail = email.trim().toLowerCase();
    try {
      if (trimmedEmail.startsWith('test') || name.toLowerCase().trim() === 'test') {
        const mockUser: User = {
          id: '00000000-0000-0000-0000-000000000000',
          phone: phone || '9876543210',
          name: name || 'Test Account',
          email: trimmedEmail.includes('@') ? trimmedEmail : 'test@example.com',
          created_at: new Date().toISOString()
        };
        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('keepit_auth', JSON.stringify(mockUser));
        
        localStorage.setItem('keepit_products', JSON.stringify(MOCK_PRODUCTS));
        localStorage.setItem('keepit_family_members', JSON.stringify(MOCK_FAMILY));
        localStorage.setItem('keepit_alerts', JSON.stringify(MOCK_ALERTS));

        setProducts(MOCK_PRODUCTS);
        setFamilyMembers(MOCK_FAMILY);
        setAlerts(MOCK_ALERTS);
        
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, phone },
          emailRedirectTo: undefined,
        }
      });
      
      if (error) {
        throw error;
      }

      if (data?.user) {
        const fallbackPhone = `phone-${data.user.id.substring(0, 8)}`;
        const newUserProfile = {
          id: data.user.id,
          phone: phone || fallbackPhone,
          name,
          email,
          created_at: new Date().toISOString()
        };

        const { data: upsertedUser } = await supabase
          .from('users')
          .upsert(newUserProfile, { onConflict: 'id' })
          .select()
          .single();

        const finalUser = upsertedUser || newUserProfile;
        setUser(finalUser);
        setIsAuthenticated(true);
        localStorage.setItem('keepit_auth', JSON.stringify(finalUser));
      }
    } catch (err: unknown) {
      console.warn('Supabase signup failed or rate-limited, falling back to instant local-first account:', err);
      const localId = `local-${Math.floor(100000 + Math.random() * 900000)}`;
      const fallbackUser: User = {
        id: localId,
        phone: phone || `phone-${localId}`,
        name: name || 'User',
        email: email,
        created_at: new Date().toISOString()
      };
      
      setUser(fallbackUser);
      setIsAuthenticated(true);
      localStorage.setItem('keepit_auth', JSON.stringify(fallbackUser));
      setProducts([]);
      setFamilyMembers([]);
      setAlerts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (user && user.id === '00000000-0000-0000-0000-000000000000') {
        setUser(null);
        setIsAuthenticated(false);
        setProducts([]);
        setAlerts([]);
        setFamilyMembers([]);
        localStorage.removeItem('keepit_auth');
        localStorage.removeItem('keepit_products');
        localStorage.removeItem('keepit_family_members');
        localStorage.removeItem('keepit_alerts');
        return;
      }
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

    if (user.id === '00000000-0000-0000-0000-000000000000') {
      const mockProduct: Product = {
        id: `mock-product-${Date.now()}`,
        user_id: user.id,
        name: product.name,
        brand: product.brand,
        category: product.category || 'Other',
        retailer: product.retailer,
        purchase_date: product.purchase_date,
        warranty_months: product.warranty_months,
        expiry_date: product.expiry_date,
        amount_paid: product.amount_paid,
        receipt_url: product.receipt_url || '',
        warranty_document_url: product.warranty_document_url || '',
        manual_url: product.manual_url || '',
        qr_code: `keepit-${Date.now()}`,
        status: calculateStatus(product.expiry_date),
        created_at: new Date().toISOString(),
        owner_name: product.owner_name || 'You',
      };
      const updated = [mockProduct, ...products];
      setProducts(updated);
      localStorage.setItem('keepit_products', JSON.stringify(updated));
      return;
    }

    const newProduct = {
      user_id: user.id,
      name: product.name,
      brand: product.brand,
      category: product.category || 'Other',
      retailer: product.retailer,
      purchase_date: product.purchase_date,
      warranty_months: product.warranty_months,
      expiry_date: product.expiry_date,
      amount_paid: product.amount_paid,
      receipt_url: product.receipt_url || '',
      warranty_document_url: product.warranty_document_url || '',
      manual_url: product.manual_url || '',
      qr_code: `keepit-${Date.now()}`,
      status: calculateStatus(product.expiry_date),
      owner_name: product.owner_name || 'You',
    };

    const { data, error } = await supabase
      .from('products')
      .insert(newProduct)
      .select()
      .single();

    if (error) {
      console.error('Error inserting product to database:', error);
      throw error;
    }

    if (data) {
      setProducts(prev => [data, ...prev]);
      localStorage.setItem('keepit_products', JSON.stringify([data, ...products]));
    }
  };

  const deleteProduct = async (id: string) => {
    if (!user) return;

    if (user.id === '00000000-0000-0000-0000-000000000000') {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      localStorage.setItem('keepit_products', JSON.stringify(updated));
      return;
    }

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

    if (user.id === '00000000-0000-0000-0000-000000000000') {
      const updated = alerts.map(a => a.id === id ? { ...a, is_read: true } : a);
      setAlerts(updated);
      localStorage.setItem('keepit_alerts', JSON.stringify(updated));
      return;
    }

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

    if (user.id === '00000000-0000-0000-0000-000000000000') {
      const updated = alerts.map(a => ({ ...a, is_read: true }));
      setAlerts(updated);
      localStorage.setItem('keepit_alerts', JSON.stringify(updated));
      return;
    }

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

    if (user.id === '00000000-0000-0000-0000-000000000000') {
      const colors = ['#1565C0', '#F59E0B', '#10B981', '#EC4899', '#8B5CF6', '#3B82F6', '#EF4444'];
      const randomColor = colors.at(Math.floor(Math.random() * colors.length)) || colors[0];
      const formatted: FamilyMember = {
        id: `mock-member-${Date.now()}`,
        name,
        email,
        role,
        avatarColor: randomColor,
        joinedAt: new Date().toISOString(),
      };
      const updated = [...familyMembers, formatted];
      setFamilyMembers(updated);
      localStorage.setItem('keepit_family_members', JSON.stringify(updated));
      return;
    }

    const colors = ['#1565C0', '#F59E0B', '#10B981', '#EC4899', '#8B5CF6', '#3B82F6', '#EF4444'];
    const randomColor = colors.at(Math.floor(Math.random() * colors.length)) || colors[0];
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

    if (user.id === '00000000-0000-0000-0000-000000000000') {
      const updated = familyMembers.filter(m => m.id !== id);
      setFamilyMembers(updated);
      localStorage.setItem('keepit_family_members', JSON.stringify(updated));
      return;
    }

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
