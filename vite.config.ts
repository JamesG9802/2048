import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],  
  //  https://vitejs.dev/guide/static-deploy
  //  https://github.com/sitek94/vite-deploy-demo
  base: '/2048'
})
