import { NextRequest, NextResponse } from 'next/server'
import { loadModelfile } from '@/lib/modelfile'

export const runtime = 'nodejs'
export const maxDuration = 120

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { text, model = 'sigil-voice', voice = 'default' } = body

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 })
    }

    // Get HuggingFace API key
    const huggingfaceKey = req.headers.get('X-HuggingFace-Key') || process.env.HUGGINGFACE_API_KEY

    if (!huggingfaceKey) {
      return NextResponse.json({ error: 'HuggingFace API key required' }, { status: 401 })
    }

    // Load modelfile configuration
    const modelfile = await loadModelfile(model)
    const baseModel = modelfile.model || 'parler-tts/parler-tts-large-v1'

    // Call HuggingFace TTS API
    const response = await fetch(`https://api-inference.huggingface.co/models/${baseModel}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${huggingfaceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          temperature: modelfile.temperature || 0.6,
          max_new_tokens: modelfile.max_tokens || 1024,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('HuggingFace TTS API error:', error)
      return NextResponse.json({ error: 'Voice synthesis failed' }, { status: 500 })
    }

    // Get audio data
    const audioBuffer = await response.arrayBuffer()
    const audioBase64 = Buffer.from(audioBuffer).toString('base64')

    return NextResponse.json({
      success: true,
      model,
      text,
      voice,
      audio: `data:audio/wav;base64,${audioBase64}`,
      duration: audioBuffer.byteLength,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Voice synthesis error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
