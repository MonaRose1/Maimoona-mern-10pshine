import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src"),
      "@components": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src/components"),
      "@ui": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src/components/ui"),
      "@Shared": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src/Shared"),
    },
  },
})
