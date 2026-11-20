import { useState, useEffect } from "react";
import AuthScreen from "./auth/AuthScreen";
import ChatScreen from "./screens/ChatScreen";
import MissionsScreen from "./screens/MissionsScreen";
import MemoryScreen from "./screens/MemoryScreen";
import AvatarScreen from "./screens/AvatarScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { getToken, getStoredUser, getHealth, HealthResponse } from "./lib/api";
import "./app.css";

type Theme = "dark" | "light" | "blue" | "green" | "purple";
type Screen = "chat" | "missions" | "memory" | "avatar" | "settings";

const LS_THEME = "sigil.theme";
const THEMES: Theme[] = ["dark", "light", "blue", "green", "purple"];

function loadTheme(): Theme {
  const t = localStorage.getItem(LS_THEME);
  return THEMES.includes(t as Theme) ? (t as Theme) : "dark";
}

const NAV: { id: Screen; label: string; icon: string }[] = [
  { id: "chat", label: "Chat", icon: "💬" },
  { id: "missions", label: "Missions", icon: "🎯" },
  { id: "memory", label: "Memory", icon: "🧠" },
  { id: "avatar", label: "Avatar", icon: "👤" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

function App() {
  const [authed, setAuthed] = useState(() => Boolean(getToken() && getStoredUser()));
  const [screen, setScreen] = useState<Screen>("chat");
  const [theme, setTheme] = useState<Theme>(loadTheme);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  useEffect(() => {
    if (!authed) return;
    let cancelled = false;
    const poll = async () => {
      try {
        const h = await getHealth();
        if (!cancelled) setHealth(h);
      } catch {
        if (!cancelled) setHealth(null);
      }
    };
    poll();
    const id = setInterval(poll, 15000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [authed]);

  if (!authed) {
    return (
      <div className={`app theme-${theme}`}>
        <AuthScreen onAuthenticated={() => setAuthed(true)} />
      </div>
    );
  }

  const user = getStoredUser();

  return (
    <div className={`app theme-${theme}`}>
      <nav className="sidebar">
        <div className="sidebar-header">
          <div className="logo">SIGIL</div>
          <div className="subtitle">Your AI Companion</div>
        </div>
        <div className="nav-items">
          {NAV.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${screen === item.id ? "active" : ""}`}
              onClick={() => setScreen(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        <div className="sidebar-footer">
          <div className={`connection-status ${health ? "online" : "offline"}`}>
            {health ? "🟢 Kernel connected" : "🔴 Kernel unreachable"}
          </div>
          {health && (
            <div className="api-status">
              v{health.version} · {health.llm_provider}
            </div>
          )}
          {!online && <div className="api-status">Device offline</div>}
          {user && <div className="api-status">{user.email}</div>}
        </div>
      </nav>
      <main className="main-content">
        {screen === "chat" && <ChatScreen />}
        {screen === "missions" && <MissionsScreen />}
        {screen === "memory" && <MemoryScreen />}
        {screen === "avatar" && <AvatarScreen />}
        {screen === "settings" && (
          <SettingsScreen theme={theme} onThemeChange={setTheme} onLogout={() => setAuthed(false)} />
        )}
      </main>
    </div>
  );
}

export default App;
