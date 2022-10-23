import path from "path";
import { defineConfig } from "vite";
import Components from "unplugin-vue-components/vite";
import { VuetifyResolver } from "unplugin-vue-components/resolvers";
import vue from "@vitejs/plugin-vue2";

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
  ],
  server: {
    port: 4000,
  },
});
