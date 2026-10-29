import { NextRequest, NextResponse } from 'next/server'
import { loadModelfile } from '@/lib/modelfile'

export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes for music generation

// Simple in-memory job storage (in production, use a database)
const musicJobs = new Map<string, {
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  result?: string
  error?: string
  createdAt: Date
  completedAt?: Date
}>()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { prompt, model = 'sigil-music', duration = 30 } = body

    if (!prompt) {
      return NextResponse.json({ error: 'No prompt provided' }, { status: 400 })
    }

    // Get HuggingFace API key
    const huggingfaceKey = req.headers.get('X-HuggingFace-Key') || process.env.HUGGINGFACE_API_KEY

    if (!huggingfaceKey) {
      return NextResponse.json({ error: 'HuggingFace API key required' }, { status: 401 })
    }

    // Load modelfile configuration
    const modelfile = await loadModelfile(model)
    const baseModel = modelfile.model || 'facebook/musicgen-stereo-large'

    // Create job ID
    const jobId = `music-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Initialize job
    musicJobs.set(jobId, {
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
    })

    // Start music generation asynchronously
    generateMusic(jobId, baseModel, prompt, duration, huggingfaceKey, modelfile).catch(error => {
      console.error('Music generation error:', error)
      const job = musicJobs.get(jobId)
      if (job) {
        job.status = 'failed'
        job.error = error.message
        job.completedAt = new Date()
      }
    })

    return NextResponse.json({
      success: true,
      jobId,
      model,
      prompt,
      status: 'pending',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Music generation request error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function generateMusic(
  jobId: string,
  model: string,
  prompt: string,
  duration: number,
  apiKey: string,
  modelfile: any
) {
  const job = musicJobs.get(jobId)
  if (!job) return

  job.status = 'processing'
  job.progress = 10

  try {
    // Call HuggingFace music generation API
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          temperature: modelfile.temperature || 0.8,
          max_new_tokens: modelfile.max_tokens || 512,
          duration: duration,
        },
      }),
    })

    job.progress = 50

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`HuggingFace API error: ${error}`)
    }

    // Get audio data
    const audioBuffer = await response.arrayBuffer()
    const audioBase64 = Buffer.from(audioBuffer).toString('base64')

    job.progress = 90
    job.result = `data:audio/wav;base64,${audioBase64}`
    job.status = 'completed'
    job.progress = 100
    job.completedAt = new Date()
  } catch (error) {
    job.status = 'failed'
    job.error = error.message
    job.completedAt = new Date()
  }
}

// GET endpoint to check job status
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const jobId = searchParams.get('jobId')

  if (!jobId) {
    return NextResponse.json({ error: 'No jobId provided' }, { status: 400 })
  }

  const job = musicJobs.get(jobId)

  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 })
  }

  return NextResponse.json({
    jobId,
    status: job.status,
    progress: job.progress,
    result: job.result,
    error: job.error,
    createdAt: job.createdAt,
    completedAt: job.completedAt,
  })
}
