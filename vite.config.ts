import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import {visualizer} from "rollup-plugin-visualizer"
export default defineConfig({
  plugins: [react(), 
    visualizer({
      open: true,
      filename: "stats.html",
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
