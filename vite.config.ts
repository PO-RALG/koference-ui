import path from "path";
import { defineConfig } from "vite";
import Components from "unplugin-vue-components/vite";
import { VuetifyResolver } from "unplugin-vue-components/resolvers";
import vue from "@vitejs/plugin-vue2";
import viteCompression from "vite-plugin-compression";
const OUTPUT_DIR = "dist";

module.exports = defineConfig({
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "src"),
      },
    ],
  },
  plugins: [
    vue(),
    Components({
      resolvers: [VuetifyResolver()],
    }),
    viteCompression({
      algorithm: "gzip",
      verbose: false,
    }),
  ],
  server: {
    port: 4000,
  },
  build: {
    target: "es2015",
    cssTarget: "chrome80",
    outDir: OUTPUT_DIR,
    chunkSizeWarningLimit: 2000,
  },
});
