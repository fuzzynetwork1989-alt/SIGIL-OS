import { useState, useEffect, useCallback } from "react";
import {
  getApiUrl,
  setApiUrl,
  getStoredUser,
  clearSession,
  getHealth,
  HealthResponse,
  getUsage,
  UsageSummary,
  ApiError,
} from "../lib/api";

type Theme = "dark" | "light" | "blue" | "green" | "purple";
const THEMES: Theme[] = ["dark", "light", "blue", "green", "purple"];
const LS_THEME = "sigil.theme";

interface Props {
  theme: Theme;
  onThemeChange: (t: Theme) => void;
  onLogout: () => void;
}

export default function SettingsScreen({ theme, onThemeChange, onLogout }: Props) {
  const [apiUrl, setApiUrlInput] = useState(getApiUrl());
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [usageError, setUsageError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const user = getStoredUser();

  const checkHealth = useCallback(async () => {
    try {
      setHealth(await getHealth());
      setHealthError(null);
    } catch {
      setHealth(null);
      setHealthError(`Cannot reach ${getApiUrl()}/health`);
    }
  }, []);

  const loadUsage = useCallback(async () => {
    try {
      setUsage(await getUsage());
      setUsageError(null);
    } catch (err) {
      setUsage(null);
      setUsageError(err instanceof ApiError ? err.message : "Usage unavailable");
    }
  }, []);

  useEffect(() => {
    checkHealth();
    loadUsage();
  }, [checkHealth, loadUsage]);

  const saveApiUrl = () => {
    setApiUrl(apiUrl);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    checkHealth();
    loadUsage();
  };

  const logout = () => {
    clearSession();
    onLogout();
  };

  return (
    <div className="screen-content">
      <div className="screen-header">
        <h2>Settings</h2>
        <p className="screen-subtitle">Connection, appearance, and account</p>
      </div>

      <div className="settings-container">
        <div className="settings-section">
          <h3>Connection</h3>
          <div className="setting-item">
            <label>API Server</label>
            <div className="api-url-row">
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrlInput(e.target.value)}
                placeholder="http://localhost:8000"
              />
              <button onClick={saveApiUrl}>Save</button>
              {saved && <span className="setting-saved">Saved</span>}
            </div>
          </div>
          <div className="setting-item">
            <label>Server status</label>
            <div className="setting-description">
              {health ? (
                <>
                  Connected — kernel v{health.version}, provider{" "}
                  {health.llm_provider}, database {health.database}
                </>
              ) : (
                <span className="inline-error">{healthError ?? "Checking…"}</span>
              )}
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>Appearance</h3>
          <div className="setting-item">
            <label>Theme</label>
            <div className="theme-selector">
              {THEMES.map((t) => (
                <button
                  key={t}
                  className={`theme-button ${theme === t ? "active" : ""}`}
                  onClick={() => {
                    localStorage.setItem(LS_THEME, t);
                    onThemeChange(t);
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>Account</h3>
          {user && (
            <>
              <div className="setting-item">
                <label>Email</label>
                <div className="setting-description">{user.email}</div>
              </div>
              <div className="setting-item">
                <label>Subscription tier</label>
                <div className="setting-description">{user.subscription_tier}</div>
              </div>
            </>
          )}
          <div className="setting-item">
            <label>Token usage (30 days)</label>
            <div className="setting-description">
              {usage ? (
                <>
                  {usage.total_tokens.toLocaleString()} tokens across{" "}
                  {usage.event_count} requests
                  {usage.monthly_token_limit != null &&
                    ` — ${usage.percent_used}% of ${usage.monthly_token_limit.toLocaleString()} monthly limit`}
                </>
              ) : (
                <span className="inline-error">{usageError ?? "Loading…"}</span>
              )}
            </div>
          </div>
          <div className="setting-item">
            <button className="logout-button" onClick={logout}>
              Sign out
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h3>About</h3>
          <div className="about-info">
            <p>
              <strong>SIGIL OS</strong> desktop client
            </p>
            <p>Connected to the SIGIL cognitive kernel over its HTTP API.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
