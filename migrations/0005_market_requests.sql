-- Marketplace quote / hire requests that persist even before a project exists.

create table if not exists market_requests (
  id serial primary key,
  user_id text not null,
  professional_id integer not null references professionals(id) on delete cascade,
  project_id integer references projects(id) on delete set null,
  kind text not null,
  message text,
  created_at timestamptz not null default now()
);
create index if not exists market_requests_user_idx on market_requests (user_id);
create index if not exists market_requests_pro_idx on market_requests (professional_id);
