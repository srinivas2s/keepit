import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface User {
  id: string;
  phone: string;
  name: string;
  email: string;
  created_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  name: string;
  brand: string;
  retailer: string;
  purchase_date: string;
  warranty_months: number;
  expiry_date: string;
  amount_paid: number;
  receipt_url: string;
  qr_code: string;
  status: 'active' | 'expiring' | 'expired';
  created_at: string;
}

export interface Alert {
  id: string;
  user_id: string;
  product_id: string;
  alert_type: '90day' | '30day' | '7day' | 'expired';
  is_read: boolean;
  created_at: string;
  product?: Product;
}

// Helper to calculate status
export function calculateStatus(expiryDate: string): 'active' | 'expiring' | 'expired' {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffMs = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'expired';
  if (diffDays <= 30) return 'expiring';
  return 'active';
}

// Helper to calculate days remaining
export function daysRemaining(expiryDate: string): number {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffMs = expiry.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

// Helper to format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Helper to format date
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
