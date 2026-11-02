# Nyx Videos

**AI Video Studio with true project continuity, face lock, voice cloning & music video support.**

Generate high-quality ads, artist trailers, music videos, cinematic scenes, cartoons and anime — segment by segment — while the AI remembers the previous shot, the exact face, the lighting and the style.

## What Nyx Videos does

- **Project continuity**: Create a project → break your script into ~15s parts → each new part continues from the last approved clip
- **Exact face lock**: Upload photos of a real person (your brother, actor, etc.) — the face stays that person
- **Asset uploads**: Logos, product shots, face photos, voice samples, full songs, SFX
- **Voice**: Upload a voice sample → use the real voice for spoken lines
- **Music videos**: Upload the song → generate visuals that stay in the same visual world
- **Smart audio**: Use your own music/SFX or let the system choose suitable ones + automatic music ducking for trailer-style voice-over
- **Prompt templates**: Built-in high-quality templates for every style with automatic continuity language
- **Camera language**: Dolly, tracking, crane, orbit, push-ins, etc. are understood and applied

## Quick Start

### 1. Requirements
- Node.js 20+
- FFmpeg (`ffmpeg` and `ffprobe` in PATH)

```bash
# macOS
brew install ffmpeg

# Ubuntu / Debian
sudo apt update && sudo apt install ffmpeg
```

### 2. Install & Run

```bash
cd nyx-videos          # or the folder name after unzip
npm install
npm run dev
```

Open **http://localhost:3000**

### 3. First project (Artist Trailer example)

1. Click **New Project** → name it → choose **Artist Trailer**
2. Go to **Characters** tab → add your brother’s name
3. Upload 3–6 clear face photos (front, ¾ angle, side)
4. Go to **Timeline**
5. Write the first 12–15 second beat and click **Generate Next 15s**
6. Review the result → click **Approve & Continue From Here**
7. Write the next beat → Generate again  
   → Nyx automatically continues from the previous last frame + same face references

## High-quality output (what you need to do)

The included **mock provider** fully exercises continuity, last-frame chaining and the UI so you can test everything immediately.

For **real high-quality video** you connect real model APIs:

| Provider       | Best for                          | Where to get key          |
|----------------|-----------------------------------|---------------------------|
| Kling 4.0      | Continuity + realism + face lock  | klingai.com / official API|
| Seedance 2.5   | Strong identity + motion          | Official / partner APIs   |
| Google Veo     | Prompt adherence + native audio   | Google AI Studio / Cloud  |
| Runway Gen-4.5 | Camera control + editing          | runwayml.com              |
| HeyGen         | Real-face talking heads           | heygen.com                |
| ElevenLabs     | Voice cloning                     | elevenlabs.io             |

1. Create accounts and get API keys
2. Add them as environment variables (see `.env.example` when you create it)
3. Implement the thin client in `src/lib/providers/` (the interface is already defined)
4. Register the provider — Nyx will start using it automatically

Until then the mock still lets you build full projects, test continuity, upload faces/voices/songs, and approve segments.

## Project structure (core)

```
src/
  lib/
    continuity/engine.ts   ← the heart: last-frame + identity + prompt injection
    prompts/               ← high-quality templates + builder
    video/ffmpeg.ts        ← last-frame extraction, concat, music ducking
    video/generate.ts      ← orchestrator
    providers/             ← plug real models here
    db/store.ts            ← projects, characters, assets, clips
    audio/voice.ts         ← voice cloning ready
  app/                     ← UI + API routes
```

## Luganda & other languages

Current video models still produce weak low-resource language audio.  
Recommended path inside Nyx:

1. Generate the visuals (with or without English placeholder audio)
2. Generate high-quality Luganda (or other) speech with a dedicated TTS / your cloned voice
3. Lip-sync + mux the final audio

The asset system already accepts voice samples and songs so this workflow is supported.

## License

Private / your use. Built for you.

---

## Deploy as a Website (Vercel)

See **DEPLOY.md** for the full step-by-step.

Short version:
1. Push this folder to a GitHub repository
2. Import the repo on vercel.com
3. Add your API keys in Vercel → Settings → Environment Variables
4. Redeploy

Your keys stay private. Never commit them to GitHub.
