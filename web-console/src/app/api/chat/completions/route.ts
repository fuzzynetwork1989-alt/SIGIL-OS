import { NextRequest, NextResponse } from 'next/server'
import { createProvider } from '../../../lib/llm-provider'

// Chat completion API endpoint
// This handles real LLM chat requests with streaming support

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { model, messages, temperature = 0.7, maxTokens = 2048, stream = false } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    // Get API keys from headers (set by client from localStorage)
    const openaiKey = req.headers.get('X-OpenAI-Key') || process.env.OPENAI_API_KEY
    const anthropicKey = req.headers.get('X-Anthropic-Key') || process.env.ANTHROPIC_API_KEY

    // Determine which provider to use based on available keys
    let provider = 'openai'
    let apiKey = openaiKey

    if (!openaiKey && anthropicKey) {
      provider = 'anthropic'
      apiKey = anthropicKey
    } else if (openaiKey && anthropicKey) {
      // Both available, use OpenAI by default
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

    // Map SIGIL model names to actual provider model names
    const modelMapping: Record<string, string> = {
      'sigil-companion': 'gpt-4o-mini',
      'sigil-mission': 'gpt-4o',
      'sigil-world': 'gpt-4-turbo',
      'sigil-spatial': 'gpt-4-turbo',
      'sigil-presence': 'gpt-4o-mini',
      'sigil-research': 'gpt-4',
      'sigil-reasoner': 'gpt-4-turbo',
    }

    const actualModel = modelMapping[model] || model

    // Create provider instance
    const llmProvider = createProvider(provider, apiKey)

    if (stream) {
      // Streaming response
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        async start(controller) {
          try {
            const streamingResponse = llmProvider.streamChatCompletion({
              model: actualModel,
              messages,
              temperature,
              maxTokens,
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
        model: actualModel,
        messages,
        temperature,
        maxTokens,
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
