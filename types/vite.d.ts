// This file provides mock type declarations to prevent build errors caused
// by the presence of a vite.config.ts file in a Next.js project.

declare module 'vite' {
  export function defineConfig(config: any): any;
  export function loadEnv(mode: string, envDir: string, prefixes?: string | string[]): Record<string, string>;
}

declare module '@vitejs/plugin-react' {
  const plugin: any;
  export default plugin;
}

// FIX: Add type definitions for Vite environment variables to resolve TypeScript errors.
interface ImportMetaEnv {
  readonly VITE_DISCORD_CLIENT_ID: string;
  readonly VITE_DISCORD_REDIRECT_URI: string;
  readonly VITE_GOOGLE_KEY: string;
  readonly VITE_GOOGLE_EMAIL: string;
  readonly VITE_SHEET_ID: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_TURSO_URL: string;
  readonly VITE_TURSO_TOKEN: string;
  readonly VITE_SUPABASE_FUNCTIONS_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}