import { useState, useEffect } from "react";
import AdvancedChat from "./AdvancedChat";
import CognitiveVisualization from "./CognitiveVisualization";
import "./AdvancedChat.css";
import "./CognitiveVisualization.css";

interface HealthResponse {
  status: string;
  version: string;
  timestamp: string;
  superbrain_enabled: boolean;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Mission {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: "active" | "paused" | "completed";
}

interface Memory {
  id: string;
  content: string;
  type: "episodic" | "semantic" | "mission";
  timestamp: Date;
  importance: number;
}

type Theme = "dark" | "light" | "blue" | "green" | "purple";
type Screen = "chat" | "advanced-chat" | "cognitive-viz" | "avatar" | "missions" | "memory" | "dream-weaving" | "settings" | "onboarding";

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>("onboarding");
  const [theme, setTheme] = useState<Theme>("dark");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Avatar customization state
  const [avatarSettings, setAvatarSettings] = useState({
    faceShape: "default",
    hairStyle: "default",
    eyeColor: "blue",
    skinTone: "medium",
    clothing: "casual",
  });

  // Sample missions
  const [missions] = useState<Mission[]>([
    { id: "1", name: "Learn Python", description: "Complete Python course", progress: 65, status: "active" },
    { id: "2", name: "Build Website", description: "Create personal portfolio", progress: 30, status: "active" },
    { id: "3", name: "Read 12 Books", description: "One book per month", progress: 8, status: "active" },
  ]);

  // Sample memories
  const [memories] = useState<Memory[]>([
    { id: "1", content: "User prefers morning coding sessions", type: "episodic", timestamp: new Date(), importance: 0.9 },
    { id: "2", content: "User is learning Rust programming", type: "semantic", timestamp: new Date(), importance: 0.85 },
    { id: "3", content: "Website project deadline is next month", type: "mission", timestamp: new Date(), importance: 0.95 },
  ]);

  useEffect(() => {
    checkHealth();
    window.addEventListener("online", () => setIsOnline(true));
    window.addEventListener("offline", () => setIsOnline(false));
    return () => {
      window.removeEventListener("online", () => setIsOnline(true));
      window.removeEventListener("offline", () => setIsOnline(false));
    };
  }, []);

  const checkHealth = async () => {
    try {
      const res = await fetch("http://localhost:8080/health");
      const data = await res.json();
      setHealth(data);
    } catch (error) {
      console.error("Failed to check health:", error);
      setHealth({
        status: "offline",
        version: "unknown",
        timestamp: new Date().toISOString(),
        superbrain_enabled: false,
      });
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userMessage.content }),
      });
      const data = await res.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.text || "I'm sorry, I couldn't process that right now.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: isOnline 
          ? "I'm having trouble connecting to my brain right now. Please make sure the SIGIL OS backend is running."
          : "You appear to be offline. Some features may be limited, but I can still help with basic tasks.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = () => {
    setShowOnboarding(false);
    setCurrentScreen("chat");
  };

  const renderNavigation = () => (
    <nav className="sidebar">
      <div className="sidebar-header">
        <div className="logo">SIGIL</div>
        <div className="subtitle">Your AI Companion</div>
      </div>
      <div className="nav-items">
        <button
          className={`nav-item ${currentScreen === "chat" ? "active" : ""}`}
          onClick={() => setCurrentScreen("chat")}
        >
          <span className="nav-icon">💬</span>
          <span>Classic Chat</span>
        </button>
        <button
          className={`nav-item ${currentScreen === "advanced-chat" ? "active" : ""}`}
          onClick={() => setCurrentScreen("advanced-chat")}
        >
          <span className="nav-icon">🧠</span>
          <span>Advanced AI</span>
        </button>
        <button
          className={`nav-item ${currentScreen === "cognitive-viz" ? "active" : ""}`}
          onClick={() => setCurrentScreen("cognitive-viz")}
        >
          <span className="nav-icon">🔮</span>
          <span>Neural Flow</span>
        </button>
        <button
          className={`nav-item ${currentScreen === "avatar" ? "active" : ""}`}
          onClick={() => setCurrentScreen("avatar")}
        >
          <span className="nav-icon">👤</span>
          <span>Avatar</span>
        </button>
        <button
          className={`nav-item ${currentScreen === "missions" ? "active" : ""}`}
          onClick={() => setCurrentScreen("missions")}
        >
          <span className="nav-icon">🎯</span>
          <span>Missions</span>
        </button>
        <button
          className={`nav-item ${currentScreen === "memory" ? "active" : ""}`}
          onClick={() => setCurrentScreen("memory")}
        >
          <span className="nav-icon">🧠</span>
          <span>Memory</span>
        </button>
        <button
          className={`nav-item ${currentScreen === "dream-weaving" ? "active" : ""}`}
          onClick={() => setCurrentScreen("dream-weaving")}
        >
          <span className="nav-icon">✨</span>
          <span>Dream Weaving</span>
        </button>
        <button
          className={`nav-item ${currentScreen === "settings" ? "active" : ""}`}
          onClick={() => setCurrentScreen("settings")}
        >
          <span className="nav-icon">⚙️</span>
          <span>Settings</span>
        </button>
      </div>
      <div className="sidebar-footer">
        <div className={`connection-status ${isOnline ? "online" : "offline"}`}>
          {isOnline ? "🟢 Online" : "🔴 Offline"}
        </div>
        {health && (
          <div className="api-status">
            API: {health.status}
          </div>
        )}
      </div>
    </nav>
  );

  const renderOnboarding = () => (
    <div className="onboarding-screen">
      <div className="onboarding-content">
        <div className="onboarding-logo">SIGIL OS</div>
        <h1>Welcome to Your AI Companion</h1>
        <p className="onboarding-subtitle">
          A persistent AI that remembers, learns, and evolves with you
        </p>
        
        <div className="onboarding-features">
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>Long-term Memory</h3>
            <p>I remember our conversations, your preferences, and your goals</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Mission Tracking</h3>
            <p>Track your projects and goals with intelligent assistance</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✨</div>
            <h3>Dream Weaving</h3>
            <p>Self-evolving intelligence that adapts to your needs</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Privacy First</h3>
            <p>Your data stays local by default. Your privacy matters.</p>
          </div>
        </div>

        <button className="onboarding-button" onClick={completeOnboarding}>
          Get Started
        </button>
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="screen-content">
      <div className="screen-header">
        <h2>Chat</h2>
        <p className="screen-subtitle">Conversations with your AI companion</p>
      </div>
      <div className="chat-layout">
        <div className="avatar-display">
          <div className="avatar-placeholder">
            <div className="avatar-face">
              <div className="avatar-eyes">
                <div className="eye"></div>
                <div className="eye"></div>
              </div>
              <div className="avatar-mouth"></div>
            </div>
          </div>
          <div className="avatar-status">Ready to chat</div>
        </div>
        <div className="chat-area">
          <div className="messages-container">
            {messages.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">💬</div>
                <h3>Start a conversation</h3>
                <p>Ask me anything! I'm here to help with tasks, answer questions, or just chat.</p>
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.role}`}>
                <div className="message-content">{msg.content}</div>
                <div className="message-time">
                  {msg.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
            {loading && (
              <div className="message assistant">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="input-container">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
            />
            <button onClick={sendMessage} disabled={loading || !inputMessage.trim()}>
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAvatar = () => (
    <div className="screen-content">
      <div className="screen-header">
        <h2>Avatar Customization</h2>
        <p className="screen-subtitle">Personalize your AI companion's appearance</p>
      </div>
      <div className="avatar-customization">
        <div className="avatar-preview">
          <div className="avatar-large">
            <div className="avatar-face-large">
              <div className="avatar-eyes-large">
                <div className="eye-large" style={{ backgroundColor: avatarSettings.eyeColor }}></div>
                <div className="eye-large" style={{ backgroundColor: avatarSettings.eyeColor }}></div>
              </div>
              <div className="avatar-mouth-large"></div>
            </div>
          </div>
        </div>
        <div className="avatar-controls">
          <div className="control-group">
            <label>Face Shape</label>
            <select
              value={avatarSettings.faceShape}
              onChange={(e) => setAvatarSettings({ ...avatarSettings, faceShape: e.target.value })}
            >
              <option value="default">Default</option>
              <option value="round">Round</option>
              <option value="oval">Oval</option>
              <option value="square">Square</option>
            </select>
          </div>
          <div className="control-group">
            <label>Hair Style</label>
            <select
              value={avatarSettings.hairStyle}
              onChange={(e) => setAvatarSettings({ ...avatarSettings, hairStyle: e.target.value })}
            >
              <option value="default">Default</option>
              <option value="short">Short</option>
              <option value="long">Long</option>
              <option value="curly">Curly</option>
            </select>
          </div>
          <div className="control-group">
            <label>Eye Color</label>
            <select
              value={avatarSettings.eyeColor}
              onChange={(e) => setAvatarSettings({ ...avatarSettings, eyeColor: e.target.value })}
            >
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="brown">Brown</option>
              <option value="hazel">Hazel</option>
            </select>
          </div>
          <div className="control-group">
            <label>Skin Tone</label>
            <select
              value={avatarSettings.skinTone}
              onChange={(e) => setAvatarSettings({ ...avatarSettings, skinTone: e.target.value })}
            >
              <option value="light">Light</option>
              <option value="medium">Medium</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div className="control-group">
            <label>Clothing</label>
            <select
              value={avatarSettings.clothing}
              onChange={(e) => setAvatarSettings({ ...avatarSettings, clothing: e.target.value })}
            >
              <option value="casual">Casual</option>
              <option value="formal">Formal</option>
              <option value="professional">Professional</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMissions = () => (
    <div className="screen-content">
      <div className="screen-header">
        <h2>Missions</h2>
        <p className="screen-subtitle">Track your long-term projects and goals</p>
      </div>
      <div className="missions-list">
        {missions.map((mission) => (
          <div key={mission.id} className="mission-card">
            <div className="mission-header">
              <h3>{mission.name}</h3>
              <span className={`mission-status ${mission.status}`}>{mission.status}</span>
            </div>
            <p className="mission-description">{mission.description}</p>
            <div className="mission-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${mission.progress}%` }}></div>
              </div>
              <span className="progress-text">{mission.progress}%</span>
            </div>
          </div>
        ))}
        <button className="add-mission-button">+ Add New Mission</button>
      </div>
    </div>
  );

  const renderMemory = () => (
    <div className="screen-content">
      <div className="screen-header">
        <h2>Memory</h2>
        <p className="screen-subtitle">What I remember about you</p>
      </div>
      <div className="memory-grid">
        {memories.map((memory) => (
          <div key={memory.id} className="memory-card">
            <div className="memory-type">{memory.type}</div>
            <div className="memory-content">{memory.content}</div>
            <div className="memory-footer">
              <span className="memory-importance">Importance: {Math.round(memory.importance * 100)}%</span>
              <span className="memory-time">{memory.timestamp.toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDreamWeaving = () => (
    <div className="screen-content">
      <div className="screen-header">
        <h2>Dream Weaving™</h2>
        <p className="screen-subtitle">Self-evolving cognitive system</p>
      </div>
      <div className="dream-weaving-dashboard">
        <div className="dream-stats">
          <div className="stat-card">
            <div className="stat-value">127</div>
            <div className="stat-label">Dream Cycles</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">847</div>
            <div className="stat-label">Insights Generated</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">23</div>
            <div className="stat-label">Evolutionary Steps</div>
          </div>
        </div>
        <div className="dream-history">
          <h3>Recent Evolution</h3>
          <div className="evolution-timeline">
            <div className="evolution-item">
              <div className="evolution-date">Today</div>
              <div className="evolution-change">Improved conversation flow based on user feedback</div>
            </div>
            <div className="evolution-item">
              <div className="evolution-date">Yesterday</div>
              <div className="evolution-change">Added memory of user's preference for morning work</div>
            </div>
            <div className="evolution-item">
              <div className="evolution-date">3 days ago</div>
              <div className="evolution-change">Enhanced mission tracking capabilities</div>
            </div>
          </div>
        </div>
        <div className="dream-controls">
          <button className="dream-button">View Full History</button>
          <button className="dream-button">Configure Safeguards</button>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="screen-content">
      <div className="screen-header">
        <h2>Settings</h2>
        <p className="screen-subtitle">Customize your SIGIL OS experience</p>
      </div>
      <div className="settings-container">
        <div className="settings-section">
          <h3>Appearance</h3>
          <div className="setting-item">
            <label>Theme</label>
            <div className="theme-selector">
              {(["dark", "light", "blue", "green", "purple"] as Theme[]).map((t) => (
                <button
                  key={t}
                  className={`theme-button ${theme === t ? "active" : ""}`}
                  onClick={() => setTheme(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="settings-section">
          <h3>Privacy</h3>
          <div className="setting-item">
            <label>Local Data Storage</label>
            <input type="checkbox" defaultChecked />
            <span className="setting-description">Keep all data stored locally on your device</span>
          </div>
          <div className="setting-item">
            <label>Telemetry</label>
            <input type="checkbox" />
            <span className="setting-description">Send anonymous usage data to improve SIGIL OS</span>
          </div>
        </div>
        <div className="settings-section">
          <h3>Connection</h3>
          <div className="setting-item">
            <label>API Server</label>
            <input type="text" defaultValue="http://localhost:8080" />
          </div>
        </div>
        <div className="settings-section">
          <h3>About</h3>
          <div className="about-info">
            <p><strong>SIGIL OS</strong> v0.1.0</p>
            <p>Your AI Companion with Self-Evolving Intelligence</p>
            <p>© 2026 SIGIL OS Project</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (showOnboarding) {
    return <div className={`app theme-${theme}`}>{renderOnboarding()}</div>;
  }

  return (
    <div className={`app theme-${theme}`}>
      {renderNavigation()}
      <main className="main-content">
        {currentScreen === "chat" && renderChat()}
        {currentScreen === "advanced-chat" && <AdvancedChat />}
        {currentScreen === "cognitive-viz" && <CognitiveVisualization />}
        {currentScreen === "avatar" && renderAvatar()}
        {currentScreen === "missions" && renderMissions()}
        {currentScreen === "memory" && renderMemory()}
        {currentScreen === "dream-weaving" && renderDreamWeaving()}
        {currentScreen === "settings" && renderSettings()}
      </main>
    </div>
  );
}

export default App;
