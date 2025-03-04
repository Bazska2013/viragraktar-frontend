import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {tamaguiPlugin} from "@tamagui/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
      tamaguiPlugin({
          config: 'src/tamagui.config.ts',
          components: ['tamagui'],
          outputCSS: 'src/tamagui.css',
          optimize: true
      })
  ].filter(Boolean),
})
