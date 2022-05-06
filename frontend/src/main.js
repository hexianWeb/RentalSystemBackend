import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueCookies from "vue-cookies";

import i18n from "@/i18n";
// 引入ElmentUI
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
// 使用animations 动画
import "animate.css";
// 引入icon的css图标
import "@/assets/icon/iconfont.css";
// 将侧方导航作为全局中间件进行引入
import TypeNav from "@/components/TypeNav/index.vue";

import Brand from "@/components/Brand";

// 引入io插件
import VueSocketIO from "vue-3-socket.io";
import SocketIO from "socket.io-client";
// import Socketio from "@/plugins/socket.io";

const app = createApp(App);
app
  .component("TypeNav", TypeNav)
  .component("Brand", Brand)
  .use(ElementPlus)
  .use(VueCookies)
  .use(i18n)
  .use(store)
  .use(router)
  // 单独
  .use(
    new VueSocketIO({
      debug: true,
      connection: SocketIO("http://127.0.0.1:8082"),
      extraHeaders: { "Access-Control-Allow-Origin": "*" },
      // 自动连接
      options: {
        autoConnect: false,
      },
      vuex: {
        store,
        actionPrefix: "SOCKET_",
        mutationPrefix: "SOCKET_",
      },
    })
  );
// 全局
// .use(Socketio, {
//   connection: "http://127.0.0.1:8082",
//   // debug: true,
//   // extraHeaders: { "Access-Control-Allow-Origin": "*" },
//   // 自动连接
//   options: {
//     autoConnect: false,
//   },
// vuex: {
//   store,
//   actionPrefix: "SOCKET_",
//   mutationPrefix: "SOCKET_",
// },
// });
// Object.keys(icons).forEach((key) => {
//   app.component(key, icons[key]);
// });
app.mount("#app");

// axios.defaults.withCredentials = true;
