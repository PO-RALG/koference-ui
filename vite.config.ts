import { defineConfig } from "vite";
import Components from "unplugin-vue-components/vite";
import { VuetifyResolver } from "unplugin-vue-components/resolvers";
import vue from "@vitejs/plugin-vue2";
import viteCompression from "vite-plugin-compression";
import { loadEnv } from "vite";
import { resolve } from "path";
import dayjs from "dayjs";
import pkg from "./package.json";
import { viteSingleFile } from "vite-plugin-singlefile"

const OUTPUT_DIR = "dist";
const root = process.cwd();

const { dependencies, devDependencies, name, version } = pkg;

const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
};

module.exports = defineConfig({
  base: "/",
  root,
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(__dirname, "src"),
      },
    ],
  },
  plugins: [
    vue(),
    Components({
      resolvers: [VuetifyResolver()],
    }),
    viteCompression({
      compressionOptions: {},
    }),
    viteSingleFile(),
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
