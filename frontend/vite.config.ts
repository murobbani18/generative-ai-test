import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Muat variabel lingkungan
  const env = loadEnv(mode, process.cwd(), '');


  return {
    plugins: [react()],
    server: {
      // Gunakan port dari .env, atau fallback ke 5173 jika tidak ada
      port: parseInt(env.VITE_PORT, 10) || 5173,
    },
  };
});