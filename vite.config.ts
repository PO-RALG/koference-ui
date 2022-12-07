import { defineConfig, loadEnv } from "vite";
import Components from "unplugin-vue-components/vite";
import { VuetifyResolver } from "unplugin-vue-components/resolvers";
import vue from "@vitejs/plugin-vue2";
import viteCompression from "vite-plugin-compression";
import { resolve } from "path";
import dayjs from "dayjs";
import pkg from "./package.json";
import { viteSingleFile } from "vite-plugin-singlefile";
import { VitePluginFonts } from "vite-plugin-fonts";

const OUTPUT_DIR = "dist";
const root = process.cwd();

const { dependencies, devDependencies, name, version } = pkg;

const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
};

/** @type {import('vite').UserConfig} */
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    base: process.env.VITE_APP_PUBLIC_PATH,
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
        algorithm: "gzip",
      }),
      viteSingleFile(),
      VitePluginFonts({
        google: {
          families: ["Lato"],
        },
      }),
    ],
    server: {
      port: process.env.VITE_APP_PORT || 3000,
    },
    build: {
      target: "es2015",
      cssTarget: "chrome80",
      outDir: OUTPUT_DIR,
      chunkSizeWarningLimit: 2000,
    },
  });
};
