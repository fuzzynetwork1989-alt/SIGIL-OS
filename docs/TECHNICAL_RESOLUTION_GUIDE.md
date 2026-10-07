# Technical Limitations Resolution Guide

**Version:** 1.0.0
**Last Updated:** 2026-10-07

---

## Table of Contents

1. [Overview](#overview)
2. [Candle Dependency Conflict](#candle-dependency-conflict)
3. [Quest SDK Installation](#quest-sdk-installation)
4. [Actual ML Inference](#actual-ml-inference)
5. [Testing and Verification](#testing-and-verification)
6. [Rollback Plan](#rollback-plan)

---

## Overview

SIGIL OS has three known technical limitations that need to be resolved for production readiness:

1. **Candle Dependency Conflict** - ML framework has rand crate conflicts
2. **Quest SDK Installation** - Android/Quest SDKs require manual installation
3. **Actual ML Inference** - Placeholder implementation needs real ML integration

This guide provides step-by-step instructions to resolve each limitation.

---

## Candle Dependency Conflict

### Problem

The Candle ML framework (v0.3.3) has dependency conflicts with the `rand` crate:
- Candle requires `rand` v0.8.x
- Other dependencies require `rand` v0.9.x
- `rand_distr` version incompatibilities
- `half::f16`/`bf16` trait implementation conflicts

### Solution Options

#### Option 1: Upgrade Candle to v0.11.0 (Recommended)

**Why:** Newer version has updated dependencies

**Steps:**

1. **Update model-fabric/Cargo.toml:**

```toml
[dependencies]
# Remove old candle dependencies
# candle-core = "0.3.3"
# candle-nn = "0.3.3"
# candle-transformers = "0.3.3"

# Add new candle dependencies
candle-core = "0.11.0"
candle-nn = "0.11.0"
candle-transformers = "0.11.0"
candle-flash-attn = { version = "0.11.0", optional = true }
```

2. **Update Cargo.lock:**

```bash
cd model-fabric
cargo update
```

3. **Fix Breaking Changes:**

Candle v0.11.0 may have API changes. Update code:

```rust
// Old API (v0.3.3)
let tensor = Tensor::zeros(&[batch_size, seq_len])?;

// New API (v0.11.0) - check actual API changes
let tensor = Tensor::zeros((batch_size, seq_len), candle_core::Device::Cpu)?;
```

4. **Test Build:**

```bash
cargo build --package model-fabric
cargo test --package model-fabric
```

5. **If Still Failing:**

Check specific error messages and adjust accordingly.

#### Option 2: Use Alternative ML Framework

**Option 2A: tch-rs (PyTorch Bindings)**

**Pros:**
- Stable, well-maintained
- PyTorch ecosystem
- Good GPU support

**Cons:**
- Requires LibTorch installation
- Larger binary size

**Steps:**

1. **Update model-fabric/Cargo.toml:**

```toml
[dependencies]
# Remove candle dependencies
# candle-core = "0.3.3"
# candle-nn = "0.3.3"
# candle-transformers = "0.3.3"

# Add tch-rs
tch = "0.14"
```

2. **Install LibTorch:**

```bash
# Download LibTorch from https://pytorch.org/
# Extract to /usr/local/libtorch (Linux)
# or C:\libtorch (Windows)

# Set environment variables
# Linux/macOS:
export LIBTORCH=/usr/local/libtorch
export LD_LIBRARY_PATH=$LIBTORCH/lib:$LD_LIBRARY_PATH

# Windows:
set LIBTORCH=C:\libtorch
set PATH=%LIBTORCH%\lib;%PATH%
```

3. **Update Code:**

```rust
// model-fabric/src/engine.rs
use tch::{Device, Kind, Tensor};

pub struct InferenceEngine {
    device: Device,
    model: Option<tch::CModule>,
}

impl InferenceEngine {
    pub fn new() -> Self {
        Self {
            device: Device::cuda_if_available(),
            model: None,
        }
    }

    pub fn load_model(&mut self, model_path: &str) -> Result<()> {
        self.model = Some(tch::CModule::load(model_path)?);
        Ok(())
    }

    pub fn infer(&self, input: &str) -> Result<String> {
        // Implement actual inference with tch
        Ok("placeholder".to_string())
    }
}
```

4. **Test Build:**

```bash
cargo build --package model-fabric
cargo test --package model-fabric
```

**Option 2B: burn (Pure Rust)**

**Pros:**
- Pure Rust, no external dependencies
- Modern API
- Growing ecosystem

**Cons:**
- Less mature than tch/candle
- Smaller ecosystem

**Steps:**

1. **Update model-fabric/Cargo.toml:**

```toml
[dependencies]
# Remove candle dependencies
# candle-core = "0.3.3"
# candle-nn = "0.3.3"
# candle-transformers = "0.3.3"

# Add burn
burn = { version = "0.15", features = ["train", "ndarray"] }
```

2. **Update Code:**

```rust
// model-fabric/src/engine.rs
use burn::tensor::Tensor;
use burn::nn::transformer::TransformerConfig;

pub struct InferenceEngine {
    // Burn-based implementation
}

impl InferenceEngine {
    pub fn new() -> Self {
        Self {}
    }

    pub fn infer(&self, input: &str) -> Result<String> {
        // Implement with burn
        Ok("placeholder".to_string())
    }
}
```

3. **Test Build:**

```bash
cargo build --package model-fabric
cargo test --package model-fabric
```

#### Option 3: Use Python/PyTorch FFI

**Pros:**
- Full PyTorch ecosystem
- Many pre-trained models
- Easy prototyping

**Cons:**
- Python dependency
- Slower than pure Rust
- More complex deployment

**Steps:**

1. **Install Python Dependencies:**

```bash
pip install torch transformers
```

2. **Add Python FFI to Cargo.toml:**

```toml
[dependencies]
pyo3 = { version = "0.20", features = ["auto-initialize"] }
```

3. **Create Python Bridge:**

```python
# model_fabric_python.py
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

class ModelFabric:
    def __init__(self, model_path):
        self.tokenizer = AutoTokenizer.from_pretrained(model_path)
        self.model = AutoModelForCausalLM.from_pretrained(model_path)
    
    def infer(self, text):
        inputs = self.tokenizer(text, return_tensors="pt")
        outputs = self.model.generate(**inputs)
        return self.tokenizer.decode(outputs[0])

# Initialize model
fabric = ModelFabric("Qwen/Qwen-7B")
```

4. **Call from Rust:**

```rust
// model-fabric/src/engine.rs
use pyo3::prelude::*;

#[pyclass]
struct InferenceEngine {
    #[pymethod]
    fn infer(&self, input: &str) -> PyResult<String> {
        Python::with_gil(|py| {
            let module = PyModule::import(py, "model_fabric_python")?;
            let fabric = module.getattr("fabric")?;
            let result = fabric.call_method1("infer", (input,))?;
            Ok(result.extract()?)
        })
    }
}
```

### Recommended Approach

**For Production:** Use Option 1 (Upgrade Candle) or Option 2A (tch-rs)

**For Quick Prototype:** Use Option 3 (Python FFI)

**For Long-term:** Consider burn (pure Rust) as it matures

---

## Quest SDK Installation

### Problem

Meta Quest 3 integration requires:
- Android Studio
- Android SDK
- Android NDK
- Quest SDK
- OpenXR
- Oculus developer account

### Prerequisites

1. **Meta Developer Account:**
   - Go to https://developer.oculus.com/
   - Sign up or log in
   - Verify organization (individual or company)
   - Enable developer mode on Quest 3

2. **Hardware:**
   - Meta Quest 3 headset
   - USB-C cable
   - Development machine (Windows recommended)

### Step-by-Step Installation

#### Step 1: Enable Developer Mode on Quest 3

1. Open the Meta Quest app on your phone
2. Tap Menu → Devices
3. Select your Quest 3 headset
4. Scroll down to "Developer Mode"
5. Toggle it ON
6. Confirm your account

#### Step 2: Install Android Studio

**Windows:**

1. Download Android Studio: https://developer.android.com/studio
2. Run installer
3. Install with default settings
4. Launch Android Studio
5. Complete setup wizard

**Linux:**

```bash
# Download Android Studio
wget https://redirector.gvt1.com/edgedl/android/studio/ide-zips/android-studio-2023.1.1.28-linux.tar.gz

# Extract
tar -xzf android-studio-*.tar.gz

# Move to /opt
sudo mv android-studio /opt/

# Create desktop shortcut
sudo ln -s /opt/android-studio/bin/studio.sh /usr/local/bin/android-studio
```

**macOS:**

```bash
# Download Android Studio for Mac
# Install DMG
# Drag to Applications
```

#### Step 3: Install Android SDK and NDK

**Via Android Studio:**

1. Open Android Studio
2. Tools → SDK Manager
3. Install:
   - Android SDK Platform-Tools
   - Android SDK Build-Tools
   - Android NDK (Side by side)
   - Android Emulator (optional)

**Set Environment Variables:**

**Windows (PowerShell):**
```powershell
$env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
$env:ANDROID_NDK_HOME = "$env:ANDROID_HOME\ndk\25.2.9519653"
$env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator"
```

**Linux/macOS (Bash):**
```bash
# Add to ~/.bashrc or ~/.zshrc
export ANDROID_HOME=$HOME/Android/Sdk
export ANDROID_NDK_HOME=$ANDROID_HOME/ndk/25.2.9519653
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator
```

#### Step 4: Install Quest SDK

1. **Download Quest SDK:**
   - Go to https://developer.oculus.com/downloads/package/oculus-mobile-sdk/
   - Download latest version
   - Extract to development directory

2. **Add to PATH:**

**Windows:**
```powershell
$env:QUEST_SDK = "C:\OculusMobileSDK"
$env:PATH += ";$env:QUEST_SDK\Tools"
```

**Linux/macOS:**
```bash
export QUEST_SDK=$HOME/OculusMobileSDK
export PATH=$PATH:$QUEST_SDK/Tools
```

#### Step 5: Install OpenXR

1. **Download OpenXR Loader:**
   - Go to https://github.com/KhronosGroup/OpenXR-SDK
   - Clone or download release
   - Build or download pre-built binaries

2. **Install:**

**Windows:**
```powershell
# Copy to C:\Program Files\OpenXR
# Add to PATH
$env:OPENXR_SDK = "C:\Program Files\OpenXR"
$env:PATH += ";$env:OPENXR_SDK\bin"
```

**Linux:**
```bash
# Build from source
git clone https://github.com/KhronosGroup/OpenXR-SDK.git
cd OpenXR-SDK
mkdir build && cd build
cmake ..
make
sudo make install
```

#### Step 6: Configure Quest 3 for Development

1. **Enable USB Debugging:**
   - Put on Quest 3 headset
   - Settings → System → Developer
   - Enable "USB Connection"
   - Select "File Transfer" or "ADB"

2. **Connect Quest 3:**
   - Connect via USB-C cable
   - Allow USB debugging on headset

3. **Verify Connection:**

```bash
# Check ADB connection
adb devices

# Should show your Quest 3 device
```

#### Step 7: Create Quest Project

**Option 1: Using Quest Project Template:**

```bash
# Create new Quest project
cd quest-integration
mkdir android
cd android

# Initialize Android project
# Use Quest SDK template
# Or use Android Studio with Quest plugin
```

**Option 2: Add to Existing Project:**

Update `quest-integration/Cargo.toml`:

```toml[package]
name = "quest-integration"
version = "0.1.0"
edition = "2021"

[dependencies]
# Rust dependencies
tokio = { workspace = true }
serde = { workspace = true }
serde_json = { workspace = true }
uuid = { workspace = true }
chrono = { workspace = true }

# Android/Quest bindings
jni = "0.21"
ndk = "0.8"
ndk-glue = "0.8"
ndk-context = "0.1"

[build-dependencies]
nbind = "0.1"
```

Create `quest-integration/build.rs`:

```rust
fn main() {
    // Link to Quest SDK libraries
    println!("cargo:rustc-link-search=native=/path/to/QuestSDK/Lib");
    println!("cargo:rustc-link-lib=LibOVR");
}
```

#### Step 8: Build and Deploy

**Build for Android:**

```bash
# Install cargo-apk
cargo install cargo-apk

# Build APK
cd quest-integration
cargo apk build

# Deploy to Quest 3
cargo apk install
```

**Or use Android Studio:**

1. Open Android Studio
2. Import quest-integration/android project
3. Configure build variant (debug/release)
4. Run on connected Quest 3 device

#### Step 9: Test on Quest 3

1. **Launch App:**
   - Put on Quest 3 headset
   - Open Library → Unknown Sources
   - Launch SIGIL OS

2. **Test Features:**
   - Voice input (microphone permission)
   - Hand tracking
   - Passthrough mode
   - Spatial anchors
   - Avatar rendering

3. **Debug:**

```bash
# View logs
adb logcat | grep sigil

# Or use Android Studio Logcat
```

### Common Issues

**Issue: ADB not recognizing device**

**Solution:**
```bash
# Restart ADB server
adb kill-server
adb start-server

# Check device
adb devices

# If still not working, try different USB cable or port
```

**Issue: Build fails with "NDK not found"**

**Solution:**
```bash
# Verify NDK path
echo $ANDROID_NDK_HOME

# Set correct path
export ANDROID_NDK_HOME=$ANDROID_HOME/ndk/25.2.9519653
```

**Issue: Permission denied errors**

**Solution:**
```bash
# Grant USB debugging permission on Quest 3
# Settings → System → Developer → USB Debugging → Allow
```

---

## Actual ML Inference

### Problem

Current Model Fabric uses placeholder inference. Need to integrate actual Qwen 7B model.

### Step-by-Step Implementation

#### Step 1: Download Qwen 7B Model

**Option 1: Hugging Face (Recommended)**

```bash
# Install huggingface-cli
pip install huggingface_hub

# Download Qwen 7B
huggingface-cli download Qwen/Qwen-7B --local-dir ~/.sigil-os/models/qwen-7b
```

**Option 2: ModelScope (Alibaba)**

```bash
# Install modelscope
pip install modelscope

# Download Qwen 7B
python -c "from modelscope import snapshot_download; snapshot_download('Qwen/Qwen-7B', cache_dir='~/.sigil-os/models')"
```

**Model Size:** ~13GB (compressed), ~26GB (uncompressed)

#### Step 2: Integrate with Model Fabric

**Using Candle (After dependency fix):**

```rust
// model-fabric/src/engine.rs
use candle_core::{Device, Tensor};
use candle_nn::VarBuilder;
use candle_transformers::models::qwen::Qwen as QwenModel;

pub struct InferenceEngine {
    device: Device,
    model: Option<QwenModel>,
    tokenizer: Option<tokenizers::Tokenizer>,
}

impl InferenceEngine {
    pub fn new() -> Self {
        Self {
            device: Device::cuda_if_available(),
            model: None,
            tokenizer: None,
        }
    }

    pub fn load_model(&mut self, model_path: &str) -> Result<()> {
        // Load tokenizer
        let tokenizer = tokenizers::Tokenizer::from_file(
            format!("{}/tokenizer.json", model_path)
        ).map_err(|e| ModelFabricError::ModelLoad(e.to_string()))?;

        // Load model weights
        let vb = VarBuilder::from_mmaped_safetensors(
            &[format!("{}/model.safetensors", model_path)],
            &self.device,
        ).map_err(|e| ModelFabricError::ModelLoad(e.to_string()))?;

        let config = qwen::Config::default();
        let model = QwenModel::new(&config, vb)?;

        self.model = Some(model);
        self.tokenizer = Some(tokenizer);
        Ok(())
    }

    pub fn infer(&self, input: &str) -> Result<String> {
        let model = self.model.as_ref().ok_or(ModelFabricError::ModelNotLoaded)?;
        let tokenizer = self.tokenizer.as_ref().ok_or(ModelFabricError::ModelNotLoaded)?;

        // Tokenize input
        let tokens = tokenizer
            .encode(input, true)
            .map_err(|e| ModelFabricError::Tokenization(e.to_string()))?
            .get_ids()
            .to_vec();

        let input_tensor = Tensor::new(&tokens[..], &self.device)?.unsqueeze(0)?;

        // Run inference
        let output = model.forward(&input_tensor, 0)?;

        // Decode output
        let output_ids = output.to_vec1::<u32>()?;
        let output_text = tokenizer
            .decode(&output_ids, true)
            .map_err(|e| ModelFabricError::Detokenization(e.to_string()))?;

        Ok(output_text)
    }
}
```

**Using tch-rs:**

```rust
// model-fabric/src/engine.rs
use tch::{Device, Kind, Tensor, CModule};

pub struct InferenceEngine {
    device: Device,
    model: Option<CModule>,
    tokenizer: Option<tokenizers::Tokenizer>,
}

impl InferenceEngine {
    pub fn new() -> Self {
        Self {
            device: Device::cuda_if_available(),
            model: None,
            tokenizer: None,
        }
    }

    pub fn load_model(&mut self, model_path: &str) -> Result<()> {
        // Load tokenizer
        let tokenizer = tokenizers::Tokenizer::from_file(
            format!("{}/tokenizer.json", model_path)
        ).map_err(|e| ModelFabricError::ModelLoad(e.to_string()))?;

        // Load model (converted to TorchScript)
        self.model = Some(CModule::load(model_path)?);

        self.tokenizer = Some(tokenizer);
        Ok(())
    }

    pub fn infer(&self, input: &str) -> Result<String> {
        let model = self.model.as_ref().ok_or(ModelFabricError::ModelNotLoaded)?;
        let tokenizer = self.tokenizer.as_ref().ok_or(ModelFabricError::ModelNotLoaded)?;

        // Tokenize input
        let tokens = tokenizer
            .encode(input, true)
            .map_err(|e| ModelFabricError::Tokenization(e.to_string()))?
            .get_ids()
            .to_vec();

        let input_tensor = Tensor::of_slice(&tokens)
            .to(self.device)
            .unsqueeze(0);

        // Run inference
        let output = model.forward_ts(&[input_tensor])?;

        // Decode output
        let output_ids = output.to(Device::Cpu).i64_value().to_vec();
        let output_text = tokenizer
            .decode(&output_ids, true)
            .map_err(|e| ModelFabricError::Detokenization(e.to_string()))?;

        Ok(output_text)
    }
}
```

#### Step 3: Add Tokenizer Dependency

Update `model-fabric/Cargo.toml`:

```toml
[dependencies]
tokenizers = "0.15"
```

#### Step 4: Implement Streaming (Optional)

For better UX, implement streaming inference:

```rust
pub fn infer_stream<'a>(
    &'a self,
    input: &'a str,
) -> impl Iterator<Item = Result<String>> + 'a {
    let model = self.model.as_ref().unwrap();
    let tokenizer = self.tokenizer.as_ref().unwrap();

    // Tokenize input
    let tokens = tokenizer.encode(input, true).unwrap().get_ids().to_vec();
    let mut input_tensor = Tensor::new(&tokens[..], &self.device).unwrap().unsqueeze(0).unwrap();

    std::iter::from_fn(move || {
        // Generate one token at a time
        let output = model.forward(&input_tensor, 0).unwrap();
        let output_ids = output.to_vec1::<u32>().unwrap();
        let next_token = *output_ids.last().unwrap();

        // Decode single token
        let token_text = tokenizer.decode(&[next_token], true).unwrap();

        // Append to input for next iteration
        input_tensor = Tensor::cat(&[input_tensor, Tensor::new(&[next_token], &self.device).unwrap().unsqueeze(0).unwrap()], 0).unwrap();

        Some(Ok(token_text))
    })
}
```

#### Step 5: Test Inference

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    #[ignore] // Ignore by default (requires model download)
    fn test_actual_inference() {
        let mut engine = InferenceEngine::new();
        engine.load_model("~/.sigil-os/models/qwen-7b").unwrap();

        let result = engine.infer("Hello, world!").unwrap();
        assert!(!result.is_empty());
    }
}
```

#### Step 6: Optimize Performance

**Quantization:**

```rust
// Use 8-bit quantization for faster inference
let config = qwen::Config {
    quantized: true,
    ..Default::default()
};
```

**Caching:**

```rust
// Cache model in memory
use once_cell::sync::Lazy;

static MODEL_CACHE: Lazy<InferenceEngine> = Lazy::new(|| {
    let mut engine = InferenceEngine::new();
    engine.load_model("~/.sigil-os/models/qwen-7b").unwrap();
    engine
});
```

**Batch Processing:**

```rust
// Process multiple requests in batch
pub fn infer_batch(&self, inputs: &[String]) -> Result<Vec<String>> {
    // Tokenize all inputs
    let tokenized: Vec<Vec<u32>> = inputs
        .iter()
        .map(|input| {
            self.tokenizer.as_ref().unwrap()
                .encode(input, true)
                .unwrap()
                .get_ids()
                .to_vec()
        })
        .collect();

    // Pad to same length
    let max_len = tokenized.iter().map(|t| t.len()).max().unwrap();
    let padded: Vec<Vec<u32>> = tokenized
        .iter()
        .map(|t| {
            let mut padded = t.clone();
            padded.resize(max_len, 0);
            padded
        })
        .collect();

    // Batch inference
    let batch_tensor = Tensor::new(&padded, &self.device)?;

    // ... rest of implementation
    Ok(vec![])
}
```

---

## Testing and Verification

### Test Candle Dependency Fix

```bash
# Test build
cargo build --package model-fabric

# Test unit tests
cargo test --package model-fabric

# Run integration test
cargo test --package model-fabric --test integration
```

### Test Quest SDK Integration

```bash
# Build for Android
cd quest-integration
cargo apk build

# Deploy to Quest 3
cargo apk install

# Monitor logs
adb logcat | grep sigil
```

### Test ML Inference

```bash
# Download model
python -c "from modelscope import snapshot_download; snapshot_download('Qwen/Qwen-7B', cache_dir='~/.sigil-os/models')"

# Run inference test
cargo test --package model-fabric test_actual_inference -- --ignored
```

---

## Rollback Plan

If any resolution causes issues:

### Candle Rollback

```bash
# Revert to original version
cd model-fabric
git checkout HEAD~1 Cargo.toml

# Restore placeholder implementation
git checkout HEAD~1 src/engine.rs
```

### Quest SDK Rollback

```bash
# Remove Quest integration from workspace
# Edit root Cargo.toml to remove quest-integration

# Or keep structural code but disable actual Quest features
# Add feature flag: quest = []
```

### ML Inference Rollback

```bash
# Keep placeholder but add feature flag
# model-fabric/Cargo.toml
[features]
default = []
ml = ["candle"]  # Only enable when candle is fixed
```

---

## Priority Order

**Immediate (Week 1):**
1. Resolve candle dependency (Option 1 or 2A)
2. Test ML inference

**Short-term (Week 2-3):**
3. Install Quest SDK
4. Build Quest app
5. Test on Quest 3 device

**Long-term (Week 4+):**
6. Optimize ML inference
7. Add streaming
8. Add quantization

---

## Budget Estimates

### Candle/ML Framework
- Time: 1-2 weeks
- Cost: $0 (using free tools)

### Quest SDK
- Time: 1-2 weeks
- Cost: $0 (SDKs are free)
- Quest 3 device: $499 (if not owned)

### Model Weights
- Time: 1 day (download)
- Cost: $0 (free download)
- Storage: 26GB local space

### **Total Cost: $0-499 (if Quest 3 needed)**

---

## Next Steps

1. Choose ML framework approach (Candle upgrade or tch-rs)
2. Implement ML inference
3. Install Quest SDK
4. Build Quest app
5. Test on actual Quest 3 device
6. Optimize performance
7. Document any changes

---

*For specific issues, open a GitHub issue or email dev@sigil-os.com (coming soon)*
