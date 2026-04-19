# RisePath Internet Setup

These files are now split into:

- `index.html`: public mobile flow
- `admin.html`: private dashboard for `deepdive9999@gmail.com`
- `risepath-config.js`: deployment config
- `risepath-data.js`: shared storage/auth layer
- `supabase-schema.sql`: database tables and policies

All three public flows now save directly into Supabase:

- student mentor requests
- mentor applications
- waitlist signups

## What still needs to be added

1. Run `supabase-schema.sql` in the Supabase SQL editor for the configured project.
   - If you already ran an older version of the schema, run it again. It now upgrades waitlist storage to include real signup details.
2. In Supabase Auth:
   - enable email auth / magic links
   - add your deployed `admin.html` URL as an allowed redirect
3. Host the files online, for example on Vercel, Netlify, or any static host.

## Current project config

- Supabase URL is already wired into `risepath-config.js`
- Supabase anon key is already wired into `risepath-config.js`
- Admin email is locked to `deepdive9999@gmail.com`

## Admin access

- The admin email is already hardcoded as `deepdive9999@gmail.com`.
- `admin.html` only grants dashboard access to a signed-in session whose email matches that address.

## Important MVP note

This version writes directly from the public frontend to Supabase using the anon key. That is fine for a prototype and small MVP, but before production you should harden it with:

- Edge Functions or a backend API for public writes
- rate limiting / abuse protection
- stronger validation for mentor and student submissions

## Local preview

If Supabase is not configured yet:

- `index.html` still works as a prototype
- `admin.html` shows setup guidance and can display local preview data
