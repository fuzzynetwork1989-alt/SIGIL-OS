// Typed client for the SIGIL OS cognitive kernel API.
// All data shown in the UI comes from these endpoints — no mock data.

const DEFAULT_API_URL = "http://localhost:8000";
const LS_API_URL = "sigil.apiUrl";
const LS_TOKEN = "sigil.token";
const LS_USER = "sigil.user";

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  is_active: boolean;
  subscription_tier: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Conversation {
  id: string;
  title: string | null;
  model: string;
  xp_earned: number;
  created_at: string;
  updated_at: string;
}

export interface ConversationMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  tokens_used: number | null;
  xp_gained: number;
  cognitive_insight: string | null;
  confidence: number | null;
  created_at: string;
}

export interface ConversationDetail extends Conversation {
  messages: ConversationMessage[];
}

export interface MemoryItem {
  id: string;
  content: string;
  category: string;
  importance: number;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  created_at?: string;
  updated_at?: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
  llm_provider: string;
  database: "connected" | "unavailable" | string;
  services: Record<string, string>;
}

export interface UsageSummary {
  total_tokens: number;
  event_count: number;
  tier: string;
  monthly_token_limit: number | null;
  percent_used: number;
}

export interface BillingTier {
  id: string;
  name?: string;
  price?: number;
  monthly_token_limit?: number | null;
  features?: string[];
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function getApiUrl(): string {
  return (localStorage.getItem(LS_API_URL) || DEFAULT_API_URL).replace(/\/+$/, "");
}

export function setApiUrl(url: string) {
  localStorage.setItem(LS_API_URL, url.replace(/\/+$/, ""));
}

export function getToken(): string | null {
  return localStorage.getItem(LS_TOKEN);
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(LS_USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function setSession(token: AuthToken) {
  localStorage.setItem(LS_TOKEN, token.access_token);
  localStorage.setItem(LS_USER, JSON.stringify(token.user));
}

export function clearSession() {
  localStorage.removeItem(LS_TOKEN);
  localStorage.removeItem(LS_USER);
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = true,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${getApiUrl()}${path}`, { ...options, headers });

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  const body = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const detail =
      body && typeof body === "object" && "detail" in body
        ? String((body as { detail: unknown }).detail)
        : `Request failed (${res.status})`;
    throw new ApiError(res.status, detail);
  }
  return body as T;
}

// ---- Health / readiness ----

export function getHealth(): Promise<HealthResponse> {
  return request<HealthResponse>("/health", {}, false);
}

// ---- Auth ----

export function register(email: string, password: string, fullName?: string): Promise<AuthToken> {
  return request<AuthToken>(
    "/api/v1/auth/register",
    { method: "POST", body: JSON.stringify({ email, password, full_name: fullName || null }) },
    false,
  );
}

export function login(email: string, password: string): Promise<AuthToken> {
  return request<AuthToken>(
    "/api/v1/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }) },
    false,
  );
}

export function getMe(): Promise<User> {
  return request<User>("/api/v1/auth/me");
}

// ---- Conversations ----

export function listConversations(): Promise<Conversation[]> {
  return request<Conversation[]>("/api/v1/conversations");
}

export function createConversation(title?: string, model = "sigil-companion"): Promise<Conversation> {
  return request<Conversation>("/api/v1/conversations", {
    method: "POST",
    body: JSON.stringify({ title: title ?? null, model }),
  });
}

export function getConversation(id: string): Promise<ConversationDetail> {
  return request<ConversationDetail>(`/api/v1/conversations/${id}`);
}

export function renameConversation(id: string, title: string): Promise<Conversation> {
  return request<Conversation>(`/api/v1/conversations/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ title }),
  });
}

export function deleteConversation(id: string): Promise<void> {
  return request<void>(`/api/v1/conversations/${id}`, { method: "DELETE" });
}

export function addMessage(
  conversationId: string,
  role: "user" | "assistant" | "system",
  content: string,
  extra?: { tokens_used?: number; xp_gained?: number; cognitive_insight?: string; confidence?: number },
): Promise<ConversationMessage> {
  return request<ConversationMessage>(`/api/v1/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({ role, content, ...(extra ?? {}) }),
  });
}

// ---- Chat completions (OpenAI-compatible, optional SSE streaming) ----

export interface ChatCompletionChoice {
  index: number;
  message?: { role: string; content: string };
  delta?: { role?: string; content?: string };
  finish_reason: string | null;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: ChatCompletionChoice[];
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}

export async function chatCompletion(
  messages: { role: string; content: string }[],
  opts: {
    model?: string;
    conversationId?: string;
    temperature?: number;
    maxTokens?: number;
    onToken?: (token: string) => void;
  } = {},
): Promise<ChatCompletionResponse> {
  const token = getToken();
  const res = await fetch(`${getApiUrl()}/api/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      messages,
      model: opts.model ?? "sigil-companion",
      temperature: opts.temperature ?? 0.7,
      max_tokens: opts.maxTokens ?? 2048,
      stream: Boolean(opts.onToken),
      conversation_id: opts.conversationId ?? null,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    let detail = `Request failed (${res.status})`;
    try {
      const body = JSON.parse(text);
      if (body?.detail) detail = String(body.detail);
    } catch { /* non-JSON error body */ }
    throw new ApiError(res.status, detail);
  }

  const contentType = res.headers.get("content-type") || "";

  if (opts.onToken && contentType.includes("text/event-stream")) {
    const reader = res.body?.getReader();
    if (!reader) throw new ApiError(500, "Streaming response had no body");
    const decoder = new TextDecoder();
    let buffer = "";
    let full = "";
    let responseId = "";
    let model = opts.model ?? "sigil-companion";
    let finishReason: string | null = null;

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";
      for (const evt of events) {
        const dataLine = evt.split("\n").find((l) => l.startsWith("data:"));
        if (!dataLine) continue;
        const data = dataLine.slice(5).trim();
        if (data === "[DONE]") continue;
        try {
          const chunk = JSON.parse(data) as {
            id?: string;
            model?: string;
            choices?: { delta?: { content?: string }; finish_reason?: string | null }[];
          };
          if (chunk.id) responseId = chunk.id;
          if (chunk.model) model = chunk.model;
          const choice = chunk.choices?.[0];
          const delta = choice?.delta?.content ?? "";
          if (delta) {
            full += delta;
            opts.onToken(delta);
          }
          if (choice?.finish_reason) finishReason = choice.finish_reason;
        } catch { /* partial JSON chunk */ }
      }
    }

    return {
      id: responseId,
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model,
      choices: [{ index: 0, message: { role: "assistant", content: full }, finish_reason: finishReason }],
    };
  }

  return (await res.json()) as ChatCompletionResponse;
}

// ---- Memory ----

export function listMemories(category?: string): Promise<MemoryItem[]> {
  const qs = category ? `?category=${encodeURIComponent(category)}` : "";
  return request<MemoryItem[]>(`/api/v1/memory${qs}`);
}

export function createMemory(content: string, category: string, importance = 0.5): Promise<MemoryItem> {
  return request<MemoryItem>("/api/v1/memory", {
    method: "POST",
    body: JSON.stringify({ content, category, importance }),
  });
}

// ---- Missions ----

export function listMissions(): Promise<Mission[]> {
  return request<Mission[]>("/api/v1/missions");
}

export function createMission(name: string, description: string): Promise<Mission> {
  return request<Mission>("/api/v1/missions", {
    method: "POST",
    body: JSON.stringify({ name, description, status: "active", progress: 0 }),
  });
}

// ---- Billing / usage ----

export function getUsage(): Promise<UsageSummary> {
  return request<UsageSummary>("/api/v1/billing/usage");
}

export function getSubscription(): Promise<{
  tier: string;
  tier_info: BillingTier | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
}> {
  return request("/api/v1/billing/subscription");
}

export function listTiers(): Promise<{ tiers: BillingTier[]; stripe_configured: boolean }> {
  return request("/api/v1/billing/tiers", {}, false);
}
