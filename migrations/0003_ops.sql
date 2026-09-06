-- Change orders, daily logs, and order tracking

create table if not exists change_orders (
  id serial primary key,
  project_id integer not null references projects(id) on delete cascade,
  title text not null,
  detail text,
  cost_delta integer not null default 0,
  days_delta integer not null default 0,
  status text not null default 'proposed',
  created_at timestamptz not null default now()
);
create index if not exists change_orders_project_idx on change_orders (project_id);

create table if not exists daily_logs (
  id serial primary key,
  project_id integer not null references projects(id) on delete cascade,
  log_date date not null,
  weather text not null default 'Clear',
  workers_count integer not null default 0,
  notes text,
  issues text,
  created_at timestamptz not null default now(),
  unique (project_id, log_date)
);
create index if not exists daily_logs_project_idx on daily_logs (project_id);
