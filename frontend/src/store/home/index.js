// API-http接口库
import { reqAdminInfo, reqAdminLogin } from "@/api";
import router from "@/router";
// 时间库引入函数
import moment from "moment";
// axios配套post解析
import Qs from "qs";

import { toRaw } from "vue";
const state = {
  adminInfo: {},
};

const mutations = {
  // FIXME: 意义不明
  // 存储Home页面列表信息（败笔）
  GETADMININFO(state, adminInfo) {
    console.log(adminInfo);
    state.adminInfo = adminInfo;
    // state.token = adminInfo.token;
  },
};
const actions = {
  // 获取当前用户信息
  async getAdminInfo({ commit }) {
    let res = await reqAdminInfo();
    res.data.loginTime = await moment().format("L");
    res.data.loginLocation = "江西-南昌";
    res.data.role;
    commit("GETADMININFO", res.data);
    return;
  },
  // 登录验证
  async LoginByUsername({ commit }, userInfo) {
    const { user_name, user_password } = userInfo;
    // 解析序列化 发送给后端更好接收
    var data = Qs.stringify({
      user_name: user_name,
      user_password: user_password,
    });
    let res = await reqAdminLogin(data);
    // 返回结果正常登录 获取登录角色个人信息
    if (res.status === 0) {
      let res = await reqAdminInfo();
      res.data.loginTime = await moment().format("L");
      // TODO: ip地理位置定位
      res.data.loginLocation = "江西-南昌";
      commit("GETADMININFO", res.data);
      router.replace("/");
    }
  },
};

const getters = {
  token(state) {
    const a = toRaw(state);
    return a;
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
