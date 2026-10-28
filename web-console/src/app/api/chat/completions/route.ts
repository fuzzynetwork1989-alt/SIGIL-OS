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

    // Get provider and API key from settings or environment
    // For now, we'll use environment variables
    const provider = process.env.LLM_PROVIDER || 'openai'
    const apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { 
          error: 'No API key configured',
          message: 'Please configure an API key in settings or environment variables to enable real AI responses.'
        },
        { status: 400 }
      )
    }

    // Create provider instance
    const llmProvider = createProvider(provider, apiKey)

    if (stream) {
      // Streaming response
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        async start(controller) {
          try {
            const streamingResponse = llmProvider.streamChatCompletion({
              model,
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
        model,
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
