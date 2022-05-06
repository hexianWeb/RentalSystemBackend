export default {
  namespaced: true,
  state: {
    // 聊天方式
    chatType: "",
    //   个人信息
    myInfo: {
      Img: "",
      name: "",
    },
    // 他人信息
    userInfo: {
      img: "",
      name: "",
    },
    // 用户列表
    userList: [],
    // 聊天记录
    chatMessageList: [
      // {
      //   sender: "", //发送者ID
      //   receiver: "", //接受者ID
      //   time: "", //发送时间
      //   msg: "发送内容",
      // },
    ],
  },
  mutations: {
    CHANGECHATTYPE(state, data) {
      state.chatType = data;
    },
    // 点击头像打开聊天室
    SETUSERINFO(state, data) {
      console.log("SETUSERINFO已被执行");
      state.userInfo = data;
    },
    SOCKET_login(state, data) {
      state.userList = data;
    },
    // 更新聊天记录
    SOCKET_updateMessage(state, data) {
      console.log(data);
      state.chatMessageList.push(data);
      // console.log(data);
      // var findUser = false;
      // state.chatMessageList.forEach((list) => {
      //   if (list.username == data.username) {
      //     findUser = true;
      //     list.list.push(data.list);
      //   }
      // });
      // if (!findUser) {
      //   state.chatMessageList.push({
      //     username: data.username,
      //     list: [data.list],
      //   });
      // }
    },
  },
  actions: {},
};
