import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { URL, fileURLToPath } from 'node:url'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), UnoCSS(), basicSsl()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: true
    // proxy: {
    //   '/socket.io': {
    //     ws: true,
    //     target: 'ws://192.168.61.103:3000',
    //     rewrite: path => path.replace(/^\/socket.io/, '')
    //   }
    // }
  }
})
