import { createStore } from "vuex";

import BrandStore from "@/store/brand";

import HomeStore from "@/store/home";

import ChatStore from "@/store/chat";

const store = createStore({
  state: {},
  getters: {},
  mutations: {
    SOCKET_welcome(state, data) {
      console.log("vuex-wel");
    },
    SOCKET_login(state, data) {
      // console.log(state.ChatStore);
      // state.ChatStore.userList = data;
    },
    SOCKET_updateMessage(state, data) {
      // console.log(data);
    },
  },
  actions: {},
  modules: {
    BrandStore,
    HomeStore,
    ChatStore,
  },
});

export function myStore() {
  return store;
}
export default store;
