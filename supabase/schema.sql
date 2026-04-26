-- KeepIt Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Table: users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone TEXT UNIQUE NOT NULL,
  name TEXT DEFAULT '',
  email TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Table: products
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  brand TEXT DEFAULT '',
  retailer TEXT DEFAULT '',
  purchase_date DATE,
  warranty_months INTEGER DEFAULT 12,
  expiry_date DATE,
  amount_paid NUMERIC(12, 2) DEFAULT 0,
  receipt_url TEXT DEFAULT '',
  qr_code TEXT DEFAULT '',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expiring', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_expiry ON products(expiry_date);
CREATE INDEX IF NOT EXISTS idx_products_qr_code ON products(qr_code);

-- ============================================
-- Table: alerts
-- ============================================
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('90day', '30day', '7day', 'expired')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_product_id ON alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_alerts_is_read ON alerts(is_read);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Users: can only view/update their own row
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Products: can only CRUD their own products
CREATE POLICY "Users can view own products"
  ON products FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own products"
  ON products FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own products"
  ON products FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own products"
  ON products FOR DELETE
  USING (auth.uid() = user_id);

-- Alerts: can only view/update their own alerts
CREATE POLICY "Users can view own alerts"
  ON alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts"
  ON alerts FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- Enable Realtime for alerts
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE alerts;

-- ============================================
-- Storage Bucket for receipt images
-- ============================================
-- Run this separately in Supabase Storage settings:
-- Create bucket: "receipts" (public: false)
-- Add policy: authenticated users can upload to their own folder (user_id/)

-- ============================================
-- Function: Auto-update product status
-- ============================================
CREATE OR REPLACE FUNCTION update_product_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.expiry_date <= CURRENT_DATE THEN
    NEW.status := 'expired';
  ELSIF NEW.expiry_date <= CURRENT_DATE + INTERVAL '30 days' THEN
    NEW.status := 'expiring';
  ELSE
    NEW.status := 'active';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_product_status
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_product_status();

-- ============================================
-- Function: Auto-generate alerts
-- ============================================
CREATE OR REPLACE FUNCTION generate_warranty_alerts()
RETURNS void AS $$
DECLARE
  prod RECORD;
  days_left INTEGER;
BEGIN
  FOR prod IN SELECT * FROM products WHERE status != 'expired' LOOP
    days_left := prod.expiry_date - CURRENT_DATE;

    -- 90-day alert
    IF days_left <= 90 AND days_left > 30 THEN
      INSERT INTO alerts (user_id, product_id, alert_type)
      SELECT prod.user_id, prod.id, '90day'
      WHERE NOT EXISTS (
        SELECT 1 FROM alerts WHERE product_id = prod.id AND alert_type = '90day'
      );
    END IF;

    -- 30-day alert
    IF days_left <= 30 AND days_left > 7 THEN
      INSERT INTO alerts (user_id, product_id, alert_type)
      SELECT prod.user_id, prod.id, '30day'
      WHERE NOT EXISTS (
        SELECT 1 FROM alerts WHERE product_id = prod.id AND alert_type = '30day'
      );
    END IF;

    -- 7-day alert
    IF days_left <= 7 AND days_left > 0 THEN
      INSERT INTO alerts (user_id, product_id, alert_type)
      SELECT prod.user_id, prod.id, '7day'
      WHERE NOT EXISTS (
        SELECT 1 FROM alerts WHERE product_id = prod.id AND alert_type = '7day'
      );
    END IF;

    -- Expired alert
    IF days_left <= 0 THEN
      INSERT INTO alerts (user_id, product_id, alert_type)
      SELECT prod.user_id, prod.id, 'expired'
      WHERE NOT EXISTS (
        SELECT 1 FROM alerts WHERE product_id = prod.id AND alert_type = 'expired'
      );
      -- Also update status
      UPDATE products SET status = 'expired' WHERE id = prod.id AND status != 'expired';
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Schedule this function to run daily via Supabase pg_cron:
-- SELECT cron.schedule('generate-alerts', '0 8 * * *', 'SELECT generate_warranty_alerts()');
