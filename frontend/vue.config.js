const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  // 关闭eslint
  lintOnSave: false,
  devServer: {
    // 允许默认socket跨域
    proxy: {
      "/socket.io": {
        target: "http://127.0.0.1:8082",
        ws: true,
        changeOrigin: true,
        pathRewrite: { "^/socket.io": "" },
      },
      "/api": {
        target: "http://127.0.0.1:3001",
      },
    },
  },
});
