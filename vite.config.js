// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    allowedHosts: ['web-logistics-143596276526.us-central1.run.app', 'web-purchases-143596276526.us-central1.run.app', 'web-sales-143596276526.us-central1.run.app', 'web-sellers-143596276526.us-central1.run.app']
  }
})