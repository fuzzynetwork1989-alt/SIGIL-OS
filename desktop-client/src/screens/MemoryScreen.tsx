import { useState, useEffect, useCallback } from "react";
import { MemoryItem, listMemories, createMemory, ApiError } from "../lib/api";

const CATEGORIES = ["episodic", "semantic", "preference", "mission", "fact"];

export default function MemoryScreen() {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("semantic");
  const [importance, setImportance] = useState(0.5);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setMemories(await listMemories());
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load memories");
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setBusy(true);
    try {
      await createMemory(content.trim(), category, importance);
      setContent("");
      setImportance(0.5);
      await refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save memory");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="screen-content">
      <div className="screen-header">
        <h2>Memory</h2>
        <p className="screen-subtitle">What the kernel remembers about you</p>
      </div>

      <form className="memory-form" onSubmit={submit}>
        <textarea
          placeholder="Something worth remembering…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={2}
          required
        />
        <div className="memory-form-row">
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <label className="importance-label">
            Importance
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={importance}
              onChange={(e) => setImportance(parseFloat(e.target.value))}
            />
            <span>{Math.round(importance * 100)}%</span>
          </label>
          <button type="submit" disabled={busy || !content.trim()}>
            {busy ? "Saving…" : "Remember"}
          </button>
        </div>
      </form>

      {error && <div className="inline-error">{error}</div>}

      <div className="memory-grid">
        {memories.map((m) => (
          <div key={m.id} className="memory-card">
            <div className="memory-type">{m.category}</div>
            <div className="memory-content">{m.content}</div>
            <div className="memory-footer">
              <span className="memory-importance">
                Importance: {Math.round(m.importance * 100)}%
              </span>
              <span className="memory-time">
                {new Date(m.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
        {memories.length === 0 && !error && (
          <p className="conversation-empty">No memories stored yet.</p>
        )}
      </div>
    </div>
  );
}
