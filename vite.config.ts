import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      img: "/src/images",
      hooks: "/src/hooks",
      interfaces: "/src/interfaces",
      '~bootstrap': 'node_modules/bootstrap',
    }
  }
})
