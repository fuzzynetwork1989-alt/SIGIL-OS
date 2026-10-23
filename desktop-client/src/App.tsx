import { useState, useEffect } from "react";

interface HealthResponse {
  status: string;
  version: string;
  timestamp: string;
  superbrain_enabled: boolean;
}

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check API health on mount
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const res = await fetch("http://localhost:8080/health");
      const data = await res.json();
      setHealth(data);
    } catch (error) {
      console.error("Failed to check health:", error);
      setHealth({
        status: "error",
        version: "unknown",
        timestamp: new Date().toISOString(),
        superbrain_enabled: false,
      });
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: message }),
      });
      const data = await res.json();
      setResponse(data.text);
    } catch (error) {
      console.error("Failed to send message:", error);
      setResponse("Error: Could not connect to API server. Make sure the API is running on localhost:8080");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>SIGIL OS Desktop</h1>
        <div className="health-status">
          {health ? (
            <span className={health.status === "ok" ? "status-ok" : "status-error"}>
              API: {health.status} (v{health.version})
            </span>
          ) : (
            <span className="status-loading">Checking API...</span>
          )}
        </div>
      </header>

      <main className="main">
        <div className="chat-container">
          <div className="messages">
            {response && (
              <div className="message">
                <div className="message-content">{response}</div>
              </div>
            )}
          </div>

          <div className="input-area">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
            />
            <button onClick={sendMessage} disabled={loading || !message.trim()}>
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
