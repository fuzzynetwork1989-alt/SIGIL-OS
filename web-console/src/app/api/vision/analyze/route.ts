import { NextRequest, NextResponse } from 'next/server'
import { HuggingFaceProvider } from '@/lib/llm-provider'
import { loadModelfile } from '@/lib/modelfile'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const image = formData.get('image') as File
    const query = formData.get('query') as string || 'Describe this image in detail.'
    const model = formData.get('model') as string || 'sigil-vision'

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // Get HuggingFace API key
    const huggingfaceKey = req.headers.get('X-HuggingFace-Key') || process.env.HUGGINGFACE_API_KEY

    if (!huggingfaceKey) {
      return NextResponse.json({ error: 'HuggingFace API key required' }, { status: 401 })
    }

    // Load modelfile configuration
    const modelfile = await loadModelfile(model)
    const baseModel = modelfile.model || 'meta-llama/Llama-3.2-11B-Vision-Instruct'

    // Convert image to base64
    const bytes = await image.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    const mimeType = image.type || 'image/jpeg'
    const dataUrl = `data:${mimeType};base64,${base64}`

    // Create provider and call vision model
    const provider = new HuggingFaceProvider(huggingfaceKey)

    // Construct messages with image
    const messages = [
      {
        role: 'system',
        content: modelfile.system || 'You are a visual intelligence module.',
      },
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: dataUrl,
            },
          },
          {
            type: 'text',
            text: query,
          },
        ],
      },
    ]

    // For HuggingFace, we'll use the inference API directly
    const response = await fetch(`https://api-inference.huggingface.co/models/${baseModel}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${huggingfaceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {
          image: dataUrl,
          question: query,
        },
        parameters: {
          temperature: modelfile.temperature || 0.5,
          max_tokens: modelfile.max_tokens || 2048,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('HuggingFace Vision API error:', error)
      return NextResponse.json({ error: 'Vision analysis failed' }, { status: 500 })
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      model,
      query,
      response: result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Vision analysis error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
