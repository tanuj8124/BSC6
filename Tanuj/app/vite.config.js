import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  theme: {
        extend: {
          keyframes: {
            gradient: {
              '0%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' },
              '100%': { backgroundPosition: '0% 50%' },
            },
          },
          animation: {
            gradient: 'gradient 8s linear infinite'
          },
        },
      },
  plugins: [react(), tailwindcss(),],
})
