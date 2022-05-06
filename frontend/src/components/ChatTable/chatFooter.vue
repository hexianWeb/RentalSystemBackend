<template>
  <div>
    <el-input
      placeholder="请输入内容 "
      v-model="input"
      @keyup.enter="send"
    ></el-input>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { ref, inject, computed } from "vue";
import moment from "moment";
export default {
  name: "chatFooter",
  props: {
    AdminInfo: Object,
  },
  setup(props) {
    const store = useStore();
    const input = ref("");
    const socket = inject("socket");
    const AdminInfo = props.AdminInfo;
    function send() {
      // 图片格式
      const img = encodeURI(`http://localhost:3001/img/${AdminInfo.avatar}`);
      // 发消息前先判断是群聊还是私聊
      if (store.state.ChatStore.chatType == "group") {
        let data = {
          type: "my",
          sender: props.AdminInfo.user_name,
          senderImg: img,
          receiver: "默认群聊",
          time: moment(),
          msg: input.value,
        };
        socket.emit("groupChat", data);
        // 将自己的信息push到数组中
        // store.commit("ChatStore/SOCKET_updateMessage", data);
      } else {
        let userInfo = computed(() => {
          return store.state.ChatStore.userInfo;
        });
        let data = {
          type: "my",
          sender: props.AdminInfo.user_name,
          senderImg: img,
          receiver: userInfo.value.name,
          time: moment(),
          msg: input.value,
        };
        socket.emit("privateChat", data);
        store.commit("ChatStore/SOCKET_updateMessage", data);
        console.log("私聊");
      }

      input.value = "";
    }
    return {
      input,
      send,
    };
  },
};
</script>

<style></style>
