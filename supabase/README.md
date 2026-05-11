Run migrations on your Supabase project using the SQL editor or the CLI.

1. Copy SQL into Dashboard → SQL and run

- Open Dashboard → SQL → New query
- Paste contents of the latest file in `supabase/migrations/*.sql`
- Run

2. Or use Supabase CLI (optional)

- Install: https://supabase.com/docs/guides/cli
- Create `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for the app
- For CLI auth, use `supabase login` and `supabase link` (separate from app env)

If CLI shows migration history mismatch after pulling:

- Ensure only timestamped files exist in `supabase/migrations`
- Then repair: `supabase migration repair --status applied <timestamp_of_last_migration>`
