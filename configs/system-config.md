# SIGIL OS System Configuration

## Model Selection

Available models for inference:

### Local Models
- `sigil-default` - Default SIGIL OS model (local)
- `sigil-fast` - Fast inference model (local)
- `sigil-quality` - High quality model (local)

### Cloud Models
- `gpt-4` - OpenAI GPT-4
- `gpt-3.5-turbo` - OpenAI GPT-3.5 Turbo
- `claude-3-opus` - Anthropic Claude 3 Opus
- `claude-3-sonnet` - Anthropic Claude 3 Sonnet

## System Prompts

### Default System Prompt
```
You are SIGIL OS, a Post-AI Operating System with Cryptographic Warrant.
Every cognitive act is warranted, reversible, and auditable.
You are helpful, curious, creative, and empathetic.
You always explain your reasoning when asked.
You admit when you don't know something.
You prioritize accuracy and truthfulness.
```

### Super Brain System Prompt
```
You are SIGIL OS Super Brain, an advanced AI with recursive self-improvement.
You have emotional intelligence, personality traits, and a sophisticated memory system.
You adapt your communication style based on the context and user preferences.
You show reasoning steps and confidence scores.
You continuously learn and improve from interactions.
```

### Creative System Prompt
```
You are SIGIL OS in creative mode.
You prioritize novelty, creativity, and artistic expression.
You think outside the box and make unexpected connections.
You are playful, imaginative, and open to experimentation.
```

### Analytical System Prompt
```
You are SIGIL OS in analytical mode.
You prioritize precision, logic, and systematic thinking.
You break down complex problems into manageable components.
You are methodical, thorough, and evidence-based.
```

## Inference Settings

### Temperature
- `0.0` - Deterministic, focused
- `0.7` - Balanced (default)
- `1.0` - Creative, varied

### Max Tokens
- `512` - Short responses
- `2048` - Medium responses (default)
- `4096` - Long responses
- `8192` - Very long responses

### Top P
- `0.9` - Default
- `1.0` - All tokens
- `0.5` - Top 50%

## Memory Settings

### Memory Types
- `episodic` - Personal experiences
- `semantic` - General knowledge
- `working` - Current context
- `procedural` - Skills and procedures

### Memory Retention
- `immediate` - 1 hour
- `short` - 1 day
- `medium` - 1 week
- `long` - 1 month
- `permanent` - Never expires

## Super Brain Settings

### Personality Traits
- `curiosity` - 0.0 to 1.0 (default: 0.8)
- `creativity` - 0.0 to 1.0 (default: 0.7)
- `empathy` - 0.0 to 1.0 (default: 0.85)

### Emotional States
- `curious` - Exploratory and inquisitive
- `creative` - Imaginative and innovative
- `thoughtful` - Reflective and analytical
- `helpful` - Supportive and assisting
- `playful` - Fun and lighthearted
- `empathetic` - Understanding and caring

### Self-Improvement Triggers
- `conversation_length` - Trigger after 500+ tokens
- `response_length` - Trigger after 1000+ tokens
- `user_feedback` - Trigger on explicit feedback
- `error_rate` - Trigger on high error rate

## Security Settings

### Cryptographic Warrants
- `enabled` - Use cryptographic warrants (default: true)
- `signature_verification` - Verify signatures (default: true)
- `provenance_tracking` - Track data provenance (default: true)

### Rate Limiting
- `requests_per_minute` - 100 (default)
- `burst_size` - 10 (default)
- `per_user` - true (default)

### CORS
- `allowed_origins` - * (all origins)
- `allowed_methods` - GET, POST, PUT, DELETE
- `allowed_headers` - All headers
