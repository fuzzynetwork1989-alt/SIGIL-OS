import { useState, useEffect, useRef } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  cognitiveState?: string;
  memoriesAccessed?: string[];
  confidence?: number;
}

interface CognitiveMetrics {
  contextAssembly: number;
  memoryActivation: number;
  reasoningDepth: number;
  presenceLevel: number;
}

export default function AdvancedChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [cognitiveMetrics, setCognitiveMetrics] = useState<CognitiveMetrics>({
    contextAssembly: 0,
    memoryActivation: 0,
    reasoningDepth: 0,
    presenceLevel: 0,
  });
  const [avatarEmotion, setAvatarEmotion] = useState("neutral");
  const [avatarGaze, setAvatarGaze] = useState({ x: 0, y: 0 });
  const [isListening, setIsListening] = useState(false);
  const [showMemoryVisualization, setShowMemoryVisualization] = useState(false);
  const [showMissionContext, setShowMissionContext] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setAvatarGaze({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
  };

  const simulateCognitiveProcess = async () => {
    setIsThinking(true);
    setAvatarEmotion("thinking");

    // Simulate context assembly
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 50));
      setCognitiveMetrics(prev => ({
        ...prev,
        contextAssembly: i,
        memoryActivation: Math.min(100, i * 0.8),
        reasoningDepth: Math.min(100, i * 0.6),
        presenceLevel: Math.min(100, i * 0.9),
      }));
    }

    await new Promise(r => setTimeout(r, 500));
    setAvatarEmotion("neutral");
    setIsThinking(false);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setAvatarEmotion("thinking");

    await simulateCognitiveProcess();

    const responses = [
      "I understand what you're saying. Let me access my memory to better help you with this.",
      "That's an interesting question. I'm connecting this to your mission about learning new skills.",
      "I recall from our previous conversations that you prefer practical explanations. Let me tailor my response accordingly.",
      "Based on the context of our ongoing project, here's what I think would work best.",
      "I'm analyzing this through multiple cognitive lenses to give you the most comprehensive answer.",
    ];

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date(),
      cognitiveState: "Assembled Cognition",
      memoriesAccessed: ["Recent conversations", "Mission context", "User preferences"],
      confidence: 0.87,
    };

    setMessages(prev => [...prev, assistantMessage]);
    setAvatarEmotion("happy");
    setTimeout(() => setAvatarEmotion("neutral"), 2000);
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice recognition
      setTimeout(() => {
        setInput("Help me understand this better");
        setIsListening(false);
      }, 2000);
    }
  };

  return (
    <div className="advanced-chat-container">
      {/* Cognitive Metrics Dashboard */}
      <div className="cognitive-dashboard">
        <div className="metric-card">
          <div className="metric-label">Context Assembly</div>
          <div className="metric-bar">
            <div 
              className="metric-fill" 
              style={{ width: `${cognitiveMetrics.contextAssembly}%` }}
            />
          </div>
          <div className="metric-value">{cognitiveMetrics.contextAssembly}%</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Memory Activation</div>
          <div className="metric-bar">
            <div 
              className="metric-fill memory" 
              style={{ width: `${cognitiveMetrics.memoryActivation}%` }}
            />
          </div>
          <div className="metric-value">{cognitiveMetrics.memoryActivation}%</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Reasoning Depth</div>
          <div className="metric-bar">
            <div 
              className="metric-fill reasoning" 
              style={{ width: `${cognitiveMetrics.reasoningDepth}%` }}
            />
          </div>
          <div className="metric-value">{cognitiveMetrics.reasoningDepth}%</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Presence Level</div>
          <div className="metric-bar">
            <div 
              className="metric-fill presence" 
              style={{ width: `${cognitiveMetrics.presenceLevel}%` }}
            />
          </div>
          <div className="metric-value">{cognitiveMetrics.presenceLevel}%</div>
        </div>
      </div>

      <div className="chat-layout">
        {/* Advanced Avatar */}
        <div className="avatar-section" onMouseMove={handleMouseMove}>
          <div className="avatar-container">
            <div className={`avatar-base emotion-${avatarEmotion}`}>
              {/* Eyes with gaze tracking */}
              <div className="eyes-container">
                <div 
                  className="eye left-eye"
                  style={{
                    transform: `translate(${avatarGaze.x * 10}px, ${avatarGaze.y * 5}px)`
                  }}
                >
                  <div className="pupil"></div>
                </div>
                <div 
                  className="eye right-eye"
                  style={{
                    transform: `translate(${avatarGaze.x * 10}px, ${avatarGaze.y * 5}px)`
                  }}
                >
                  <div className="pupil"></div>
                </div>
              </div>

              {/* Dynamic mouth based on emotion */}
              <div className={`mouth mouth-${avatarEmotion}`}></div>

              {/* Breathing animation */}
              <div className="breathing-indicator"></div>
            </div>

            {/* Cognitive state indicator */}
            {isThinking && (
              <div className="cognitive-state-indicator">
                <div className="state-text">Assembling Cognition...</div>
                <div className="state-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            {/* Presence glow */}
            <div className="presence-glow"></div>
          </div>

          {/* Avatar controls */}
          <div className="avatar-controls">
            <button
              className={`voice-button ${isListening ? "listening" : ""}`}
              onClick={toggleVoiceInput}
            >
              {isListening ? "🎙️ Listening..." : "🎙️ Voice"}
            </button>
            <button 
              className="context-button"
              onClick={() => setShowMemoryVisualization(!showMemoryVisualization)}
            >
              🧠 Memory
            </button>
            <button 
              className="mission-button"
              onClick={() => setShowMissionContext(!showMissionContext)}
            >
              🎯 Mission
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="messages-section">
          <div className="messages-container">
            {messages.length === 0 && (
              <div className="empty-state-advanced">
                <div className="empty-avatar">🤖</div>
                <h3>I'm ready to help</h3>
                <p>
                  I use persistent context, memory, and mission awareness to provide 
                  more intelligent assistance. Try asking me something!
                </p>
                <div className="suggestion-chips">
                  <button onClick={() => setInput("What can you help me with?")}>
                    What can you do?
                  </button>
                  <button onClick={() => setInput("Help me with my current mission")}>
                    Help with my mission
                  </button>
                  <button onClick={() => setInput("What do you remember about me?")}>
                    What do you remember?
                  </button>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`message-advanced ${msg.role}`}>
                {msg.role === "assistant" && (
                  <div className="message-meta">
                    {msg.cognitiveState && (
                      <span className="cognitive-state">{msg.cognitiveState}</span>
                    )}
                    {msg.confidence && (
                      <span className="confidence">
                        Confidence: {Math.round(msg.confidence * 100)}%
                      </span>
                    )}
                  </div>
                )}
                <div className="message-content-advanced">{msg.content}</div>
                {msg.memoriesAccessed && (
                  <div className="memories-accessed">
                    <span className="memories-label">Memories accessed:</span>
                    {msg.memoriesAccessed.map((mem, i) => (
                      <span key={i} className="memory-tag">{mem}</span>
                    ))}
                  </div>
                )}
                <div className="message-time">
                  {msg.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="message-advanced assistant thinking">
                <div className="thinking-process">
                  <div className="thinking-step">
                    <span className="step-label">Context Assembly</span>
                    <div className="step-progress">
                      <div className="progress-bar-thinking">
                        <div className="progress-fill-thinking" style={{ width: "75%" }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="thinking-step">
                    <span className="step-label">Memory Retrieval</span>
                    <div className="step-progress">
                      <div className="progress-bar-thinking">
                        <div className="progress-fill-thinking" style={{ width: "60%" }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="thinking-step">
                    <span className="step-label">Reasoning</span>
                    <div className="step-progress">
                      <div className="progress-bar-thinking">
                        <div className="progress-fill-thinking" style={{ width: "45%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Advanced Input */}
          <div className="input-section-advanced">
            <div className="input-container-advanced">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message or use voice input..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                rows={1}
                className="message-input-advanced"
              />
              <div className="input-actions">
                <button 
                  className="action-button voice"
                  onClick={toggleVoiceInput}
                  title="Voice input"
                >
                  🎙️
                </button>
                <button 
                  className="action-button send"
                  onClick={sendMessage}
                  disabled={!input.trim() || isThinking}
                  title="Send message"
                >
                  {isThinking ? "⏳" : "➤"}
                </button>
              </div>
            </div>
            <div className="input-footer">
              <span className="footer-text">
                SIGIL OS uses persistent context and memory for more intelligent responses
              </span>
            </div>
          </div>
        </div>

        {/* Context Panel */}
        {(showMemoryVisualization || showMissionContext) && (
          <div className="context-panel">
            {showMemoryVisualization && (
              <div className="context-section">
                <h3>🧠 Active Memory</h3>
                <div className="memory-items">
                  <div className="memory-item">
                    <span className="memory-type">Episodic</span>
                    <span className="memory-text">User prefers morning work sessions</span>
                    <span className="memory-strength">Strong</span>
                  </div>
                  <div className="memory-item">
                    <span className="memory-type">Semantic</span>
                    <span className="memory-text">User is learning Rust programming</span>
                    <span className="memory-strength">Medium</span>
                  </div>
                  <div className="memory-item">
                    <span className="memory-type">Mission</span>
                    <span className="memory-text">Build SIGIL OS project</span>
                    <span className="memory-strength">Strong</span>
                  </div>
                </div>
              </div>
            )}
            {showMissionContext && (
              <div className="context-section">
                <h3>🎯 Active Mission</h3>
                <div className="mission-context">
                  <div className="mission-name">Build SIGIL OS</div>
                  <div className="mission-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: "42%" }}></div>
                    </div>
                    <span className="progress-text">42%</span>
                  </div>
                  <div className="mission-next">Next: Complete desktop client</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
