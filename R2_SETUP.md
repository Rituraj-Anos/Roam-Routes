# Cloudflare R2 setup — for durable image uploads

You do NOT need this to launch. Unsplash links and pasted image URLs work
today and survive deploys. R2 only matters for the admin **Upload** button —
so a file the client drags in stays put on Netlify instead of being wiped on
the next deploy.

R2 is effectively free at your scale: 10 GB storage free, and — the important
part — **no egress fee**, so serving images to visitors never costs bandwidth.

Budget: ~10 minutes.

---

## Step 1 — Create the bucket

1. Sign in at dash.cloudflare.com (free account).
2. Left sidebar → **R2**. If prompted, enable R2 (it asks for a card for
   overage protection but the free tier needs no payment).
3. **Create bucket** → name it `roamandroutes-media` → location **Automatic** →
   Create.

## Step 2 — Make images publicly readable

Photos on a website must be public to load. Two ways; pick one.

**Option A — R2.dev subdomain (fastest, fine for launch)**
- Open the bucket → **Settings** → **Public access** → enable **R2.dev
  subdomain** → confirm.
- Copy the public URL it gives you, e.g.
  `https://pub-xxxxxxxx.r2.dev`. This is your `R2_PUBLIC_URL`.

**Option B — custom domain (nicer, do later)**
- Connect a subdomain like `media.roamandroutes.in` if/when the domain is on
  Cloudflare. Same idea, prettier URLs. Skip for now.

## Step 3 — Create an API token

1. R2 overview → **Manage R2 API Tokens** (top right) → **Create API token**.
2. Permissions: **Object Read & Write**.
3. Scope: **Apply to specific buckets** → `roamandroutes-media`.
4. Create. Copy the three values it shows once (you cannot see the secret
   again):
   - **Access Key ID**
   - **Secret Access Key**
   - **Endpoint** — looks like
     `https://<accountid>.r2.cloudflarestorage.com`

## Step 4 — Add to .env

Paste into your `.env` (I will add these keys to `.env.example` too):

```
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=paste_access_key_id
R2_SECRET_ACCESS_KEY=paste_secret_access_key
R2_BUCKET=roamandroutes-media
R2_PUBLIC_URL=https://pub-xxxxxxxx.r2.dev
```

## Step 5 — Tell me it is done

I will:
- add the S3-compatible client and swap the upload handler to put files in R2
  and return the public URL (the media flow is unchanged otherwise),
- add your R2 public hostname to `next.config.ts` image patterns,
- test an upload end to end.

You will not send me the keys — they live in your `.env`. Just say the file is
filled in.

---

## Do you even need it yet?

Not for launch. Until you wire R2, tell the client to use **"Paste an image
URL"** in the admin (every image field has it) instead of the Upload button.
Pasted URLs are just strings in the database and persist perfectly. R2 upgrades
the drag-and-drop upload from "works locally" to "works in production."
