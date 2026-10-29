// LM Studio Integration
// Manages local model deployment via LM Studio

export interface LMStudioConfig {
  baseUrl: string
  apiKey?: string
}

export interface LMStudioModel {
  id: string
  name: string
  size: number
  quantization: string
  downloaded: boolean
  parameters: number
  context_length: number
}

export interface LMStudioHealth {
  status: 'healthy' | 'unhealthy' | 'unknown'
  version: string
  memory: {
    total: number
    used: number
    available: number
  }
  gpu: {
    available: boolean
    name: string
    memory: number
  }
}

export interface LMStudioDownloadProgress {
  modelId: string
  progress: number
  speed: number
  eta: number
  status: 'downloading' | 'completed' | 'failed'
}

export class LMStudioClient {
  private config: LMStudioConfig

  constructor(config: LMStudioConfig) {
    this.config = config
  }

  // Health check
  async healthCheck(): Promise<LMStudioHealth> {
    try {
      const response = await fetch(`${this.config.baseUrl}/v1/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
        },
      })

      if (!response.ok) {
        return {
          status: 'unhealthy',
          version: 'unknown',
          memory: { total: 0, used: 0, available: 0 },
          gpu: { available: false, name: 'unknown', memory: 0 },
        }
      }

      const data = await response.json()
      return {
        status: 'healthy',
        version: data.version || 'unknown',
        memory: data.memory || { total: 0, used: 0, available: 0 },
        gpu: data.gpu || { available: false, name: 'unknown', memory: 0 },
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        version: 'unknown',
        memory: { total: 0, used: 0, available: 0 },
        gpu: { available: false, name: 'unknown', memory: 0 },
      }
    }
  }

  // Model discovery
  async listModels(): Promise<LMStudioModel[]> {
    try {
      const response = await fetch(`${this.config.baseUrl}/v1/models`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
        },
      })

      if (!response.ok) {
        return []
      }

      const data = await response.json()
      return data.data || []
    } catch (error) {
      console.error('LM Studio model list error:', error)
      return []
    }
  }

  // Download model
  async downloadModel(modelId: string): Promise<LMStudioDownloadProgress> {
    try {
      const response = await fetch(`${this.config.baseUrl}/v1/models/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
        },
        body: JSON.stringify({ model: modelId }),
      })

      if (!response.ok) {
        throw new Error('Download request failed')
      }

      const data = await response.json()
      return {
        modelId,
        progress: data.progress || 0,
        speed: data.speed || 0,
        eta: data.eta || 0,
        status: 'downloading',
      }
    } catch (error) {
      console.error('LM Studio download error:', error)
      return {
        modelId,
        progress: 0,
        speed: 0,
        eta: 0,
        status: 'failed',
      }
    }
  }

  // Get download progress
  async getDownloadProgress(modelId: string): Promise<LMStudioDownloadProgress> {
    try {
      const response = await fetch(`${this.config.baseUrl}/v1/models/download/${modelId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
        },
      })

      if (!response.ok) {
        throw new Error('Progress check failed')
      }

      const data = await response.json()
      return {
        modelId,
        progress: data.progress || 0,
        speed: data.speed || 0,
        eta: data.eta || 0,
        status: data.status || 'downloading',
      }
    } catch (error) {
      console.error('LM Studio progress check error:', error)
      return {
        modelId,
        progress: 0,
        speed: 0,
        eta: 0,
        status: 'failed',
      }
    }
  }

  // Check model availability
  async isModelAvailable(modelId: string): Promise<boolean> {
    const models = await this.listModels()
    return models.some(m => m.id === modelId && m.downloaded)
  }

  // Get resource limits
  async getResourceLimits(): Promise<{
    maxMemory: number
    maxContext: number
    maxBatchSize: number
  }> {
    try {
      const response = await fetch(`${this.config.baseUrl}/v1/limits`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
        },
      })

      if (!response.ok) {
        return {
          maxMemory: 0,
          maxContext: 0,
          maxBatchSize: 0,
        }
      }

      const data = await response.json()
      return {
        maxMemory: data.maxMemory || 0,
        maxContext: data.maxContext || 0,
        maxBatchSize: data.maxBatchSize || 0,
      }
    } catch (error) {
      return {
        maxMemory: 0,
        maxContext: 0,
        maxBatchSize: 0,
      }
    }
  }

  // Chat completion (OpenAI-compatible)
  async chatCompletion(data: {
    model: string
    messages: Array<{ role: string; content: string }>
    temperature?: number
    max_tokens?: number
    stream?: boolean
  }): Promise<any> {
    const response = await fetch(`${this.config.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`LM Studio API error: ${response.status}`)
    }

    return response.json()
  }
}

// Default LM Studio configuration
export const DEFAULT_LM_STUDIO_CONFIG: LMStudioConfig = {
  baseUrl: 'http://localhost:1234',
}
