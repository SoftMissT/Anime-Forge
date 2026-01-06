import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // @ts-ignore: process.cwd() is valid in Vite config
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
    define: {
      // Robust polyfill for process.env to avoid runtime crashes
      'process.env': JSON.stringify(env),
      // Fix for some libraries that check for global
      global: 'window',
    },
    server: {
      port: 3000,
    },
    build: {
      outDir: 'dist',
    }
  };
});