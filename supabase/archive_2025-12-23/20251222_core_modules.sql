-- Core Modules Schema for Diva Spa Wise
-- This file creates the necessary tables for Finance, Inventory, Services and Team modules.

-- 1. Transactions (Finance)
create table if not exists transactions (
    id text primary key,
    organization_id text not null,
    description text not null,
    category text,
    amount numeric not null,
    type text not null, -- 'income', 'expense'
    status text default 'paid',
    date date not null,
    payment_method text,
    unit_id text,
    revenue_type text, -- 'service', 'product'
    related_appointment_id text,
    created_at timestamp with time zone default now()
);
alter table transactions enable row level security;
drop policy if exists "Enable all access" on transactions;
create policy "Enable all access" on transactions for all using (true);

-- 2. Services (Catalog)
create table if not exists services (
    id text primary key,
    organization_id text not null,
    name text not null,
    category text,
    duration integer,
    price numeric,
    active boolean default true,
    loyalty_points integer default 0,
    description text,
    created_at timestamp with time zone default now()
);
alter table services enable row level security;
drop policy if exists "Enable all access" on services;
create policy "Enable all access" on services for all using (true);

-- 3. Products (Inventory)
create table if not exists products (
    id text primary key,
    organization_id text not null,
    name text not null,
    description text,
    price numeric,
    cost_price numeric,
    category text,
    stock integer default 0,
    min_stock_level integer default 5,
    created_at timestamp with time zone default now()
);
alter table products enable row level security;
drop policy if exists "Enable all access" on products;
create policy "Enable all access" on products for all using (true);

-- 4. Staff (Team)
create table if not exists staff (
    id text primary key,
    organization_id text not null,
    user_id text,
    name text not null,
    role text, 
    specialties text[], 
    status text default 'available',
    commission_rate numeric default 0,
    created_at timestamp with time zone default now()
);
alter table staff enable row level security;
drop policy if exists "Enable all access" on staff;
create policy "Enable all access" on staff for all using (true);

-- 5. Rooms
create table if not exists rooms (
    id text primary key,
    organization_id text not null,
    name text not null,
    type text,
    status text default 'available',
    created_at timestamp with time zone default now()
);
alter table rooms enable row level security;
drop policy if exists "Enable all access" on rooms;
create policy "Enable all access" on rooms for all using (true);
