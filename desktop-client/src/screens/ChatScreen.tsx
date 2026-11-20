import { useState, useEffect, useRef, useCallback } from "react";
import {
  Conversation,
  ConversationDetail,
  chatCompletion,
  createConversation,
  deleteConversation,
  getConversation,
  listConversations,
  addMessage,
  ApiError,
} from "../lib/api";

interface UiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  pending?: boolean;
  error?: boolean;
}

export default function ChatScreen() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [chatError, setChatError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const refreshList = useCallback(async () => {
    try {
      setConversations(await listConversations());
      setListError(null);
    } catch (err) {
      setListError(err instanceof ApiError ? err.message : "Failed to load conversations");
    }
  }, []);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openConversation = async (id: string) => {
    setActiveId(id);
    setChatError(null);
    try {
      const detail: ConversationDetail = await getConversation(id);
      setMessages(
        detail.messages
          .filter((m) => m.role === "user" || m.role === "assistant")
          .map((m) => ({ id: m.id, role: m.role as "user" | "assistant", content: m.content })),
      );
    } catch (err) {
      setChatError(err instanceof ApiError ? err.message : "Failed to load conversation");
      setMessages([]);
    }
  };

  const newConversation = async () => {
    try {
      const conv = await createConversation();
      await refreshList();
      setActiveId(conv.id);
      setMessages([]);
      setChatError(null);
    } catch (err) {
      setChatError(err instanceof ApiError ? err.message : "Failed to create conversation");
    }
  };

  const removeConversation = async (id: string) => {
    try {
      await deleteConversation(id);
      if (activeId === id) {
        setActiveId(null);
        setMessages([]);
      }
      await refreshList();
    } catch (err) {
      setChatError(err instanceof ApiError ? err.message : "Failed to delete conversation");
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    let convId = activeId;
    if (!convId) {
      try {
        const conv = await createConversation(text.slice(0, 60));
        convId = conv.id;
        setActiveId(conv.id);
        await refreshList();
      } catch (err) {
        setChatError(err instanceof ApiError ? err.message : "Failed to create conversation");
        return;
      }
    }

    const userMsg: UiMessage = { id: `u-${Date.now()}`, role: "user", content: text };
    const assistantId = `a-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      userMsg,
      { id: assistantId, role: "assistant", content: "", pending: true },
    ]);
    setInput("");
    setLoading(true);
    setChatError(null);

    const history = [
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: text },
    ];

    let streamed = "";
    try {
      const response = await chatCompletion(history, {
        conversationId: convId,
        onToken: (token) => {
          streamed += token;
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: streamed } : m)),
          );
        },
      });

      const assistantContent =
        response.choices[0]?.message?.content ?? streamed;

      // Persist both messages so the conversation survives reloads.
      await addMessage(convId, "user", text);
      await addMessage(convId, "assistant", assistantContent, {
        tokens_used: response.usage?.total_tokens,
      });
      await refreshList();

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: assistantContent, pending: false } : m,
        ),
      );
    } catch (err) {
      const detail = err instanceof ApiError ? err.message : "Request failed";
      setChatError(detail);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, pending: false, error: true, content: `Error: ${detail}` }
            : m,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen-content chat-screen">
      <div className="screen-header">
        <h2>Chat</h2>
        <p className="screen-subtitle">Conversations persisted on the SIGIL kernel</p>
      </div>

      <div className="chat-layout chat-layout-wide">
        <aside className="conversation-list">
          <button className="new-chat-button" onClick={newConversation}>
            + New conversation
          </button>
          {listError && <div className="inline-error">{listError}</div>}
          {conversations.map((c) => (
            <div
              key={c.id}
              className={`conversation-item ${c.id === activeId ? "active" : ""}`}
              onClick={() => openConversation(c.id)}
            >
              <span className="conversation-title">
                {c.title || "Untitled conversation"}
              </span>
              <button
                className="conversation-delete"
                title="Delete conversation"
                onClick={(e) => {
                  e.stopPropagation();
                  removeConversation(c.id);
                }}
              >
                ×
              </button>
            </div>
          ))}
          {!listError && conversations.length === 0 && (
            <p className="conversation-empty">No conversations yet.</p>
          )}
        </aside>

        <div className="chat-area">
          {chatError && <div className="inline-error">{chatError}</div>}
          <div className="messages-container">
            {messages.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">💬</div>
                <h3>{activeId ? "No messages yet" : "Start a conversation"}</h3>
                <p>
                  {activeId
                    ? "Send a message to begin."
                    : "Pick a conversation or start a new one."}
                </p>
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`message ${m.role} ${m.error ? "error" : ""}`}>
                <div className="message-content">
                  {m.content}
                  {m.pending && <span className="typing-cursor">▍</span>}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <div className="input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              onKeyDown={(e) => e.key === "Enter" && send()}
              disabled={loading}
            />
            <button onClick={send} disabled={loading || !input.trim()}>
              {loading ? "…" : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
