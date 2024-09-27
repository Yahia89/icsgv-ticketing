// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/icsgv-ticketing/', // Add this line to tell Vite the correct base URL
  plugins: [react()],
});
