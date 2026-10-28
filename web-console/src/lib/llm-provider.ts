// LLM Provider Configuration
// Configure and manage different LLM providers

export interface LLMProvider {
  id: string
  name: string
  apiKey: string
  baseUrl?: string
  models: string[]
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatCompletionOptions {
  model: string
  messages: ChatMessage[]
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

export interface ChatCompletionResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// OpenAI Provider
export class OpenAIProvider {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey: string, baseUrl: string = 'https://api.openai.com/v1') {
    this.apiKey = apiKey
    this.baseUrl = baseUrl
  }

  async chatCompletion(options: ChatCompletionOptions): Promise<ChatCompletionResponse> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: options.model,
        messages: options.messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2048,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    return response.json()
  }

  async *streamChatCompletion(options: ChatCompletionOptions): AsyncGenerator<any> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: options.model,
        messages: options.messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2048,
        stream: true,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      throw new Error('No response body')
    }

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') continue

          try {
            yield JSON.parse(data)
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  }
}

// Anthropic Provider
export class AnthropicProvider {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey: string, baseUrl: string = 'https://api.anthropic.com') {
    this.apiKey = apiKey
    this.baseUrl = baseUrl
  }

  async chatCompletion(options: ChatCompletionOptions): Promise<ChatCompletionResponse> {
    const response = await fetch(`${this.baseUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: options.model,
        messages: options.messages.filter(m => m.role !== 'system'),
        system: options.messages.find(m => m.role === 'system')?.content || '',
        max_tokens: options.maxTokens || 2048,
        temperature: options.temperature || 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`)
    }

    const data = await response.json()

    // Convert Anthropic format to OpenAI format
    return {
      id: data.id,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: data.model,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: data.content[0]?.text || '',
          },
          finish_reason: data.stop_reason,
        },
      ],
      usage: {
        prompt_tokens: data.usage?.input_tokens || 0,
        completion_tokens: data.usage?.output_tokens || 0,
        total_tokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
      },
    }
  }

  async *streamChatCompletion(options: ChatCompletionOptions): AsyncGenerator<any> {
    const response = await fetch(`${this.baseUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: options.model,
        messages: options.messages.filter(m => m.role !== 'system'),
        system: options.messages.find(m => m.role === 'system')?.content || '',
        max_tokens: options.maxTokens || 2048,
        temperature: options.temperature || 0.7,
        stream: true,
      }),
    })

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`)
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      throw new Error('No response body')
    }

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            // Convert Anthropic streaming format to OpenAI format
            if (parsed.type === 'content_block_delta') {
              yield {
                id: `chatcmpl-${Date.now()}`,
                object: 'chat.completion.chunk',
                created: Math.floor(Date.now() / 1000),
                model: options.model,
                choices: [
                  {
                    index: 0,
                    delta: { content: parsed.delta?.text || '' },
                    finish_reason: null,
                  },
                ],
              }
            } else if (parsed.type === 'message_stop') {
              yield {
                id: `chatcmpl-${Date.now()}`,
                object: 'chat.completion.chunk',
                created: Math.floor(Date.now() / 1000),
                model: options.model,
                choices: [
                  {
                    index: 0,
                    delta: {},
                    finish_reason: 'stop',
                  },
                ],
              }
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  }
}

// Provider factory
export function createProvider(provider: string, apiKey: string, baseUrl?: string) {
  switch (provider.toLowerCase()) {
    case 'openai':
      return new OpenAIProvider(apiKey, baseUrl)
    case 'anthropic':
      return new AnthropicProvider(apiKey, baseUrl)
    default:
      throw new Error(`Unknown provider: ${provider}`)
  }
}
