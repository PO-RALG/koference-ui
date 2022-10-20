const zlib = require("zlib");
const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: ["vuetify"],
  publicPath: "/",
  css: {
    extract: false,
  },
  configureWebpack: {
    optimization: {
      splitChunks: false,
    },
  },
  pages: {
    index: {
      // entry for the page
      entry: "src/main.ts",
      title: "Facility Financial Accounting and Reporting",
    },
  },
  pluginOptions: {
    compression: {
      modes: ["development", "production"],
      brotli: {
        filename: "[file].br[query]",
        algorithm: "brotliCompress",
        include: /\.(js|css|html|svg|json)(\?.*)?$/i,
        compressionOptions: {
          params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
          },
        },
        minRatio: 0.8,
      },
      gzip: {
        filename: "[file].gz[query]",
        algorithm: "gzip",
        include: /\.(js|css|html|svg|json)(\?.*)?$/i,
        minRatio: 0.8,
      },
    },
  },
});
