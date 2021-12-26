const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  lintOnSave: true,
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin([
        {
          from: "node_modules/mavon-editor/dist/highlightjs",
          to: path.resolve(__dirname, "dist/highlightjs"), // 插件将会把文件导出于/dist/highlightjs之下
        },
        {
          from: "node_modules/mavon-editor/dist/markdown",
          to: path.resolve(__dirname, "dist/markdown"), // 插件将会把文件导出于/dist/markdown之下
        },
        {
          from: "node_modules/mavon-editor/dist/katex", // 插件将会把文件导出
          to: path.resolve(__dirname, "dist/katex"),
        },
      ]),
    ],

    resolve: {
      alias: {
        assets: "@/assets",
        network: "@/network",
        common: "@/common",
        components: "@/components",
        views: "@/views",
        lib: "@/lib",
        data: "@/data",
      },
    },
  },
};
