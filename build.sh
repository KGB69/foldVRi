#!/bin/bash
echo "Starting build process..."
npm ci
npm run build
echo "Build completed. Contents of dist directory:"
ls -la dist/
