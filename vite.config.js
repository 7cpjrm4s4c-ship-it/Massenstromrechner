import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ⚠️ WICHTIG: Passe "base" an deinen GitHub-Repo-Namen an!
// Wenn dein Repo "massenstrom-rechner" heißt → base: '/massenstrom-rechner/'
// Wenn du eine eigene Domain nutzt → base: '/'
export default defineConfig({
  base: '/massenstrom-rechner/',
  plugins: [react()]
})
