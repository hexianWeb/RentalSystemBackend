import { createRouter, createWebHistory } from "vue-router";
import { useStore } from "vuex";
import { myStore } from "@/store";
import { useCookies } from "vue3-cookies";
const whiteList = ["/login"];
const routes = [
  {
    path: "/",
    name: "Main",
    redirect: "/home",
    component: () => import("../views/Main.vue"),
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("../views/Home"),
      },
      {
        path: "user",
        name: "user",
        component: () => import("../views/User"),
      },
      {
        path: "estate",
        name: "estate",
        component: () => import("../views/Estate"),
      },
      {
        path: "house",
        name: "house",
        component: () => import("../views/House"),
      },
      {
        path: "spect",
        name: "spect",
        component: () => import("../views/Spect"),
        meta: {
          keepAlive: true,
        },
      },
      {
        path: "chat",
        name: "chat",
        component: () => import("../views/Chat"),
        meta: {
          keepAlive: true,
        },
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
// TODO: 权限管理;
router.beforeEach((to, from, next) => {
  const store = myStore();
  const { cookies } = useCookies();
  // console.log(store.getters["HomeStore/token"]);
  // 如果不存在token 说明用户未登录
  if (cookies.get("SID")) {
    // if (store.getters["HomeStore/token"] == "") {
    store.dispatch("HomeStore/getAdminInfo");
    // }
    if (to.path === "/login") {
      next({ path: "/home" });
    } else {
      next();
    }
  } else {
    console.log("用户未登录");
    // 白名单允许放行
    if (whiteList.includes(to.path)) {
      next();
    } else {
      next("/login");
    }
  }
});
export default router;
