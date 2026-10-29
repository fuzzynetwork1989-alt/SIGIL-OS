import { NextRequest, NextResponse } from 'next/server'
import { createProvider } from '../../../lib/llm-provider'
import { getModelfileConfig } from '../../../lib/modelfile'

// Chat completion API endpoint
// This handles real LLM chat requests with streaming support

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { model, messages, temperature, maxTokens, topP, stream = false } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    // Get API keys from headers (set by client from localStorage)
    const openaiKey = req.headers.get('X-OpenAI-Key') || process.env.OPENAI_API_KEY
    const anthropicKey = req.headers.get('X-Anthropic-Key') || process.env.ANTHROPIC_API_KEY
    const huggingfaceKey = req.headers.get('X-HuggingFace-Key') || process.env.HUGGINGFACE_API_KEY

    // Determine which provider to use based on available keys
    let provider = 'openai'
    let apiKey = openaiKey

    if (!openaiKey && anthropicKey) {
      provider = 'anthropic'
      apiKey = anthropicKey
    } else if (!openaiKey && huggingfaceKey) {
      provider = 'huggingface'
      apiKey = huggingfaceKey
    } else if (openaiKey && anthropicKey && huggingfaceKey) {
      // All available, prefer HuggingFace for local models
      provider = 'huggingface'
      apiKey = huggingfaceKey
    } else if (openaiKey && huggingfaceKey) {
      provider = 'huggingface'
      apiKey = huggingfaceKey
    } else if (openaiKey && anthropicKey) {
      provider = 'openai'
      apiKey = openaiKey
    }

    if (!apiKey) {
      return NextResponse.json(
        { 
          error: 'No API key configured',
          message: 'Please configure an API key in Settings → API Keys to enable real AI responses.'
        },
        { status: 400 }
      )
    }

    // Get modelfile configuration for the selected SIGIL model
    let modelfileConfig
    try {
      modelfileConfig = getModelfileConfig(model)
    } catch (error) {
      // If no modelfile, use defaults
      modelfileConfig = {
        model: 'gpt-4o-mini',
        temperature: 0.7,
        maxTokens: 2048,
        topP: 0.9,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0,
        systemPrompt: 'You are a helpful AI assistant.',
      }
    }

    // Use modelfile config if not overridden by request
    const finalTemperature = temperature ?? modelfileConfig.temperature
    const finalMaxTokens = maxTokens ?? modelfileConfig.maxTokens
    const finalTopP = topP ?? modelfileConfig.topP
    const finalModel = modelfileConfig.model

    // Add system prompt if not already present
    const messagesWithSystem = messages.some(m => m.role === 'system')
      ? messages
      : [{ role: 'system', content: modelfileConfig.systemPrompt }, ...messages]

    // Create provider instance
    const llmProvider = createProvider(provider, apiKey)

    if (stream) {
      // Streaming response
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        async start(controller) {
          try {
            const streamingResponse = llmProvider.streamChatCompletion({
              model: finalModel,
              messages: messagesWithSystem,
              temperature: finalTemperature,
              maxTokens: finalMaxTokens,
            })
            
            for await (const chunk of streamingResponse) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`))
            }
            
            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
            controller.close()
          } catch (error) {
            console.error('Streaming error:', error)
            controller.error(error)
          }
        },
      })

      return new NextResponse(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    } else {
      // Non-streaming response
      const response = await llmProvider.chatCompletion({
        model: finalModel,
        messages: messagesWithSystem,
        temperature: finalTemperature,
        maxTokens: finalMaxTokens,
      })
      
      return NextResponse.json(response)
    }
  } catch (error) {
    console.error('Chat completion error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
