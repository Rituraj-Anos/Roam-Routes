# Supabase setup — do this once

Follow top to bottom. Nothing here touches code; the code side is already done
and waiting for your keys. Budget: about 15 minutes.

---

## Step 1 — Create the project (you may have done this)

- supabase.com → New project
- Region: **Asia-Pacific (Mumbai / ap-south-1)** — closest to North Bengal
- Set a strong **database password** and save it in a password manager
- Security options: leave **Enable Data API** on, leave **Automatically expose
  new tables** on, leave **Enable automatic RLS** off. Our schema handles
  security itself, so these defaults are correct.
- Create, then wait ~2 minutes for it to provision.

---

## Step 2 — Run the schema

Left sidebar → **SQL Editor** → New query.

1. Open `supabase/schema.sql` from this repo, copy all of it, paste, click **Run**.
   You should see "Success. No rows returned." That is expected — it is creating
   tables, not reading them.
2. New query again. Open `supabase/seed.sql`, copy all, paste, **Run**. This
   loads the starter North Bengal content (4 packages, reviews, 2 guides).

If you ever want to start clean, you can re-run both; they are written to be
safe to run more than once.

---

## Step 3 — Create the owner login

1. Left sidebar → **Authentication** → **Users** → **Add user** → **Create new
   user**.
2. Enter the owner's email and a password. Tick "Auto Confirm User" so they can
   log in immediately.
3. Click the new user, copy their **User UID** (a long id like
   `a1b2c3d4-...`).
4. Go back to **SQL Editor**, new query, and run this — replacing the two
   placeholders:

   ```sql
   insert into admin_users (id, email, role)
   values ('PASTE_USER_UID_HERE', 'owner@roamandroutes.in', 'owner');
   ```

   Use the same email you created the user with. This is what marks them as an
   admin allowed to edit content.

---

## Step 4 — Copy the three keys

Left sidebar → **Project Settings** (gear) → **API**.

Copy these three values:

| Supabase label | Goes into `.env` as |
| --- | --- |
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| Project API keys → `anon` `public` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| Project API keys → `service_role` `secret` | `SUPABASE_SERVICE_ROLE_KEY` |

The `service_role` key is a master key. Never paste it anywhere public, never
commit it. `.env` is already gitignored, so it is safe there.

---

## Step 5 — Create your .env file

In the project root, create a file named exactly `.env` (copy `.env.example`).
Fill in the three Supabase values plus your real contact number:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

NEXT_PUBLIC_WHATSAPP_NUMBER=91XXXXXXXXXX
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional for now — email alerts on new inquiries
RESEND_API_KEY=
INQUIRY_NOTIFY_EMAIL=
```

---

## Step 6 — Tell me it's done

Once your `.env` has the three Supabase keys, tell me. I will repoint the
repository layer from the local JSON store to Supabase (one file), and from then
on every admin edit writes to the real database and survives deploys.

You do **not** need to send me the keys — they stay in your `.env` on your
machine. I just need to know the file is filled in so I can wire the code.

---

## What stays free

- Database + auth: comfortably within Supabase's free tier for a single agency.
- Images: keep those on Cloudflare R2 (10 GB free, no bandwidth charge), not in
  Supabase storage. That is the one thing that would cost money if misplaced.
- Hosting: Netlify free tier.

Realistic bill for the foreseeable future: zero.
