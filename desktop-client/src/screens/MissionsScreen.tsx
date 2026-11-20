import { useState, useEffect, useCallback } from "react";
import { Mission, listMissions, createMission, ApiError } from "../lib/api";

export default function MissionsScreen() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setMissions(await listMissions());
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load missions");
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    try {
      await createMission(name.trim(), description.trim());
      setName("");
      setDescription("");
      await refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create mission");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="screen-content">
      <div className="screen-header">
        <h2>Missions</h2>
        <p className="screen-subtitle">Long-term projects tracked on the SIGIL kernel</p>
      </div>

      <form className="mission-form" onSubmit={submit}>
        <input
          type="text"
          placeholder="Mission name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit" disabled={busy || !name.trim()}>
          {busy ? "Adding…" : "Add mission"}
        </button>
      </form>

      {error && <div className="inline-error">{error}</div>}

      <div className="missions-list">
        {missions.map((m) => (
          <div key={m.id} className="mission-card">
            <div className="mission-header">
              <h3>{m.name}</h3>
              <span className={`mission-status ${m.status}`}>{m.status}</span>
            </div>
            {m.description && <p className="mission-description">{m.description}</p>}
            <div className="mission-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${Math.min(100, Math.max(0, m.progress))}%` }}
                ></div>
              </div>
              <span className="progress-text">{Math.round(m.progress)}%</span>
            </div>
          </div>
        ))}
        {missions.length === 0 && !error && (
          <p className="conversation-empty">No missions yet — add your first above.</p>
        )}
      </div>
    </div>
  );
}
