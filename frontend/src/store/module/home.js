// API-http接口库
import { reqAdminInfo, reqAdminLogin } from "@/api";
import router from "@/router";
// 时间库引入函数
import moment from "moment";
// axios配套post解析
import Qs from "qs";

export default {
  namespaced: true,
  state: () => ({
    token: localStorage.getItem("SID") || "",
  }),
  mutations: {
    GETADMININFO(state, adminInfo) {
      state.adminInfo = adminInfo;
    },
  },
  actions: {
    LoginByUsername({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        // 解析序列化 发送给后端更好接收
        var data = Qs.stringify({
          user_name: user_name,
          user_password: user_password,
        });
        reqAdminLogin(data)
          .then((res) => {
            router.replace("/");
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  },
};
