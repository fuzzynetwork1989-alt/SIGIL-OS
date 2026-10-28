// SIGIL OS API Client
// Typed API client for communicating with SIGIL OS backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export class SigilAPI {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl
  }

  setToken(token: string) {
    this.token = token
  }

  clearToken() {
    this.token = null
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request('/health')
  }

  // Authentication
  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async register(data: { email: string; password: string; name: string }): Promise<{ token: string; user: any }> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async logout(): Promise<void> {
    return this.request('/auth/logout', { method: 'POST' })
  }

  // Chat Completions
  async createChatCompletion(data: {
    model: string
    messages: Array<{ role: string; content: string }>
    temperature?: number
    maxTokens?: number
    stream?: boolean
  }): Promise<any> {
    return this.request('/api/chat/completions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async streamChatCompletion(data: {
    model: string
    messages: Array<{ role: string; content: string }>
    temperature?: number
    maxTokens?: number
  }): Promise<ReadableStream> {
    const url = `${this.baseUrl}/api/chat/completions`
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...data, stream: true }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    return response.body!
  }

  // Memory
  async getMemories(): Promise<any[]> {
    return this.request('/api/memory')
  }

  async createMemory(data: any): Promise<any> {
    return this.request('/api/memory', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async searchMemory(data: { query: string }): Promise<any> {
    return this.request('/api/memory/search', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Model Info
  async getModels(): Promise<any[]> {
    return this.request('/api/models')
  }

  async getModelInfo(modelId: string): Promise<any> {
    return this.request(`/api/models/${modelId}`)
  }
}

export const api = new SigilAPI()