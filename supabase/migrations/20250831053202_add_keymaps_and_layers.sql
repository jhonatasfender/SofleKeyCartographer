-- Keymaps and layers support

create table if not exists public.keymaps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.app_users(id) on delete cascade,
  total_layers integer not null check (total_layers >= 1 and total_layers <= 32),
  active_layer integer not null default 0 check (active_layer >= 0),
  layer_names text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint keymaps_user_unique unique(user_id),
  constraint keymaps_active_lt_total check (active_layer < total_layers),
  constraint keymaps_layer_names_cardinality check (cardinality(layer_names) = total_layers)
);

create index if not exists keymaps_user_id_idx on public.keymaps(user_id);

drop trigger if exists set_keymaps_updated_at on public.keymaps;
create trigger set_keymaps_updated_at
before update on public.keymaps
for each row execute function public.set_updated_at();


