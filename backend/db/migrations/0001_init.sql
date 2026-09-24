-- Phase 1: persist Customers and Users to real tables.
-- website/password_hash are added now (needed by Profile and Phase 2 auth)
-- even though nothing writes password_hash yet.

CREATE TABLE IF NOT EXISTS users (
  id            text PRIMARY KEY,
  first_name    text NOT NULL,
  last_name     text NOT NULL,
  email         text NOT NULL UNIQUE,
  role          text NOT NULL,
  phone         text,
  company       text,
  website       text,
  password_hash text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS customers (
  id         text PRIMARY KEY,
  name       text NOT NULL,
  email      text NOT NULL,
  phone      text NOT NULL,
  company    text NOT NULL,
  status     text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO users (id, first_name, last_name, email, role, phone, company, created_at)
VALUES
  ('user-admin', 'Channaveer', 'Patil', 'admin@starterkit.dev', 'SUPER_ADMIN', '555-010-1000', 'Starter Kit Inc.', '2025-11-02T09:15:00.000Z'),
  ('user-admin-2', 'Morgan', 'Blake', 'admin2@starterkit.dev', 'ADMIN', '555-010-1500', 'Starter Kit Inc.', '2025-11-20T09:15:00.000Z'),
  ('user-manager', 'Taylor', 'Reyes', 'manager@starterkit.dev', 'MANAGER', '555-010-1800', 'Starter Kit Inc.', '2025-12-01T09:15:00.000Z'),
  ('user-normal', 'Normal', 'User', 'user@starterkit.dev', 'USER', '555-010-2000', 'Starter Kit Inc.', '2025-12-18T14:32:00.000Z'),
  ('user-viewer', 'Jamie', 'Rivera', 'jamie.rivera@starterkit.dev', 'VIEWER', '555-010-3000', 'Starter Kit Inc.', '2026-01-05T11:00:00.000Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (id, name, email, phone, company, status, created_at)
VALUES
  ('cus_001', 'Ava Thompson', 'ava.thompson@brightpeak.com', '(415) 555-0132', 'BrightPeak Media', 'active', '2025-11-02T09:15:00.000Z'),
  ('cus_002', 'Liam Chen', 'liam.chen@harborworks.io', '(312) 555-0198', 'Harborworks', 'active', '2025-12-18T14:32:00.000Z'),
  ('cus_003', 'Sofia Ramirez', 'sofia@northgatetrading.com', '(212) 555-0176', 'Northgate Trading Co.', 'lead', '2026-01-05T11:00:00.000Z'),
  ('cus_004', 'Noah Williams', 'noah.williams@cedarlinelogistics.com', '(206) 555-0110', 'Cedarline Logistics', 'inactive', '2025-08-27T16:45:00.000Z'),
  ('cus_005', 'Mia Patel', 'mia.patel@lumenfinancial.com', '(646) 555-0143', 'Lumen Financial', 'active', '2026-02-14T08:20:00.000Z'),
  ('cus_006', 'Ethan Brooks', 'ethan@summitretailgroup.com', '(720) 555-0187', 'Summit Retail Group', 'lead', '2026-03-01T13:10:00.000Z')
ON CONFLICT (id) DO NOTHING;
