"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Asset {
  id: string;
  type: string;
  filename: string;
  path: string;
  mimeType: string;
}

interface Character {
  id: string;
  name: string;
  faceReferences: string[];
  fullBodyReferences?: string[];
  appearanceLock?: string;
  voiceCloneId?: string;
}

interface Clip {
  id: string;
  index: number;
  script: string;
  status: string;
  videoPath?: string;
  lastFramePath?: string;
  duration?: number;
  error?: string;
  finalPrompt?: string;
}

interface Project {
  id: string;
  name: string;
  style: string;
  description?: string;
  characters: Character[];
  assets: Asset[];
  clips: Clip[];
  lastApprovedClipId?: string;
}

const STYLE_LABELS: Record<string, string> = {
  realistic_ad: "Realistic Ad",
  artist_trailer: "Artist Trailer",
  music_video: "Music Video",
  cinematic_movie: "Cinematic Movie",
  cartoon: "Cartoon",
  anime: "Anime",
};

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [script, setScript] = useState("");
  const [generating, setGenerating] = useState(false);
  const [strengthenFace, setStrengthenFace] = useState(true);
  const [newCharName, setNewCharName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"timeline" | "assets" | "characters">("timeline");

  const fetchProject = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      const data = await res.json();
      if (data.project) setProject(data.project);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  async function handleGenerate() {
    if (!script.trim() || !project) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          script: script.trim(),
          duration: 15,
          strengthenFaceLock: strengthenFace,
        }),
      });
      const data = await res.json();
      if (data.project) {
        setProject(data.project);
        setScript("");
      } else if (data.error) {
        alert(data.error);
      }
    } catch (err: any) {
      alert(err.message || "Generation failed");
    } finally {
      setGenerating(false);
    }
  }

  async function handleApprove(clipId: string) {
    try {
      const res = await fetch("/api/clips/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, clipId }),
      });
      const data = await res.json();
      if (data.project) setProject(data.project);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAddCharacter() {
    if (!newCharName.trim()) return;
    try {
      const res = await fetch(`/api/projects/${projectId}/characters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCharName.trim() }),
      });
      const data = await res.json();
      if (data.character) {
        setNewCharName("");
        fetchProject();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleUpload(
    type: string,
    characterId?: string
  ) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept =
      type.includes("voice") || type === "song" || type === "music" || type === "sfx"
        ? "audio/*,video/*"
        : "image/*";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        const form = new FormData();
        form.append("projectId", projectId);
        form.append("type", type);
        form.append("file", file);
        if (characterId) form.append("characterId", characterId);

        const res = await fetch("/api/assets", {
          method: "POST",
          body: form,
        });
        const data = await res.json();
        if (data.asset) {
          await fetchProject();
        } else {
          alert(data.error || "Upload failed");
        }
      } catch (err: any) {
        alert(err.message);
      } finally {
        setUploading(false);
      }
    };
    input.click();
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-[#8b8b9e]">
        Loading project...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-[#8b8b9e] mb-4">Project not found</p>
        <Link href="/" className="text-continuum-400 hover:underline">
          ← Back to projects
        </Link>
      </div>
    );
  }

  const sortedClips = [...project.clips].sort((a, b) => a.index - b.index);
  const lastApproved = project.lastApprovedClipId
    ? project.clips.find((c) => c.id === project.lastApprovedClipId)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="text-sm text-[#8b8b9e] hover:text-white mb-3 inline-block"
        >
          ← All projects
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {project.name}
            </h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-[#8b8b9e]">
              <span className="px-2 py-0.5 rounded-full bg-[#16161f] border border-[#2a2a3a]">
                {STYLE_LABELS[project.style] || project.style}
              </span>
              {lastApproved && (
                <span className="text-continuum-400">
                  Continuity anchored to clip #{lastApproved.index + 1}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[#1c1c28]">
        {(["timeline", "characters", "assets"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? "border-continuum-500 text-white"
                : "border-transparent text-[#8b8b9e] hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Timeline Tab */}
      {activeTab === "timeline" && (
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Clip list */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-2">Timeline</h2>
            {sortedClips.length === 0 ? (
              <div className="border border-dashed border-[#2a2a3a] rounded-xl p-10 text-center text-[#8b8b9e]">
                No segments yet. Write a 10–15 second script on the right and
                generate the first clip. Subsequent clips will continue from the
                last approved one.
              </div>
            ) : (
              sortedClips.map((clip) => (
                <div
                  key={clip.id}
                  className={`rounded-xl border p-4 ${
                    clip.id === project.lastApprovedClipId
                      ? "border-continuum-600/60 bg-continuum-950/20"
                      : "border-[#1c1c28] bg-[#0f0f16]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#6b6b7b]">
                        #{clip.index + 1}
                      </span>
                      <StatusBadge status={clip.status} />
                      {clip.id === project.lastApprovedClipId && (
                        <span className="text-xs text-continuum-400">
                          Continuity source
                        </span>
                      )}
                    </div>
                    {clip.status === "ready" && (
                      <button
                        onClick={() => handleApprove(clip.id)}
                        className="text-xs px-3 py-1 rounded-md bg-continuum-600 hover:bg-continuum-500 text-white"
                      >
                        Approve & Continue From Here
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-[#c8c8d4] mb-3 whitespace-pre-wrap">
                    {clip.script}
                  </p>
                  {clip.videoPath && (
                    <div className="rounded-lg overflow-hidden bg-black aspect-video max-w-md">
                      <video
                        src={clip.videoPath}
                        controls
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  {clip.error && (
                    <p className="text-sm text-red-400 mt-2">{clip.error}</p>
                  )}
                  {clip.lastFramePath && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-[#6b6b7b]">
                      <span>Last frame extracted</span>
                      <img
                        src={clip.lastFramePath}
                        alt="Last frame"
                        className="h-10 rounded border border-[#2a2a3a]"
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Generate panel */}
          <div className="lg:sticky lg:top-20 h-fit">
            <div className="rounded-xl border border-[#1c1c28] bg-[#0f0f16] p-5 space-y-4">
              <h3 className="font-semibold">Next Segment</h3>
              <p className="text-xs text-[#8b8b9e]">
                Write what happens in the next ~15 seconds. Continuity,
                face lock, and style will be injected automatically.
              </p>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                rows={6}
                placeholder={
                  project.style === "artist_trailer"
                    ? "Slow push-in on his face as he looks into the distance. Soft dramatic lighting. He turns slightly toward camera..."
                    : "Describe the next 12–15 seconds of action, camera, and emotion..."
                }
                className="w-full px-3 py-2.5 rounded-lg bg-[#16161f] border border-[#2a2a3a] focus:border-continuum-500 focus:outline-none resize-none text-sm"
              />
              <label className="flex items-center gap-2 text-sm text-[#8b8b9e] cursor-pointer">
                <input
                  type="checkbox"
                  checked={strengthenFace}
                  onChange={(e) => setStrengthenFace(e.target.checked)}
                  className="rounded border-[#2a2a3a]"
                />
                Strengthen face lock
              </label>
              <button
                onClick={handleGenerate}
                disabled={generating || !script.trim()}
                className="w-full py-3 rounded-lg bg-continuum-600 hover:bg-continuum-500 disabled:opacity-50 text-white font-medium transition-colors"
              >
                {generating ? "Generating..." : "Generate Next 15s"}
              </button>
              {project.characters.length === 0 && (
                <p className="text-xs text-amber-500/90">
                  Tip: Add a character and upload face photos first for best identity lock.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Characters Tab */}
      {activeTab === "characters" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-[#8b8b9e] mb-1">
                Character name
              </label>
              <input
                type="text"
                value={newCharName}
                onChange={(e) => setNewCharName(e.target.value)}
                placeholder="e.g. My Brother"
                className="w-full px-3 py-2 rounded-lg bg-[#16161f] border border-[#2a2a3a] focus:border-continuum-500 focus:outline-none"
              />
            </div>
            <button
              onClick={handleAddCharacter}
              className="px-4 py-2 rounded-lg bg-continuum-600 hover:bg-continuum-500 text-white text-sm font-medium"
            >
              Add Character
            </button>
          </div>

          {project.characters.length === 0 ? (
            <p className="text-[#8b8b9e]">
              No characters yet. Add one, then upload multiple face photos
              (front, ¾, side) for strong identity lock.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {project.characters.map((char) => {
                const faceAssets = project.assets.filter((a) =>
                  char.faceReferences.includes(a.id)
                );
                return (
                  <div
                    key={char.id}
                    className="rounded-xl border border-[#1c1c28] bg-[#0f0f16] p-5"
                  >
                    <h3 className="font-semibold mb-3">{char.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {faceAssets.map((a) => (
                        <img
                          key={a.id}
                          src={a.path}
                          alt={a.filename}
                          className="w-16 h-16 object-cover rounded-lg border border-[#2a2a3a]"
                        />
                      ))}
                      {faceAssets.length === 0 && (
                        <span className="text-sm text-[#6b6b7b]">
                          No face photos yet
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleUpload("face_reference", char.id)}
                      disabled={uploading}
                      className="text-sm px-3 py-1.5 rounded-md border border-[#2a2a3a] hover:border-continuum-600 hover:text-continuum-300 transition-colors"
                    >
                      {uploading ? "Uploading..." : "+ Upload face photo"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Assets Tab */}
      {activeTab === "assets" && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3">
            {[
              { type: "logo", label: "Logo" },
              { type: "product", label: "Product" },
              { type: "voice_sample", label: "Voice Sample" },
              { type: "song", label: "Song (Music Video)" },
              { type: "music", label: "Background Music" },
              { type: "sfx", label: "SFX" },
              { type: "style_reference", label: "Style Reference" },
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => handleUpload(item.type)}
                disabled={uploading}
                className="px-3 py-1.5 rounded-lg border border-[#2a2a3a] hover:border-continuum-600 text-sm transition-colors"
              >
                + {item.label}
              </button>
            ))}
          </div>

          {project.assets.length === 0 ? (
            <p className="text-[#8b8b9e]">No assets uploaded yet.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {project.assets.map((asset) => (
                <div
                  key={asset.id}
                  className="rounded-lg border border-[#1c1c28] bg-[#0f0f16] p-3 flex items-center gap-3"
                >
                  {asset.mimeType.startsWith("image/") ? (
                    <img
                      src={asset.path}
                      alt={asset.filename}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded bg-[#16161f] flex items-center justify-center text-xs text-[#6b6b7b]">
                      AUD
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm truncate">{asset.filename}</p>
                    <p className="text-xs text-[#6b6b7b]">{asset.type}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-zinc-700 text-zinc-300",
    generating: "bg-amber-900/50 text-amber-300",
    ready: "bg-emerald-900/50 text-emerald-300",
    approved: "bg-continuum-900/50 text-continuum-300",
    rejected: "bg-red-900/50 text-red-300",
    failed: "bg-red-900/50 text-red-300",
  };
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full ${
        colors[status] || colors.pending
      }`}
    >
      {status}
    </span>
  );
}
