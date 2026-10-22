import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages отдаёт сайт из подкаталога /mini-figma/
  base: '/mini-figma/',
  plugins: [react()],
})
