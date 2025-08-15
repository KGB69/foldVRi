import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // Use React plugin with proper configuration
      plugins: [react({
        // Use automatic JSX runtime
        jsxRuntime: 'automatic',
      })],
      
      // Base path - empty string for relative paths which works better for hosting
      base: '',
      
      // Define environment variables
      define: {
        // Only include API keys if they exist in the environment
        ...(env.GEMINI_API_KEY ? {
          'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
          'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
        } : {})
      },
      
      // Path aliases
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      
      // Build options
      build: {
        // Generate source maps for better debugging
        sourcemap: true,
        // Optimize chunks
        chunkSizeWarningLimit: 1600,
        rollupOptions: {
          output: {
            manualChunks: (id) => {
              // Create separate chunks for large dependencies
              if (id.includes('node_modules')) {
                if (id.includes('three')) return 'three-vendor';
                if (id.includes('react')) return 'react-vendor';
                return 'vendor';
              }
            }
          }
        }
      }
    };
});
