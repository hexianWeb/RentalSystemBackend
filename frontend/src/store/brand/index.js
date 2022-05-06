export default {
  namespaced: true,
  state: {
    isCollapse: false,
    tablist: [
      {
        path: "/",
        name: "home",
        label: "首页",
      },
    ],
    currentMenu: null,
  },
  mutations: {
    collapseMenu(state) {
      state.isCollapse = !state.isCollapse;
    },
    selectMenu(state, val) {
      console.log(val);
      if (val.name !== "home") {
        state.currentMenu = val;
        const res = state.tablist.findIndex((item) => item.name === val.name);
        if (res == -1) {
          state.tablist.push(val);
        }
      } else {
        state.currentMenu = null;
      }
    },
  },
};
