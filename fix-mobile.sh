#!/bin/bash
# SIGIL OS - Mobile App Installation Script
# Fixes common mobile app build issues

echo "========================================"
echo "SIGIL OS - Mobile App Setup"
echo "========================================"
echo ""

# Check Node.js
echo "[1/6] Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install from https://nodejs.org"
    exit 1
fi
node --version
echo "✅ Node.js installed"
echo ""

# Check npm
echo "[2/6] Checking npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found"
    exit 1
fi
npm --version
echo "✅ npm installed"
echo ""

# Check Expo CLI
echo "[3/6] Checking Expo CLI..."
if ! command -v expo &> /dev/null; then
    echo "Expo CLI not found. Installing..."
    npm install -g expo-cli
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Expo CLI"
        exit 1
    fi
fi
expo --version
echo "✅ Expo CLI installed"
echo ""

# Navigate to mobile directory
echo "[4/6] Navigating to mobile directory..."
cd sigil-mobile || {
    echo "❌ sigil-mobile directory not found"
    exit 1
}
echo "✅ In sigil-mobile directory"
echo ""

# Install dependencies
echo "[5/6] Installing dependencies..."
if [ -d "node_modules" ]; then
    echo "Removing existing node_modules..."
    rm -rf node_modules
fi
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    echo "Trying with legacy peer deps..."
    npm install --legacy-peer-deps
fi
echo "✅ Dependencies installed"
echo ""

# Clear Metro cache
echo "[6/6] Clearing Metro cache..."
npx expo start --clear
echo "✅ Metro cache cleared"
echo ""

echo "========================================"
echo "Mobile app setup complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Run: npm start"
echo "2. Scan QR code with Expo Go app"
echo "3. Or run: eas build --platform android"
echo ""
