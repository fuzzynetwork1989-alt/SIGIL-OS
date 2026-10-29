import { NextRequest, NextResponse } from 'next/server'
import { LMStudioClient, DEFAULT_LM_STUDIO_CONFIG } from '@/lib/lm-studio'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const action = searchParams.get('action') || 'health'
    const baseUrl = searchParams.get('baseUrl') || DEFAULT_LM_STUDIO_CONFIG.baseUrl
    const apiKey = searchParams.get('apiKey') || undefined

    const client = new LMStudioClient({ baseUrl, apiKey })

    switch (action) {
      case 'health':
        const health = await client.healthCheck()
        return NextResponse.json({ success: true, health })

      case 'models':
        const models = await client.listModels()
        return NextResponse.json({ success: true, models })

      case 'limits':
        const limits = await client.getResourceLimits()
        return NextResponse.json({ success: true, limits })

      case 'available':
        const modelId = searchParams.get('modelId')
        if (!modelId) {
          return NextResponse.json({ error: 'modelId required' }, { status: 400 })
        }
        const available = await client.isModelAvailable(modelId)
        return NextResponse.json({ success: true, available, modelId })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('LM Studio API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, baseUrl, apiKey, modelId } = body

    const client = new LMStudioClient({
      baseUrl: baseUrl || DEFAULT_LM_STUDIO_CONFIG.baseUrl,
      apiKey,
    })

    switch (action) {
      case 'download':
        if (!modelId) {
          return NextResponse.json({ error: 'modelId required' }, { status: 400 })
        }
        const download = await client.downloadModel(modelId)
        return NextResponse.json({ success: true, download })

      case 'progress':
        if (!modelId) {
          return NextResponse.json({ error: 'modelId required' }, { status: 400 })
        }
        const progress = await client.getDownloadProgress(modelId)
        return NextResponse.json({ success: true, progress })

      case 'chat':
        const chat = await client.chatCompletion(body)
        return NextResponse.json({ success: true, chat })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('LM Studio API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
