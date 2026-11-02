-- Nyx Videos – Supabase schema
-- Run this in Supabase → SQL Editor → New query → paste & Run

-- Projects
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  style text not null,
  description text,
  style_locks jsonb default '{}',
  last_approved_clip_id uuid,
  song_asset_id uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Characters
create table if not exists characters (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  name text not null,
  face_references uuid[] default '{}',
  full_body_references uuid[] default '{}',
  voice_clone_id text,
  appearance_lock text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Assets (faces, logos, voice samples, songs, etc.)
create table if not exists assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  type text not null,
  filename text not null,
  path text not null,
  mime_type text,
  size bigint,
  duration numeric,
  meta jsonb default '{}',
  created_at timestamptz default now()
);

-- Clips (the 15s segments)
create table if not exists clips (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  index integer not null default 0,
  script text not null,
  final_prompt text,
  video_path text,
  last_frame_path text,
  status text not null default 'pending',
  provider text,
  generation_params jsonb,
  duration numeric,
  error text,
  character_ids uuid[],
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  approved_at timestamptz
);

-- Indexes for speed
create index if not exists characters_project_id_idx on characters(project_id);
create index if not exists assets_project_id_idx on assets(project_id);
create index if not exists clips_project_id_idx on clips(project_id);
create index if not exists clips_status_idx on clips(status);

-- Storage bucket for uploads (faces, audio, logos, videos)
-- Run this in Storage or via SQL:
insert into storage.buckets (id, name, public)
values ('nyx-assets', 'nyx-assets', true)
on conflict (id) do nothing;

-- Allow public read of the bucket (so videos and faces can be displayed)
create policy "Public read nyx-assets"
on storage.objects for select
using (bucket_id = 'nyx-assets');

-- Allow authenticated or service role to upload
create policy "Service upload nyx-assets"
on storage.objects for insert
with check (bucket_id = 'nyx-assets');
EOF
echo "schema.sql written"