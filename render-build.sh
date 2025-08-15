#!/bin/bash
set -e

echo "==============================================="
echo "Starting enhanced build process for Render..."
echo "==============================================="

# Print Node and npm versions
echo "Node version:"
node --version
echo "npm version:"
npm --version

# Print environment info
echo "==============================================="
echo "Environment variables (sanitized):"
env | grep -v -E "TOKEN|SECRET|PASSWORD|KEY" | sort

# Check for package.json
echo "==============================================="
echo "Checking for package.json..."
if [ -f "package.json" ]; then
  echo "✅ package.json found"
  echo "package.json contents:"
  cat package.json
else
  echo "❌ package.json not found"
  exit 1
fi

# Install dependencies with detailed logging
echo "==============================================="
echo "Installing dependencies..."
npm install --verbose --legacy-peer-deps || { echo "❌ npm install failed"; exit 1; }

# Run build with detailed logging
echo "==============================================="
echo "Running build..."
npm run build --verbose || { echo "❌ build failed"; exit 1; }

# Verify build output
echo "==============================================="
echo "Verifying build output..."
if [ -d "dist" ]; then
  echo "✅ dist directory exists"
  echo "Contents of dist directory:"
  ls -la dist/
  
  if [ -f "dist/index.html" ]; then
    echo "✅ index.html exists in dist directory"
  else
    echo "❌ index.html does not exist in dist directory"
    exit 1
  fi
else
  echo "❌ dist directory does not exist"
  exit 1
fi

echo "==============================================="
echo "Build process completed successfully!"
echo "==============================================="
