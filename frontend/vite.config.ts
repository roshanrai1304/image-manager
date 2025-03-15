import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // This ensures that all routes are redirected to index.html
    // so React Router can handle them
    historyApiFallback: true,
  },
}); 