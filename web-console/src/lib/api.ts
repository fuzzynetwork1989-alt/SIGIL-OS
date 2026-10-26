// NEXORA Omega API Client
// Typed API client for communicating with NEXORA Omega backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export class NexoraAPI {
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

  // Cognitive Processes
  async getCognitiveProcesses(): Promise<any[]> {
    return this.request('/cognitive-processes')
  }

  async createCognitiveProcess(data: any): Promise<any> {
    return this.request('/cognitive-processes', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async pauseCognitiveProcess(processId: string): Promise<void> {
    return this.request(`/cognitive-processes/${processId}/pause`, {
      method: 'POST',
    })
  }

  async resumeCognitiveProcess(processId: string): Promise<void> {
    return this.request(`/cognitive-processes/${processId}/resume`, {
      method: 'POST',
    })
  }

  async cancelCognitiveProcess(processId: string): Promise<void> {
    return this.request(`/cognitive-processes/${processId}/cancel`, {
      method: 'POST',
    })
  }

  // Memory
  async getMemories(): Promise<any[]> {
    return this.request('/memory')
  }

  async createMemory(data: any): Promise<any> {
    return this.request('/memory', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async searchMemory(data: { query: string }): Promise<any> {
    return this.request('/memory/search', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Capabilities
  async getCapabilities(): Promise<any[]> {
    return this.request('/capabilities')
  }

  async grantCapability(data: any): Promise<any> {
    return this.request('/capabilities', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Workspaces
  async getWorkspaces(): Promise<any[]> {
    return this.request('/workspaces')
  }

  async createWorkspace(data: { name: string }): Promise<any> {
    return this.request('/workspaces', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Model Gateway
  async generateText(data: any): Promise<any> {
    return this.request('/model/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}

export const api = new NexoraAPI()