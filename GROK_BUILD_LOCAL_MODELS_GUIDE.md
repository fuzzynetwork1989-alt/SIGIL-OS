# Grok Build: Local LLM Setup Guide
## Complete Guide to Ollama, HuggingFace, and LM Studio (Offline & Online)

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Ollama Setup](#ollama-setup)
3. [HuggingFace Transformers Setup](#huggingface-transformers-setup)
4. [LM Studio Setup](#lm-studio-setup)
5. [Integration with Grok Build](#integration-with-grok-build)
6. [Offline Configuration](#offline-configuration)
7. [Online Configuration](#online-configuration)
8. [Troubleshooting](#troubleshooting)
9. [Performance Optimization](#performance-optimization)

---

## Prerequisites

### System Requirements

- **OS**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **RAM**: Minimum 8GB (16GB+ recommended for 7B+ models)
- **Storage**: 20GB+ free space (models vary in size)
- **GPU**: NVIDIA GPU with CUDA 11.8+ (optional but recommended for acceleration)
- **Python**: 3.8+ (for HuggingFace setup)

### Software Dependencies

```bash
# Windows
choco install git python

# macOS
brew install git python3

# Linux (Ubuntu/Debian)
sudo apt update
sudo apt install git python3 python3-pip
```

---

## Ollama Setup

### Step 1: Install Ollama

#### Windows
```powershell
# Download installer from https://ollama.com/download
# Or use winget
winget install Ollama.Ollama
```

#### macOS
```bash
brew install ollama
```

#### Linux
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Step 2: Start Ollama Service

#### Windows
```powershell
# Ollama runs as a background service automatically
# Verify it's running:
ollama --version
```

#### macOS/Linux
```bash
# Start the service
ollama serve &

# Verify
ollama --version
```

### Step 3: Download Models

```bash
# Popular models (adjust based on your hardware)
ollama pull llama3.2          # 3B - 70B versions available
ollama pull mistral           # 7B
ollama pull codellama         # Code-specialized
ollama pull phi3              # 3.8B
ollama pull qwen2             # 0.5B - 72B versions
```

### Step 4: Test Ollama

```bash
# Interactive chat
ollama run llama3.2

# API test
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "Hello, world!"
}'
```

### Step 5: Configure for Grok Build

Create `~/.ollama/config.json` (Linux/macOS) or `%USERPROFILE%\.ollama\config.json` (Windows):

```json
{
  "host": "0.0.0.0",
  "port": 11434,
  "origin": "*",
  "models": {
    "path": "~/.ollama/models"
  },
  "keep_alive": "30m",
  "num_ctx": 4096,
  "num_thread": 8
}
```

### Step 6: Verify API Access

```bash
# Check API is accessible
curl http://localhost:11434/api/tags

# Should return list of installed models
```

---

## HuggingFace Transformers Setup

### Step 1: Install Dependencies

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install core packages
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
pip install transformers accelerate bitsandbytes sentencepiece
pip install huggingface_hub

# For GPU acceleration (CUDA)
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

### Step 2: Configure HuggingFace Cache

```bash
# Set environment variable
export HF_HOME=~/.cache/huggingface  # Linux/macOS
setx HF_HOME "%USERPROFILE%\.cache\huggingface"  # Windows

# Or in Python:
import os
os.environ['HF_HOME'] = '/path/to/cache'
```

### Step 3: Authenticate (Optional, for gated models)

```bash
# Get token from https://huggingface.co/settings/tokens
huggingface-cli login
```

### Step 4: Download Models

#### Option A: Python Script
```python
# download_models.py
from transformers import AutoModelForCausalLM, AutoTokenizer

model_name = "microsoft/Phi-3-mini-4k-instruct"
cache_dir = "~/.cache/huggingface"

tokenizer = AutoTokenizer.from_pretrained(
    model_name,
    cache_dir=cache_dir,
    trust_remote_code=True
)

model = AutoModelForCausalLM.from_pretrained(
    model_name,
    cache_dir=cache_dir,
    trust_remote_code=True,
    device_map="auto"
)

print(f"Model downloaded to: {cache_dir}")
```

#### Option B: Command Line
```bash
# Using huggingface-cli
huggingface-cli download microsoft/Phi-3-mini-4k-instruct --local-dir ./models/phi3

# Or via git-lfs
git lfs install
git clone https://huggingface.co/microsoft/Phi-3-mini-4k-instruct
```

### Step 5: Test Model

```python
# test_model.py
from transformers import pipeline

pipe = pipeline(
    "text-generation",
    model="microsoft/Phi-3-mini-4k-instruct",
    device_map="auto"
)

result = pipe("Hello, how are you?", max_length=50)
print(result[0]['generated_text'])
```

### Step 6: Create Inference Server

```python
# hf_server.py
from fastapi import FastAPI
from transformers import pipeline
import uvicorn

app = FastAPI()

# Load model (adjust based on your hardware)
model_name = "microsoft/Phi-3-mini-4k-instruct"
pipe = pipeline("text-generation", model=model_name, device_map="auto")

@app.post("/generate")
async def generate(prompt: str, max_length: int = 100):
    result = pipe(prompt, max_length=max_length)
    return {"text": result[0]['generated_text']}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### Step 7: Run Server

```bash
# Install FastAPI if needed
pip install fastapi uvicorn

# Start server
python hf_server.py
```

---

## LM Studio Setup

### Step 1: Install LM Studio

#### Windows
```powershell
# Download from https://lmstudio.ai
# Install the .exe file
```

#### macOS
```bash
brew install --cask lm-studio
```

#### Linux
```bash
# Download AppImage from https://lmstudio.ai
chmod +x lm-studio-*.AppImage
./lm-studio-*.AppImage
```

### Step 2: Configure Model Directory

1. Open LM Studio
2. Go to Settings → Models
3. Set custom model directory: `C:\Users\%USERNAME%\LM Studio\Models` (Windows) or `~/LM Studio/Models` (macOS/Linux)

### Step 3: Download Models

1. Open LM Studio
2. Go to "Discover" tab
3. Search for models (e.g., "Llama 3", "Mistral", "Phi-3")
4. Click "Download" on desired models
5. Recommended for offline use:
   - Llama 3.2 3B Instruct (small, fast)
   - Phi-3 Mini 4K (excellent for code)
   - Mistral 7B Instruct (balanced)

### Step 4: Load Model Locally

1. Go to "Local" tab
2. Select downloaded model
3. Click "Load"
4. Adjust settings:
   - Context length: 4096-8192
   - GPU layers: Max available
   - Temperature: 0.7 (creative) to 0.1 (deterministic)

### Step 5: Enable API Server

1. Go to Settings → Server
2. Enable "Developer Server"
3. Port: 1234 (default)
4. CORS: Enable for Grok Build access
5. Click "Start Server"

### Step 6: Test API

```bash
curl http://localhost:1234/v1/chat/completions -X POST -H "Content-Type: application/json" -d '{
  "model": "local-model",
  "messages": [{"role": "user", "content": "Hello!"}],
  "temperature": 0.7
}'
```

---

## Integration with Grok Build

### Step 1: Configuration File

Create `grok_build_config.yaml`:

```yaml
llm_providers:
  ollama:
    enabled: true
    endpoint: http://localhost:11434
    models:
      - name: llama3.2
        type: chat
        offline: true
      - name: mistral
        type: code
        offline: true

  huggingface:
    enabled: true
    endpoint: http://localhost:8000
    models:
      - name: phi3-mini
        type: chat
        offline: true
      - name: codellama
        type: code
        offline: true

  lm_studio:
    enabled: true
    endpoint: http://localhost:1234
    api_type: openai_compatible
    models:
      - name: llama-3.2-3b
        type: chat
        offline: true

fallback_strategy:
  priority: [ollama, lm_studio, huggingface]
  offline_only: false  # Set to true for offline-only mode

cache:
  enabled: true
  directory: ./cache
  max_size_gb: 50
```

### Step 2: Python Integration

```python
# grok_llm_client.py
import requests
import yaml

class GrokLLMClient:
    def __init__(self, config_path="grok_build_config.yaml"):
        with open(config_path) as f:
            self.config = yaml.safe_load(f)
        self.providers = self.config['llm_providers']

    def generate(self, prompt, provider=None, model=None):
        if provider:
            return self._call_provider(provider, prompt, model)

        # Try providers in priority order
        for provider in self.config['fallback_strategy']['priority']:
            if self.providers[provider]['enabled']:
                try:
                    return self._call_provider(provider, prompt, model)
                except Exception as e:
                    print(f"{provider} failed: {e}")
                    continue

        raise Exception("All providers failed")

    def _call_provider(self, provider, prompt, model):
        endpoint = self.providers[provider]['endpoint']
        models = self.providers[provider]['models']

        if provider == 'ollama':
            return self._call_ollama(endpoint, prompt, model or models[0]['name'])
        elif provider == 'huggingface':
            return self._call_hf(endpoint, prompt, model or models[0]['name'])
        elif provider == 'lm_studio':
            return self._call_lm_studio(endpoint, prompt, model or models[0]['name'])

    def _call_ollama(self, endpoint, prompt, model):
        response = requests.post(f"{endpoint}/api/generate", json={
            "model": model,
            "prompt": prompt,
            "stream": False
        })
        return response.json()['response']

    def _call_hf(self, endpoint, prompt, model):
        response = requests.post(f"{endpoint}/generate", json={
            "prompt": prompt,
            "max_length": 200
        })
        return response.json()['text']

    def _call_lm_studio(self, endpoint, prompt, model):
        response = requests.post(f"{endpoint}/v1/chat/completions", json={
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7
        })
        return response.json()['choices'][0]['message']['content']

# Usage
client = GrokLLMClient()
result = client.generate("Explain quantum computing")
print(result)
```

### Step 3: Health Check Script

```python
# health_check.py
import requests
import yaml

def check_provider(provider, config):
    endpoint = config['endpoint']
    try:
        if provider == 'ollama':
            r = requests.get(f"{endpoint}/api/tags", timeout=5)
        elif provider == 'huggingface':
            r = requests.get(f"{endpoint}/", timeout=5)
        elif provider == 'lm_studio':
            r = requests.get(f"{endpoint}/v1/models", timeout=5)

        return r.status_code == 200
    except:
        return False

def main():
    with open("grok_build_config.yaml") as f:
        config = yaml.safe_load(f)

    print("Checking LLM providers...")
    for provider, cfg in config['llm_providers'].items():
        if cfg['enabled']:
            status = "✓ ONLINE" if check_provider(provider, cfg) else "✗ OFFLINE"
            print(f"{provider}: {status} ({cfg['endpoint']})")

if __name__ == "__main__":
    main()
```

---

## Offline Configuration

### Step 1: Pre-download All Models

```bash
# Ollama
ollama pull llama3.2
ollama pull mistral
ollama pull phi3

# HuggingFace (via Python script)
python download_models.py

# LM Studio
# Download models through UI before going offline
```

### Step 2: Disable Online Features

```yaml
# grok_build_config.yaml
fallback_strategy:
  priority: [ollama, lm_studio, huggingface]
  offline_only: true  # Force offline mode

llm_providers:
  ollama:
    enabled: true
    endpoint: http://localhost:11434
    online_mode: false
```

### Step 3: Cache All Downloads

```bash
# Create cache directory
mkdir -p ./cache/models

# Copy models to cache
cp -r ~/.ollama/models ./cache/
cp -r ~/.cache/huggingface ./cache/
cp -r "~/LM Studio/Models" ./cache/
```

### Step 4: Verify Offline Capability

```bash
# Disconnect network
# Test each provider
python health_check.py
python grok_llm_client.py
```

---

## Online Configuration

### Step 1: Enable Online Features

```yaml
# grok_build_config.yaml
fallback_strategy:
  priority: [ollama, lm_studio, huggingface]
  offline_only: false

llm_providers:
  ollama:
    enabled: true
    endpoint: http://localhost:11434
    online_mode: true
    auto_update: true
```

### Step 2: Configure Auto-updates

```bash
# Ollama auto-update
ollama pull --update llama3.2

# HuggingFace auto-download (on-demand)
# Add to your code:
from transformers import AutoModelForCausalLM
model = AutoModelForCausalLM.from_pretrained(
    "model-name",
    cache_dir="~/.cache/huggingface",
    resume_download=True
)
```

### Step 3: Use HuggingFace Inference API (Optional)

```python
# For models too large to run locally
import requests

API_URL = "https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B"
headers = {"Authorization": "Bearer YOUR_HF_TOKEN"}

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()

output = query({"inputs": "Explain AI"})
```

---

## Troubleshooting

### Ollama Issues

**Problem: Ollama not responding**
```bash
# Restart service
# Windows: Restart in Task Manager
# macOS/Linux:
pkill ollama
ollama serve &
```

**Problem: Model download fails**
```bash
# Check disk space
df -h

# Clear cache
ollama rm <model-name>
ollama pull <model-name>
```

**Problem: GPU not detected**
```bash
# Check CUDA
nvidia-smi

# Reinstall with CUDA support
# Linux: Install CUDA toolkit first
# Windows: Install NVIDIA drivers
```

### HuggingFace Issues

**Problem: Out of memory**
```python
# Use quantization
from transformers import BitsAndBytesConfig
quantization_config = BitsAndBytesConfig(
    load_in_8bit=True,
    bnb_8bit_compute_dtype=torch.float16
)

model = AutoModelForCausalLM.from_pretrained(
    model_name,
    quantization_config=quantization_config,
    device_map="auto"
)
```

**Problem: Slow inference**
```python
# Use smaller model or quantization
# Enable flash attention (if supported)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    attn_implementation="flash_attention_2",
    device_map="auto"
)
```

**Problem: Model not found**
```bash
# Check cache directory
ls ~/.cache/huggingface/hub/

# Re-download with correct name
huggingface-cli download --repo-type model <correct-name>
```

### LM Studio Issues

**Problem: Server won't start**
```bash
# Check port conflicts
netstat -an | grep 1234

# Change port in LM Studio Settings
```

**Problem: Model fails to load**
```bash
# Reduce context length in settings
# Reduce GPU layers
# Try quantized version (Q4_K_M, Q5_K_M)
```

**Problem: API errors**
```bash
# Enable CORS in Settings
# Check firewall settings
# Verify endpoint: http://localhost:1234/v1/models
```

### General Issues

**Problem: Grok Build can't connect**
```python
# Test connectivity manually
curl http://localhost:11434/api/tags
curl http://localhost:8000/
curl http://localhost:1234/v1/models

# Check config file path
python -c "import os; print(os.path.abspath('grok_build_config.yaml'))"
```

**Problem: Slow performance across all providers**
```bash
# Check system resources
htop  # Linux/macOS
taskmgr  # Windows

# Reduce model size
# Enable GPU acceleration
# Increase context length only when needed
```

---

## Performance Optimization

### GPU Acceleration

#### Ollama
```bash
# Set GPU layers (Linux/macOS)
export OLLAMA_GPU_LAYERS=35

# Windows: Set environment variable
setx OLLAMA_GPU_LAYERS 35
```

#### HuggingFace
```python
# Use device_map="auto" for automatic GPU offloading
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    device_map="auto",
    torch_dtype=torch.float16
)
```

#### LM Studio
- In Settings → GPU Layers, set to maximum
- Enable "Flash Attention" if available
- Use "CUDA" or "Metal" backend based on hardware

### Memory Optimization

```python
# Use 4-bit or 8-bit quantization
from transformers import BitsAndBytesConfig

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_use_double_quant=True,
)

model = AutoModelForCausalLM.from_pretrained(
    model_name,
    quantization_config=bnb_config,
    device_map="auto"
)
```

### Batch Processing

```python
# Process multiple prompts efficiently
from transformers import pipeline

pipe = pipeline("text-generation", model=model_name, device=0)

prompts = ["Hello", "World", "Test"]
results = pipe(prompts, batch_size=4)
```

### Caching

```python
# Enable transformers cache
import os
os.environ['TRANSFORMERS_CACHE'] = './cache'

# For custom caching
from functools import lru_cache

@lru_cache(maxsize=100)
def cached_generate(prompt_hash):
    return generate(prompt)
```

---

## Quick Start Checklist

- [ ] Install Ollama and verify `ollama --version`
- [ ] Pull at least one Ollama model: `ollama pull llama3.2`
- [ ] Install Python 3.8+ and create virtual environment
- [ ] Install HuggingFace dependencies: `pip install transformers torch`
- [ ] Download at least one HF model (Phi-3 recommended)
- [ ] Install LM Studio and download models through UI
- [ ] Enable API servers in Ollama and LM Studio
- [ ] Create HF inference server (optional)
- [ ] Create `grok_build_config.yaml`
- [ ] Test each provider with health check script
- [ ] Test Grok Build integration
- [ ] Configure offline mode (pre-download all models)
- [ ] Verify offline capability

---

## Additional Resources

- **Ollama Documentation**: https://github.com/ollama/ollama
- **HuggingFace Transformers**: https://huggingface.co/docs/transformers
- **LM Studio**: https://lmstudio.ai
- **Model Zoo**: https://huggingface.co/models
- **Quantization Guide**: https://huggingface.co/docs/transformers/quantization

---

## Support

For issues specific to Grok Build integration, consult Grok Build documentation or support channels. For provider-specific issues, refer to their respective documentation and communities.
