#!/bin/bash
set -e

echo "==============================================="
echo "Starting enhanced build process for Render..."
echo "==============================================="

# Print Node and npm versions
echo "==============================================="
echo "Environment Information:"
echo "Node version: $(node -v)"
echo "npm version: $(npm -v)"
echo "Working directory: $(pwd)"
echo "Files in directory:"
ls -la

# Print environment info
echo "==============================================="
echo "Environment variables (sanitized):"
env | grep -v -E "TOKEN|SECRET|PASSWORD|KEY" | sort

# Check if package.json exists
echo "==============================================="
if [ -f "package.json" ]; then
  echo "✅ package.json found"
  echo "package.json contents:"
  cat package.json
else
  echo "❌ package.json not found"
  exit 1
fi

# Clean install - remove node_modules and package-lock.json
echo "==============================================="
echo "Cleaning previous installation..."
if [ -d "node_modules" ]; then
  echo "Removing node_modules directory"
  rm -rf node_modules
fi

if [ -f "package-lock.json" ]; then
  echo "Removing package-lock.json"
  rm package-lock.json
fi

# Install dependencies with detailed logging
echo "==============================================="
echo "Installing dependencies..."
npm install --verbose --legacy-peer-deps || { echo "❌ npm install failed"; exit 1; }

# Verify React installation
echo "==============================================="
echo "Verifying React installation..."
find node_modules/react -type f -name "*.js" | grep -v "node_modules/react/node_modules" || echo "⚠️ React files not found as expected"
find node_modules/react-dom -type f -name "*.js" | grep -v "node_modules/react-dom/node_modules" || echo "⚠️ React DOM files not found as expected"

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
