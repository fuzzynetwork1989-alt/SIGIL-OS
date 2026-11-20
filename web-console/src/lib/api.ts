// SIGIL OS API client — talks to the cognitive kernel (sigil-core).
// Base URL: NEXT_PUBLIC_API_URL or http://localhost:8000

const API_URL_KEY = 'sigil.apiUrl'
const DEFAULT_API_URL = 'http://localhost:8000'

function apiUrl(): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(API_URL_KEY)
    if (stored) return stored.replace(/\/+$/, '')
  }
  const env = process.env.NEXT_PUBLIC_API_URL
  return (env || DEFAULT_API_URL).replace(/\/+$/, '')
}

const TOKEN_KEY = 'sigil.token'
const USER_KEY = 'sigil.user'

export interface SigilUser {
  id: string
  email: string
  full_name: string | null
  created_at: string
  is_active: boolean
  subscription_tier: string
}

export interface Conversation {
  id: string
  title: string | null
  model: string
  xp_earned: number
  created_at: string
  updated_at: string
}

export interface MemoryItem {
  id: string
  content: string
  category: string
  importance: number
  metadata: Record<string, unknown>
  created_at: string
}

export interface Mission {
  id: string
  name: string
  description: string
  status: string
  progress: number
  created_at?: string
  updated_at?: string
}

export interface HealthResponse {
  status: string
  timestamp: string
  version: string
  llm_provider: string
  database: string
  services: Record<string, string>
}

export interface UsageSummary {
  period_days: number
  total_tokens: number
  by_model: { model: string; tokens: number; requests: number }[]
  tier: string
  monthly_token_limit: number | null
  percent_used: number
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser(): SigilUser | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as SigilUser
  } catch {
    return null
  }
}

export function setSession(accessToken: string, user: SigilUser) {
  localStorage.setItem(TOKEN_KEY, accessToken)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function isAuthenticated(): boolean {
  return Boolean(getToken() && getStoredUser())
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = true
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  }
  if (auth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${apiUrl()}${path}`, { ...options, headers })
  if (res.status === 204) return undefined as T
  const text = await res.text()
  const body = text ? JSON.parse(text) : null
  if (!res.ok) {
    const detail =
      body && typeof body === 'object' && 'detail' in body
        ? String((body as { detail: unknown }).detail)
        : `Request failed (${res.status})`
    throw new Error(detail)
  }
  return body as T
}

export const api = {
  // Health
  health: () => request<HealthResponse>('/health', {}, false),

  // Auth — backend returns { access_token, token_type, user }
  async login(email: string, password: string) {
    const res = await request<{ access_token: string; user: SigilUser }>(
      '/api/v1/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) },
      false
    )
    setSession(res.access_token, res.user)
    return res.user
  },

  async register(email: string, password: string, fullName?: string) {
    const res = await request<{ access_token: string; user: SigilUser }>(
      '/api/v1/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ email, password, full_name: fullName || null }),
      },
      false
    )
    setSession(res.access_token, res.user)
    return res.user
  },

  me: () => request<SigilUser>('/api/v1/auth/me'),
  logout: () => {
    clearSession()
  },

  // Conversations
  listConversations: () => request<Conversation[]>('/api/v1/conversations'),
  createConversation: (title?: string) =>
    request<Conversation>('/api/v1/conversations', {
      method: 'POST',
      body: JSON.stringify({ title: title ?? null }),
    }),
  deleteConversation: (id: string) =>
    request<void>(`/api/v1/conversations/${id}`, { method: 'DELETE' }),

  // Memory
  listMemories: (category?: string) =>
    request<MemoryItem[]>(
      `/api/v1/memory${category ? `?category=${encodeURIComponent(category)}` : ''}`
    ),
  createMemory: (content: string, category: string, importance = 0.5) =>
    request<MemoryItem>('/api/v1/memory', {
      method: 'POST',
      body: JSON.stringify({ content, category, importance }),
    }),

  // Missions
  listMissions: () => request<Mission[]>('/api/v1/missions'),
  createMission: (name: string, description: string, progress = 0) =>
    request<Mission>('/api/v1/missions', {
      method: 'POST',
      body: JSON.stringify({ name, description, status: 'active', progress }),
    }),

  // Billing / usage
  getUsage: () => request<UsageSummary>('/api/v1/billing/usage'),
  getSubscription: () =>
    request<{
      tier: string
      tier_info: Record<string, unknown> | null
      stripe_customer_id: string | null
      stripe_subscription_id: string | null
    }>('/api/v1/billing/subscription'),

  // Models
  listModels: () =>
    request<{ object: string; data: { id: string }[] }>('/api/v1/models', {}, false),
}
