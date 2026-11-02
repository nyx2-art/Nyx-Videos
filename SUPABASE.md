# Supabase Setup for Nyx Videos (5 minutes)

## 1. Create free account

1. Go to https://supabase.com
2. Click **Start your project** → sign up with GitHub (easiest)
3. Create a new organization if asked
4. Click **New project**
   - Name: `nyx-videos`
   - Database password: create a strong one and save it
   - Region: choose the closest to you
5. Wait ~1–2 minutes for the project to be ready

## 2. Get your keys

1. In the left sidebar go to **Project Settings** (gear icon)
2. Click **API**
3. Copy these three values:
   - **Project URL** → this is `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → this is `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key (secret) → this is `SUPABASE_SERVICE_ROLE_KEY`

Keep the service_role key private (only put it in Vercel, never in the browser).

## 3. Create the database tables

1. In Supabase left sidebar click **SQL Editor**
2. Click **New query**
3. Open the file `supabase/schema.sql` from the Nyx Videos project
4. Copy everything and paste it into the SQL Editor
5. Click **Run**

You should see “Success”. Tables and the storage bucket are now created.

## 4. Add the keys to Vercel

After you deploy the project on Vercel:

1. Vercel → your project → **Settings → Environment Variables**
2. Add:

```
NEXT_PUBLIC_SUPABASE_URL          = (Project URL)
NEXT_PUBLIC_SUPABASE_ANON_KEY     = (anon public key)
SUPABASE_SERVICE_ROLE_KEY         = (service_role key)
KLING_API_KEY                     = (your Kling key)
HEYGEN_API_KEY                    = (your HeyGen key)
ELEVENLABS_API_KEY                = (your ElevenLabs key)
GOOGLE_API_KEY                    = (your Google key)
```

3. Redeploy the project.

Done. Projects, faces, and clips will now persist.
