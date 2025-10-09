-- Debido a complicaciones para poder ejecutar comandos de sql desde local a la nube, pongo la estructura
-- de la base de datos en este archivo schema.sql para poder visualizar el como estanestablecidas

-- Estructura de la base de datos BD_BarberShop:

-- Extensiones útiles
-- create extension if not exists "uuid-ossp";
-- create extension if not exists btree_gist;

-- -- =====================================================
-- -- ENUMS
-- -- =====================================================
-- create type user_role as enum ('client','barber','admin');
-- create type appointment_status as enum (
--   'requested','confirmed','declined','completed','cancelled','no_show','rescheduled'
-- );
-- create type payment_status as enum ('pending','paid','refunded','failed');

-- =====================================================
-- TABLE: profiles
-- =====================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role default 'client',
  full_name text,
  phone text,
  avatar_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- =====================================================
-- TABLE: branches (sucursales / barberías)
-- =====================================================
create table public.branches (
  id_branch uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  phone text,
  timezone text default 'America/Mexico_City',
  slug text unique,
  cover_url text,
  lat numeric(10,7),
  lng numeric(10,7),
  is_active boolean default true,
  created_at timestamptz default now()
);

-- =====================================================
-- TABLE: services (servicios)
-- =====================================================
create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  duration_min integer not null check (duration_min > 0),
  price_cents integer not null check (price_cents >= 0),
  currency char(3) not null default 'MXN',
  branch_id uuid references public.branches(id_branch) on delete set null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- =====================================================
-- TABLE: barbers (información extendida del barbero)
-- =====================================================
create table public.barbers (
  id uuid primary key references public.profiles(id) on delete cascade,
  branch_id uuid references public.branches(id_branch) on delete set null,
  bio text,
  rating numeric(2,1) check (rating between 0 and 5),
  chair_number text,
  display_name text,
  photo_url text,
  specialties text[],
  created_at timestamptz default now()
);

-- =====================================================
-- TABLE: barber_services (N:M entre barberos y servicios)
-- =====================================================
create table public.barber_services (
  barber_id uuid not null references public.barbers(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  price_override_cents integer check (price_override_cents >= 0),
  duration_override_min integer check (duration_override_min > 0),
  is_active boolean default true,
  primary key (barber_id, service_id)
);

-- =====================================================
-- TABLE: working_hours (horarios semanales)
-- =====================================================
create table public.working_hours (
  id uuid primary key default gen_random_uuid(),
  barber_id uuid references public.barbers(id) on delete cascade,
  branch_id uuid references public.branches(id_branch) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  is_closed boolean default false,
  unique (barber_id, weekday, start_time, end_time)
);

-- =====================================================
-- TABLE: time_off (bloqueos puntuales / vacaciones)
-- =====================================================
create table public.time_off (
  id uuid primary key default gen_random_uuid(),
  barber_id uuid not null references public.barbers(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text,
  created_at timestamptz default now(),
  check (ends_at > starts_at)
);

-- =====================================================
-- TABLE: appointments (citas)
-- =====================================================
create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete restrict,
  barber_id uuid not null references public.barbers(id) on delete restrict,
  service_id uuid not null references public.services(id) on delete restrict,
  branch_id uuid references public.branches(id_branch) on delete set null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status appointment_status not null default 'requested',
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  declined_by uuid references public.profiles(id) on delete set null,
  declined_at timestamptz,
  decline_reason text,
  created_at timestamptz default now(),
  check (ends_at > starts_at)
);

-- -- Evitar solapes de citas confirmadas (para un mismo barbero)
-- alter table public.appointments
--   add constraint no_overlap_for_barber
--   exclude using gist (
--     barber_id with =,
--     tstzrange(starts_at, ends_at) with &&
--   )
--   where (status in ('confirmed'));

-- =====================================================
-- TABLE: payments (pagos)
-- =====================================================
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  amount_cents integer not null check (amount_cents >= 0),
  currency char(3) not null default 'MXN',
  status payment_status not null default 'pending',
  provider text,
  provider_ref text,
  created_at timestamptz default now()
);

-- =====================================================
-- TABLE: reviews (reseñas)
-- =====================================================
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid unique not null references public.appointments(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

-- -- =====================================================
-- -- INDEXES útiles
-- -- =====================================================
-- create index if not exists idx_services_active on public.services (is_active);
-- create index if not exists idx_barber_services_active on public.barber_services (is_active);
-- create index if not exists idx_appointments_barber on public.appointments (barber_id, starts_at);
-- create index if not exists idx_appointments_client on public.appointments (client_id, starts_at);
-- create index if not exists idx_working_hours_weekday on public.working_hours (barber_id, weekday);
-- create index if not exists idx_time_off_range on public.time_off (barber_id, starts_at, ends_at);