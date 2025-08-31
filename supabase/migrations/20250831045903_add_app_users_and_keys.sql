create extension if not exists "pgcrypto";

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.app_users(id) on delete cascade,
  key_code text not null,
  label text,
  layer text default 'default',
  data jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists keys_user_id_idx on public.keys(user_id);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_keys_updated_at on public.keys;
create trigger set_keys_updated_at
before update on public.keys
for each row execute function public.set_updated_at();


