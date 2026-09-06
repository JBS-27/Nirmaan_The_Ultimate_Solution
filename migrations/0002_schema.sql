-- Nirmaan core schema

create table if not exists profiles (
  user_id text primary key,
  role text not null default 'owner',
  display_name text not null default '',
  phone text,
  city text,
  bio text,
  languages text not null default 'English, Hindi',
  onboarded boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists projects (
  id serial primary key,
  owner_id text not null,
  name text not null,
  city text not null,
  address text,
  lat double precision,
  lng double precision,
  project_type text not null,
  plot_sqft integer not null,
  floors integer not null default 1,
  budget integer not null,
  currency text not null default 'INR',
  start_date date not null,
  target_date date not null,
  requirements text,
  status text not null default 'planning',
  created_at timestamptz not null default now()
);
create index if not exists projects_owner_idx on projects (owner_id);

create table if not exists phases (
  id serial primary key,
  project_id integer not null references projects(id) on delete cascade,
  name text not null,
  sort_order integer not null,
  start_date date not null,
  end_date date not null,
  status text not null default 'upcoming',
  progress integer not null default 0,
  estimated_cost integer not null default 0
);
create index if not exists phases_project_idx on phases (project_id);

create table if not exists materials (
  id serial primary key,
  project_id integer not null references projects(id) on delete cascade,
  phase_id integer references phases(id) on delete set null,
  name text not null,
  category text not null,
  unit text not null,
  qty_needed double precision not null default 0,
  qty_ordered double precision not null default 0,
  qty_received double precision not null default 0,
  qty_used double precision not null default 0,
  unit_price double precision not null default 0,
  supplier_name text,
  status text not null default 'needed'
);
create index if not exists materials_project_idx on materials (project_id);

create table if not exists bills (
  id serial primary key,
  project_id integer not null references projects(id) on delete cascade,
  vendor text not null,
  amount double precision not null,
  bill_date date not null,
  category text not null default 'materials',
  notes text,
  paid boolean not null default false,
  ocr_text text,
  created_at timestamptz not null default now()
);
create index if not exists bills_project_idx on bills (project_id);

create table if not exists payments (
  id serial primary key,
  project_id integer not null references projects(id) on delete cascade,
  payee text not null,
  amount double precision not null,
  method text not null default 'upi',
  category text not null default 'other',
  paid_at date not null,
  notes text
);
create index if not exists payments_project_idx on payments (project_id);

create table if not exists workers (
  id serial primary key,
  project_id integer not null references projects(id) on delete cascade,
  name text not null,
  skill text not null,
  daily_rate integer not null,
  phone text,
  status text not null default 'active'
);
create index if not exists workers_project_idx on workers (project_id);

create table if not exists attendance (
  id serial primary key,
  worker_id integer not null references workers(id) on delete cascade,
  project_id integer not null references projects(id) on delete cascade,
  work_date date not null,
  present boolean not null default true,
  hours double precision not null default 8,
  method text not null default 'manual',
  unique (worker_id, work_date)
);
create index if not exists attendance_project_idx on attendance (project_id);

create table if not exists payouts (
  id serial primary key,
  worker_id integer not null references workers(id) on delete cascade,
  project_id integer not null references projects(id) on delete cascade,
  amount double precision not null,
  period_label text,
  paid_at date not null,
  notes text
);

create table if not exists photos (
  id serial primary key,
  project_id integer not null references projects(id) on delete cascade,
  phase_id integer references phases(id) on delete set null,
  caption text,
  image_url text not null,
  annotation text,
  created_at timestamptz not null default now()
);
create index if not exists photos_project_idx on photos (project_id);

create table if not exists messages (
  id serial primary key,
  project_id integer not null references projects(id) on delete cascade,
  author_id text not null,
  author_name text not null,
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists messages_project_idx on messages (project_id);

create table if not exists professionals (
  id serial primary key,
  user_id text unique,
  role text not null,
  name text not null,
  city text not null,
  specializations text not null,
  rate_min integer not null,
  rate_max integer not null,
  rate_unit text not null default 'project',
  rating double precision not null default 4.6,
  reviews integer not null default 12,
  bio text not null,
  licenses text,
  languages text not null default 'English, Hindi',
  verified boolean not null default true,
  response_hours integer not null default 6,
  availability text not null default 'Available'
);

create table if not exists suppliers (
  id serial primary key,
  user_id text unique,
  name text not null,
  city text not null,
  categories text not null,
  rating double precision not null default 4.5,
  reviews integer not null default 20,
  delivery_days integer not null default 2,
  phone text,
  verified boolean not null default true,
  address text
);

create table if not exists products (
  id serial primary key,
  supplier_id integer not null references suppliers(id) on delete cascade,
  name text not null,
  category text not null,
  unit text not null,
  price double precision not null,
  stock text not null default 'In stock'
);

create table if not exists quotes (
  id serial primary key,
  project_id integer not null references projects(id) on delete cascade,
  owner_id text not null,
  professional_id integer not null references professionals(id) on delete cascade,
  amount integer,
  message text,
  status text not null default 'requested',
  created_at timestamptz not null default now()
);

create table if not exists hires (
  id serial primary key,
  project_id integer not null references projects(id) on delete cascade,
  professional_id integer not null references professionals(id) on delete cascade,
  status text not null default 'active',
  hired_at date not null default current_date
);

create table if not exists orders (
  id serial primary key,
  project_id integer not null references projects(id) on delete cascade,
  owner_id text not null,
  supplier_id integer not null references suppliers(id) on delete cascade,
  product_id integer references products(id) on delete set null,
  item_name text not null,
  qty double precision not null,
  unit_price double precision not null,
  status text not null default 'placed',
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id serial primary key,
  user_id text not null,
  title text not null,
  body text not null,
  href text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_idx on notifications (user_id);

create table if not exists ai_messages (
  id serial primary key,
  user_id text not null,
  project_id integer references projects(id) on delete cascade,
  role text not null,
  content text not null,
  created_at timestamptz not null default now()
);
create index if not exists ai_messages_user_idx on ai_messages (user_id);
