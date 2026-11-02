# Nyx Videos – Deploy to Vercel (Website)

## 1. Push to GitHub

1. Create a new empty repository on GitHub (name it `nyx-videos` or anything you like).
2. On your computer (or using GitHub mobile / Codespaces if needed):

```bash
cd nyx-videos
git init
git add .
git commit -m "Nyx Videos initial"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nyx-videos.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your real GitHub username.

## 2. Deploy on Vercel

1. Go to https://vercel.com and log in (use your GitHub account).
2. Click **Add New… → Project**.
3. Import the `nyx-videos` repository.
4. Leave the default settings (Framework: Next.js).
5. Click **Deploy**.

Vercel will build and give you a link like:
`https://nyx-videos-xxxx.vercel.app`

## 3. Add your API keys (safe way)

1. In Vercel → your project → **Settings → Environment Variables**
2. Add these one by one:

| Name              | Value (paste your new key) |
|-------------------|----------------------------|
| KLING_API_KEY     | (your new Kling key)       |
| HEYGEN_API_KEY    | (your new HeyGen key)      |
| ELEVENLABS_API_KEY| (your new ElevenLabs key)  |
| GOOGLE_API_KEY    | (your new Google key)      |

3. Make sure they are available for **Production**, **Preview**, and **Development**.
4. Click **Save**.
5. Go to **Deployments** → click the three dots on the latest deployment → **Redeploy**.

After redeploy the keys are active. Never put the real keys in the code or in GitHub.

## 4. Open the website

Use the Vercel link on your phone. You now have Nyx Videos as a website.

## Notes

- The current version still uses the mock generator for actual video output until the real provider clients are fully wired.
- Continuity, projects, face uploads, and the overall UI already work.
- For full production (real Kling/HeyGen calls + permanent storage) we will next connect cloud storage and the real API clients. The structure is already prepared for that.

