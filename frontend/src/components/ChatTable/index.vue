<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="300px"><ChatAside :AdminInfo="AdminInfo" /></el-aside>
      <el-container>
        <el-header>{{
          userInfo.name ? userInfo.name : "点击用户进行聊天"
        }}</el-header>
        <el-main><ChatMain :AdminInfo="AdminInfo" /></el-main>
        <el-footer>
          <ChatFooter :AdminInfo="AdminInfo" />
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import ChatFooter from "./chatFooter.vue";
import ChatAside from "./chatAside.vue";
import ChatMain from "./chatMain.vue";
import { computed, onMounted, toRaw, inject, activated } from "vue";
import { useStore } from "vuex";
export default {
  name: "ChatTable",
  components: { ChatFooter, ChatAside, ChatMain },
  activated() {
    console.log("chat被执行");
  },
  deactivated() {
    console.log("chat被卸载");
  },

  setup() {
    // 玄学代码
    const socket = inject("socket");
    const store = useStore();
    // const socket = io();
    // (修正)登陆之后，管理员加入聊天室，且CHATASIDE会调用SETINFO 的MUTATION 但是仅仅一次
    const AdminInfo = store.state.HomeStore.adminInfo;
    onMounted(() => {
      socket.emit(
        "addAdmin",
        {
          id: AdminInfo._id,
          name: AdminInfo.user_name,
          img: AdminInfo.avatar,
        },
        (response) => {
          // 事件回调
          console.log(response);
        }
      );
    });
    let userInfo = computed(() => {
      return store.state.ChatStore.userInfo;
    });

    return { userInfo, AdminInfo };
  },
};
</script>
<style scoped>
.common-layout {
  /* padding: 100px; */
  margin-top: 75px;
  width: 100%;
  height: calc(100%-100px);
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  /* width: 100%; */
  color: #333;
  text-align: center;
  height: 600px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  height: 280px;
}

body > .el-container {
  margin-bottom: 40px;
}
</style>
