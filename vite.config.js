import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from "vite-plugin-pwa";

const manifestForPlugin = {
  registerType:"prompt",
  includeAssets: ["yampi.ico", "yampi.png"],
  manifest: {
    "short_name": "Yampi",
    "name": "Yampi Helados App",
    "icons": [
      {
        "src": "yampi.ico",
        "sizes": "64x64 32x32 24x24 16x16",
        "type": "image/x-icon"
      },
      {
        "src": "yampi.png",
        "type": "image/png",
        "sizes": "512x512"
      }
    ],
    "start_url": ".",
    "display": "standalone",
    "theme_color": "#000000",
    "background_color": "#ffffff"
  }
}

// https://vitejs.dev/config/
// export default defineConfig({
//   define: {
//     'process.env.SOME_KEY': JSON.stringify(env.SOME_KEY)
//   },
//   plugins: [react(), VitePWA(manifestForPlugin)],
// })

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env': env
    },
    plugins: [react(), VitePWA(manifestForPlugin)],
  }
})