import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests-setup.js",
    coverage: {
      reportsDirectory: "./coverage",
      reporter: ["text", "json", "lcov", "json-summary"],
      all: true,
      include: ["src/**/*.jsx"],
      exclude: [
        "node_modules",
        "src/app.jsx",
        "src/router.jsx",
        "src/main.jsx",
      ],
    },
  },
})
