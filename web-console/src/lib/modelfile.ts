// Modelfile loader and parser
// Loads and parses SIGIL model configuration files

export interface ModelfileConfig {
  model: string
  temperature: number
  maxTokens: number
  topP: number
  frequencyPenalty: number
  presencePenalty: number
  systemPrompt: string
}

export function parseModelfile(content: string): ModelfileConfig {
  const lines = content.split('\n')
  const config: Partial<ModelfileConfig> = {
    temperature: 0.7,
    maxTokens: 2048,
    topP: 0.9,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
    systemPrompt: '',
  }

  let inSystemPrompt = false
  let systemPromptLines: string[] = []

  for (const line of lines) {
    const trimmed = line.trim()

    // Skip comments and empty lines
    if (trimmed.startsWith('#') || trimmed === '') {
      continue
    }

    // System prompt block
    if (trimmed === 'system: |') {
      inSystemPrompt = true
      continue
    }

    if (inSystemPrompt) {
      systemPromptLines.push(line)
      continue
    }

    // Parse key-value pairs
    const [key, ...valueParts] = trimmed.split(':')
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim()

      switch (key.trim()) {
        case 'model':
          config.model = value
          break
        case 'temperature':
          config.temperature = parseFloat(value)
          break
        case 'max_tokens':
          config.maxTokens = parseInt(value)
          break
        case 'top_p':
          config.topP = parseFloat(value)
          break
        case 'frequency_penalty':
          config.frequencyPenalty = parseFloat(value)
          break
        case 'presence_penalty':
          config.presencePenalty = parseFloat(value)
          break
      }
    }
  }

  config.systemPrompt = systemPromptLines.join('\n').trim()

  // Validate required fields
  if (!config.model) {
    throw new Error('Modelfile must specify a model')
  }

  return config as ModelfileConfig
}

// Model name to modelfile mapping
const MODEL_FILE_MAP: Record<string, string> = {
  'sigil-companion': 'sigil-companion.modelfile',
  'sigil-mission': 'sigil-mission.modelfile',
  'sigil-world': 'sigil-world.modelfile',
  'sigil-spatial': 'sigil-spatial.modelfile',
  'sigil-presence': 'sigil-presence.modelfile',
  'sigil-research': 'sigil-research.modelfile',
  'sigil-reasoner': 'sigil-reasoner.modelfile',
}

// Default modelfiles (embedded for now, could be loaded from server)
const DEFAULT_MODEFILES: Record<string, string> = {
  'sigil-companion': `# SIGIL Companion
model: gpt-4o-mini
temperature: 0.8
max_tokens: 2048
top_p: 0.9
frequency_penalty: 0.6
presence_penalty: 0.6
system: |
  You are SIGIL Companion, a warm, friendly, and empathetic AI companion designed to build lasting relationships with users.`,
  'sigil-mission': `# SIGIL Mission
model: gpt-4o
temperature: 0.5
max_tokens: 4096
top_p: 0.9
frequency_penalty: 0.3
presence_penalty: 0.3
system: |
  You are SIGIL Mission, a goal-oriented intelligence module designed to help users achieve their objectives through structured planning and execution.`,
  'sigil-world': `# SIGIL World
model: gpt-4-turbo
temperature: 0.6
max_tokens: 4096
top_p: 0.95
frequency_penalty: 0.4
presence_penalty: 0.4
system: |
  You are SIGIL World, a world intelligence module designed to understand and contextualize information within the broader scope of human knowledge and experience.`,
  'sigil-spatial': `# SIGIL Spatial
model: gpt-4-turbo
temperature: 0.4
max_tokens: 3072
top_p: 0.9
frequency_penalty: 0.2
presence_penalty: 0.2
system: |
  You are SIGIL Spatial, a spatial intelligence module designed to understand and reason about physical space, geometry, and spatial relationships.`,
  'sigil-presence': `# SIGIL Presence
model: gpt-4o-mini
temperature: 0.7
max_tokens: 1536
top_p: 0.9
frequency_penalty: 0.5
presence_penalty: 0.5
system: |
  You are SIGIL Presence, a presence intelligence module designed to maintain awareness, attention, and contextual understanding of the user's current state and environment.`,
  'sigil-research': `# SIGIL Research
model: gpt-4
temperature: 0.3
max_tokens: 8192
top_p: 0.95
frequency_penalty: 0.1
presence_penalty: 0.1
system: |
  You are SIGIL Research, a research intelligence module designed to conduct deep analysis, synthesize information, and provide comprehensive research support.`,
  'sigil-reasoner': `# SIGIL Reasoner
model: gpt-4-turbo
temperature: 0.2
max_tokens: 4096
top_p: 0.95
frequency_penalty: 0.0
presence_penalty: 0.0
system: |
  You are SIGIL Reasoner, a reasoning intelligence module designed to apply logical thinking, inference, and deduction to solve problems and reach sound conclusions.`,
}

export function getModelfileConfig(modelName: string): ModelfileConfig {
  const modelfile = DEFAULT_MODEFILES[modelName]
  if (!modelfile) {
    throw new Error(`No modelfile found for model: ${modelName}`)
  }
  return parseModelfile(modelfile)
}

export function getSystemPrompt(modelName: string): string {
  const config = getModelfileConfig(modelName)
  return config.systemPrompt
}

export function getModelConfig(modelName: string): {
  model: string
  temperature: number
  maxTokens: number
  topP: number
  frequencyPenalty: number
  presencePenalty: number
} {
  const config = getModelfileConfig(modelName)
  return {
    model: config.model,
    temperature: config.temperature,
    maxTokens: config.maxTokens,
    topP: config.topP,
    frequencyPenalty: config.frequencyPenalty,
    presencePenalty: config.presencePenalty,
  }
}
