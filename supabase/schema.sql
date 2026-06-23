-- ============================================================
-- SiteLab — MVP Database Schema
-- Run this in the Supabase SQL Editor (Project → SQL Editor → New query)
-- All monetary values stored in cents (ZAR)
-- ============================================================

-- ─── SHARED: updated_at trigger ───────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ─── PROFILES ─────────────────────────────────────────────────────────────────
-- One row per auth.users entry. Auto-created on signup via trigger below.

CREATE TABLE IF NOT EXISTS profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name    TEXT NOT NULL DEFAULT '',
  company_name TEXT,
  phone        TEXT,
  avatar_url   TEXT,
  role         TEXT NOT NULL DEFAULT 'owner'
                 CHECK (role IN ('owner', 'admin', 'member')),
  plan         TEXT NOT NULL DEFAULT 'starter'
                 CHECK (plan IN ('starter', 'pro', 'business', 'enterprise')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles: select own"
  ON profiles FOR SELECT USING (id = auth.uid());

CREATE POLICY "profiles: update own"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create a profile row when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, company_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'company_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ─── CLIENTS ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS clients (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name           TEXT        NOT NULL,
  contact_person TEXT        NOT NULL,
  email          TEXT        NOT NULL,
  phone          TEXT        NOT NULL,
  address        TEXT,
  city           TEXT,
  province       TEXT CHECK (province IN (
                   'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal',
                   'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape'
                 )),
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clients: select own"  ON clients FOR SELECT  USING (user_id = auth.uid());
CREATE POLICY "clients: insert own"  ON clients FOR INSERT  WITH CHECK (user_id = auth.uid());
CREATE POLICY "clients: update own"  ON clients FOR UPDATE  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "clients: delete own"  ON clients FOR DELETE  USING (user_id = auth.uid());

CREATE TRIGGER clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ─── QUOTES ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS quotes (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number  TEXT        NOT NULL UNIQUE DEFAULT '',
  user_id       UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id     UUID        NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  title         TEXT        NOT NULL,
  description   TEXT,
  subtotal      INTEGER     NOT NULL DEFAULT 0,  -- cents
  vat_amount    INTEGER     NOT NULL DEFAULT 0,  -- cents
  total         INTEGER     NOT NULL DEFAULT 0,  -- cents
  include_vat   BOOLEAN     NOT NULL DEFAULT TRUE,
  valid_until   DATE        NOT NULL,
  terms         TEXT,
  notes         TEXT,
  status        TEXT        NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'declined', 'expired')),
  sent_at       TIMESTAMPTZ,
  viewed_at     TIMESTAMPTZ,
  responded_at  TIMESTAMPTZ,
  signature_url TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quotes_user_id   ON quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_quotes_client_id ON quotes(client_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status    ON quotes(status);

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quotes: select own"  ON quotes FOR SELECT  USING (user_id = auth.uid());
CREATE POLICY "quotes: insert own"  ON quotes FOR INSERT  WITH CHECK (user_id = auth.uid());
CREATE POLICY "quotes: update own"  ON quotes FOR UPDATE  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "quotes: delete own"  ON quotes FOR DELETE  USING (user_id = auth.uid());

CREATE TRIGGER quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-generate quote_number as "QT-YYYY-NNNN" scoped per user per year
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TRIGGER AS $$
DECLARE
  year_str TEXT    := TO_CHAR(NOW(), 'YYYY');
  seq      INTEGER;
BEGIN
  IF NEW.quote_number IS NULL OR NEW.quote_number = '' THEN
    SELECT COUNT(*) + 1
    INTO seq
    FROM quotes
    WHERE user_id = NEW.user_id
      AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());

    NEW.quote_number := 'QT-' || year_str || '-' || LPAD(seq::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quotes_set_number
  BEFORE INSERT ON quotes
  FOR EACH ROW EXECUTE FUNCTION generate_quote_number();


-- ─── QUOTE LINE ITEMS ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS quote_line_items (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id    UUID        NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  description TEXT        NOT NULL,
  category    TEXT        NOT NULL DEFAULT 'other'
                CHECK (category IN ('labour', 'material', 'equipment', 'other')),
  quantity    NUMERIC(10,2) NOT NULL DEFAULT 1,
  unit        TEXT        NOT NULL DEFAULT 'each',
  unit_price  INTEGER     NOT NULL DEFAULT 0,  -- cents
  total       INTEGER     NOT NULL DEFAULT 0,  -- cents (quantity * unit_price, set by app)
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quote_line_items_quote_id ON quote_line_items(quote_id);

ALTER TABLE quote_line_items ENABLE ROW LEVEL SECURITY;

-- RLS via parent quote ownership
CREATE POLICY "quote_line_items: select own"
  ON quote_line_items FOR SELECT
  USING (quote_id IN (SELECT id FROM quotes WHERE user_id = auth.uid()));

CREATE POLICY "quote_line_items: insert own"
  ON quote_line_items FOR INSERT
  WITH CHECK (quote_id IN (SELECT id FROM quotes WHERE user_id = auth.uid()));

CREATE POLICY "quote_line_items: update own"
  ON quote_line_items FOR UPDATE
  USING (quote_id IN (SELECT id FROM quotes WHERE user_id = auth.uid()));

CREATE POLICY "quote_line_items: delete own"
  ON quote_line_items FOR DELETE
  USING (quote_id IN (SELECT id FROM quotes WHERE user_id = auth.uid()));

CREATE TRIGGER quote_line_items_updated_at
  BEFORE UPDATE ON quote_line_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ─── PROJECTS ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS projects (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id   UUID        NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  quote_id    UUID        REFERENCES quotes(id) ON DELETE SET NULL,
  name        TEXT        NOT NULL,
  description TEXT,
  address     TEXT        NOT NULL,
  city        TEXT        NOT NULL,
  province    TEXT CHECK (province IN (
                'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal',
                'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape'
              )),
  status      TEXT        NOT NULL DEFAULT 'planning'
                CHECK (status IN ('planning', 'in_progress', 'on_hold', 'completed', 'cancelled')),
  start_date  DATE,
  end_date    DATE,
  budget      INTEGER     NOT NULL DEFAULT 0,  -- cents
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_user_id   ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status    ON projects(status);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects: select own"  ON projects FOR SELECT  USING (user_id = auth.uid());
CREATE POLICY "projects: insert own"  ON projects FOR INSERT  WITH CHECK (user_id = auth.uid());
CREATE POLICY "projects: update own"  ON projects FOR UPDATE  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "projects: delete own"  ON projects FOR DELETE  USING (user_id = auth.uid());

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ─── PROJECT MILESTONES ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS project_milestones (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id       UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title            TEXT        NOT NULL,
  description      TEXT,
  percent_complete INTEGER     NOT NULL DEFAULT 0 CHECK (percent_complete BETWEEN 0 AND 100),
  due_date         DATE,
  completed_at     TIMESTAMPTZ,
  sort_order       INTEGER     NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_milestones_project_id ON project_milestones(project_id);

ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;

-- RLS via parent project ownership
CREATE POLICY "project_milestones: select own"
  ON project_milestones FOR SELECT
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "project_milestones: insert own"
  ON project_milestones FOR INSERT
  WITH CHECK (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "project_milestones: update own"
  ON project_milestones FOR UPDATE
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "project_milestones: delete own"
  ON project_milestones FOR DELETE
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE TRIGGER project_milestones_updated_at
  BEFORE UPDATE ON project_milestones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
