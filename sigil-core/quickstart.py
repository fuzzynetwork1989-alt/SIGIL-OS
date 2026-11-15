#!/usr/bin/env python3
"""
Quick Start Script for SIGIL OS
Sets up environment and starts the backend
"""

import os
import sys
import subprocess
from pathlib import Path

def check_env_file():
    """Check if .env file exists and has API keys"""
    env_file = Path(__file__).parent / ".env"
    
    if not env_file.exists():
        print("❌ .env file not found!")
        print("\nCreating .env file from template...")
        
        template = """# SIGIL OS Environment Configuration
# Copy this to .env and fill in your values

# API Keys (Required for AI functionality)
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Application Settings
LOG_LEVEL=INFO
ENVIRONMENT=development
APP_URL=http://localhost:3000
API_URL=http://localhost:8000
"""
        
        env_file.write_text(template)
        print("✅ Created .env file")
        print("\n⚠️  IMPORTANT: You MUST add your API keys to .env before continuing!")
        print("\nTo get an OpenAI API key:")
        print("1. Go to https://platform.openai.com/")
        print("2. Sign up or log in")
        print("3. Go to API Keys section")
        print("4. Create a new API key")
        print("5. Add it to .env as: OPENAI_API_KEY=sk-...")
        print("\nThen run this script again.")
        return False
    
    # Check if API keys are set
    with open(env_file) as f:
        content = f.read()
    
    if "your_openai_api_key_here" in content:
        print("❌ OpenAI API key not set in .env")
        print("\nPlease edit .env and add your OPENAI_API_KEY")
        return False
    
    return True

def install_dependencies():
    """Install Python dependencies"""
    print("📦 Installing dependencies...")
    try:
        subprocess.run(
            [sys.executable, "-m", "pip", "install", "-r", "requirements.txt"],
            check=True,
            cwd=Path(__file__).parent
        )
        print("✅ Dependencies installed")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def start_backend():
    """Start the backend server"""
    print("🚀 Starting SIGIL OS Cognitive Kernel...")
    try:
        subprocess.run(
            [sys.executable, "-m", "sigil.main"],
            cwd=Path(__file__).parent
        )
    except KeyboardInterrupt:
        print("\n👋 SIGIL OS stopped")
    except Exception as e:
        print(f"❌ Failed to start backend: {e}")

def main():
    print("=" * 60)
    print("SIGIL OS - Quick Start")
    print("=" * 60)
    print()
    
    # Check environment
    if not check_env_file():
        sys.exit(1)
    
    # Install dependencies
    if not install_dependencies():
        sys.exit(1)
    
    # Start backend
    start_backend()

if __name__ == "__main__":
    main()
