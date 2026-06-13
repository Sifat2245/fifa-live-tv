"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Plus,
  Edit3,
  X,
  Check,
  Globe,
  Wifi,
  Monitor,
} from "lucide-react";
import type { StreamChannel } from "@/lib/types";

export default function ManagePage() {
  const [channels, setChannels] = useState<StreamChannel[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<StreamChannel>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newChannel, setNewChannel] = useState<Partial<StreamChannel>>({
    id: "",
    name: "",
    country: "",
    streamUrl: "",
    type: "hls",
    embedUrl: "",
    youtubeVideoId: "",
    isDefault: false,
  });

  useEffect(() => {
    loadConfig();
  }, []);

  async function loadConfig() {
    try {
      const res = await fetch("/api/admin/streams");
      const data = await res.json();
      setChannels(data.channels || []);
    } catch {
      console.error("Failed to load config");
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/streams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channels, matchOverrides: {} }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      console.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(ch: StreamChannel) {
    setEditingId(ch.id);
    setEditForm({
      id: ch.id,
      name: ch.name,
      country: ch.country,
      streamUrl: "",
      type: ch.type,
      embedUrl: "",
      youtubeVideoId: "",
      isDefault: ch.isDefault,
    });
  }

  function saveEdit() {
    setChannels((prev) =>
      prev.map((ch) => {
        if (ch.id !== editingId) return ch;
        // Only overwrite URL fields when user enters a new value
        return {
          ...ch,
          name: editForm.name ?? ch.name,
          country: editForm.country ?? ch.country,
          type: editForm.type ?? ch.type,
          isDefault: editForm.isDefault ?? ch.isDefault,
          streamUrl: editForm.streamUrl || ch.streamUrl,
          embedUrl: editForm.embedUrl || ch.embedUrl,
          youtubeVideoId: editForm.youtubeVideoId || ch.youtubeVideoId,
        } as StreamChannel;
      })
    );
    setEditingId(null);
    setEditForm({});
  }

  function addChannel() {
    if (!newChannel.id || !newChannel.name) return;
    const ch: StreamChannel = {
      id: newChannel.id,
      name: newChannel.name,
      country: newChannel.country || "",
      logo: newChannel.logo || "",
      streamUrl: newChannel.streamUrl || "",
      type: newChannel.type || "hls",
      embedUrl: newChannel.embedUrl || "",
      youtubeVideoId: newChannel.youtubeVideoId || "",
      isDefault: newChannel.isDefault || false,
    };
    setChannels((prev) => [...prev, ch]);
    setNewChannel({
      id: "",
      name: "",
      country: "",
      streamUrl: "",
      type: "hls",
      embedUrl: "",
      youtubeVideoId: "",
      isDefault: false,
    });
    setShowAddForm(false);
  }

  function getTypeIcon(type: string, hasYouTube?: boolean) {
    if (hasYouTube) {
      return <Monitor className="h-3.5 w-3.5 text-red-400" />;
    }
    if (type === "iframe") {
      return <Globe className="h-3.5 w-3.5 text-blue-400" />;
    }
    return <Wifi className="h-3.5 w-3.5 text-green-400" />;
  }

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="border-b border-zinc-800/60 bg-[#0A0E1A]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Monitor className="h-5 w-5 text-[#C9A84C]" />
            <h1 className="text-lg font-bold text-white">Manage Streams</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-[#C9A84C] px-4 py-2 text-xs font-semibold text-[#0A0E1A] transition-colors hover:bg-[#D4B85A] disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Channels List */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-300">Channels</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Channel
            </button>
          </div>

          {channels.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 py-10">
              <p className="text-sm text-zinc-500">No channels configured yet</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-3 text-xs text-[#C9A84C] hover:underline"
              >
                Add your first channel
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {channels.map((ch) => (
                <div
                  key={ch.id}
                  className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 transition-all duration-200 hover:border-zinc-700/60"
                >
                  {/* Channel header row */}
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Channel name & country */}
                      <div className="flex items-center gap-2.5 min-w-0">
                        {getTypeIcon(ch.type, !!ch.youtubeVideoId)}
                        <div className="min-w-0">
                          <span className="text-sm font-medium text-zinc-200 truncate block">
                            {ch.name}
                          </span>
                          {ch.country && (
                            <span className="text-[10px] uppercase tracking-wider text-zinc-600">
                              {ch.country}
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Type badge */}
                      <span
                        className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${
                          ch.youtubeVideoId
                            ? "bg-red-900/30 text-red-400"
                            : ch.type === "iframe"
                              ? "bg-blue-900/30 text-blue-400"
                              : "bg-green-900/30 text-green-400"
                        }`}
                      >
                        {ch.youtubeVideoId
                          ? "YouTube"
                          : ch.type === "iframe"
                            ? "Iframe"
                            : "HLS"}
                      </span>
                      {ch.isDefault && (
                        <span className="shrink-0 rounded bg-[#C9A84C]/10 px-1.5 py-0.5 text-[10px] text-[#C9A84C]">
                          Default
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      {editingId === ch.id ? (
                        <>
                          <button
                            onClick={saveEdit}
                            className="rounded-lg bg-green-600/20 p-1.5 text-green-400 transition-colors hover:bg-green-600/30"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditForm({});
                            }}
                            className="rounded-lg bg-zinc-800 p-1.5 text-zinc-500 transition-colors hover:bg-zinc-700 hover:text-zinc-400"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => startEdit(ch)}
                          className="rounded-lg bg-zinc-800/80 p-1.5 text-zinc-500 transition-colors hover:bg-zinc-700 hover:text-zinc-300"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded: Edit form */}
                  {editingId === ch.id && (
                    <div className="border-t border-zinc-800/40 px-4 py-3 space-y-2">
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <input
                          value={editForm.name || ""}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, name: e.target.value }))
                          }
                          placeholder="Channel name"
                          className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-300 outline-none focus:border-[#C9A84C]/50"
                        />
                        <input
                          value={editForm.country || ""}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, country: e.target.value }))
                          }
                          placeholder="Country code"
                          className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-300 outline-none focus:border-[#C9A84C]/50"
                        />
                        <select
                          value={editForm.type || "hls"}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              type: e.target.value as "hls" | "iframe",
                            }))
                          }
                          className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-300 outline-none focus:border-[#C9A84C]/50"
                        >
                          <option value="hls">Type: HLS</option>
                          <option value="iframe">Type: Iframe</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <input
                          value={editForm.streamUrl || ""}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              streamUrl: e.target.value,
                            }))
                          }
                          placeholder="HLS .m3u8 URL"
                          className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-300 outline-none focus:border-[#C9A84C]/50 font-mono"
                        />
                        <input
                          value={editForm.embedUrl || ""}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              embedUrl: e.target.value,
                            }))
                          }
                          placeholder="Iframe embed URL"
                          className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-300 outline-none focus:border-[#C9A84C]/50 font-mono"
                        />
                        <input
                          value={editForm.youtubeVideoId || ""}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              youtubeVideoId: e.target.value,
                            }))
                          }
                          placeholder="YouTube Video ID"
                          className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-300 outline-none focus:border-[#C9A84C]/50 font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add Channel Form */}
          {showAddForm && (
            <div className="mt-4 rounded-xl border border-[#C9A84C]/20 bg-zinc-900/60 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-semibold text-zinc-300">
                  New Channel
                </h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="rounded p-1 text-zinc-500 hover:bg-zinc-800"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <input
                  value={newChannel.id}
                  onChange={(e) =>
                    setNewChannel((f) => ({ ...f, id: e.target.value }))
                  }
                  placeholder="Channel ID"
                  className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-300 outline-none focus:border-[#C9A84C]/50"
                />
                <input
                  value={newChannel.name}
                  onChange={(e) =>
                    setNewChannel((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Name"
                  className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-300 outline-none focus:border-[#C9A84C]/50"
                />
                <input
                  value={newChannel.country}
                  onChange={(e) =>
                    setNewChannel((f) => ({ ...f, country: e.target.value }))
                  }
                  placeholder="Country code"
                  className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-300 outline-none focus:border-[#C9A84C]/50"
                />
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <select
                  value={newChannel.type || "hls"}
                  onChange={(e) =>
                    setNewChannel((f) => ({
                      ...f,
                      type: e.target.value as "hls" | "iframe",
                    }))
                  }
                  className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-300 outline-none focus:border-[#C9A84C]/50"
                >
                  <option value="hls">Type: HLS (.m3u8)</option>
                  <option value="iframe">Type: Iframe Embed</option>
                </select>
                <input
                  value={
                    newChannel.type === "iframe"
                      ? newChannel.embedUrl || ""
                      : newChannel.streamUrl || ""
                  }
                  onChange={(e) =>
                    setNewChannel((f) => ({
                      ...f,
                      [f.type === "iframe" ? "embedUrl" : "streamUrl"]:
                        e.target.value,
                    }))
                  }
                  placeholder={
                    newChannel.type === "iframe"
                      ? "https://embed-url.com/stream"
                      : "HLS Stream URL (.m3u8)"
                  }
                  className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-300 outline-none focus:border-[#C9A84C]/50"
                />
                <input
                  value={newChannel.youtubeVideoId || ""}
                  onChange={(e) =>
                    setNewChannel((f) => ({
                      ...f,
                      youtubeVideoId: e.target.value,
                    }))
                  }
                  placeholder="YouTube Video ID (optional)"
                  className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-300 outline-none focus:border-[#C9A84C]/50"
                />
              </div>
              <div className="mt-3 flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs text-zinc-500">
                  <input
                    type="checkbox"
                    checked={newChannel.isDefault || false}
                    onChange={(e) =>
                      setNewChannel((f) => ({
                        ...f,
                        isDefault: e.target.checked,
                      }))
                    }
                    className="rounded border-zinc-800 bg-zinc-900"
                  />
                  Default channel
                </label>
                <button
                  onClick={addChannel}
                  disabled={!newChannel.id || !newChannel.name}
                  className="rounded-lg bg-[#C9A84C] px-4 py-1.5 text-xs font-semibold text-[#0A0E1A] transition-colors hover:bg-[#D4B85A] disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
