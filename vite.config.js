import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// ⚠️ WICHTIG: Passe "base" an deinen GitHub-Repo-Namen an!
// Wenn dein Repo "massenstrom-rechner" heißt → base: '/massenstrom-rechner/'
// Wenn du eine eigene Domain nutzt → base: '/'
export default defineConfig({
  base: '/massenstrom-rechner/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Massenstrom Rechner',
        short_name: 'Massenstrom',
        description: 'HVAC Massenstrom-Rechner für Heizung & Kühlung',
        theme_color: '#171b26',
        background_color: '#171b26',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        scope: './',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})
