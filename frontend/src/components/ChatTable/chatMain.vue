<template>
  <div class="div1">
    <!-- 循环找到聊天的人 -->
    <div v-for="(list, index) in msgList" :key="index">
      <!-- 群聊聊天记录 -->
      <div v-if="list.receiver == userInfo.name && userInfo.name == '默认群聊'">
        <!-- 用户聊天信息展示 -->
        <el-row class="userMsg">
          <el-tooltip
            v-model:visible="visible"
            class="box-item"
            effect="light"
            :content="list.msg"
            placement="right-start"
          >
            <el-avatar
              :size="48"
              :src="list.senderImg"
              style="float: left,margin-top:20px"
              v-if="list.type == 'user'"
            />
          </el-tooltip>
        </el-row>
        <!-- 自身聊天信息展示 -->
        <el-row class="MyMsg" justify="end">
          <el-tooltip
            v-model:visible="visible"
            class="box-item"
            effect="light"
            :content="list.msg"
            placement="left-end"
          >
            <el-avatar
              :size="48"
              style="float: right"
              :src="Myavatar"
              v-if="list.type == 'my'"
            />
          </el-tooltip>
        </el-row>
      </div>
      <!-- 有聊天记录铺聊天记录 -->
      <div
        v-else-if="
          (list.receiver == AdminInfo.user_name &&
            list.sender == userInfo.name) ||
          (list.receiver == userInfo.name && list.sender == AdminInfo.user_name)
        "
      >
        <!-- 用户聊天信息展示 -->
        <el-row class="userMsg">
          <el-tooltip
            v-model:visible="visible"
            class="box-item"
            effect="light"
            :content="list.msg"
            placement="right-start"
          >
            <el-avatar
              :size="48"
              :src="list.senderImg"
              style="float: left"
              v-if="list.type == 'user'"
            />
          </el-tooltip>
        </el-row>
        <!-- 自身聊天信息展示 -->
        <el-row class="MyMsg" justify="end">
          <el-tooltip
            v-model:visible="visible"
            class="box-item"
            effect="light"
            :content="list.msg"
            placement="left-end"
          >
            <el-avatar
              :size="48"
              style="float: right"
              :src="Myavatar"
              v-if="list.type == 'my'"
            />
          </el-tooltip>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, toRefs, ref, toRaw, onActivated, onDeactivated } from "vue";
import { useStore } from "vuex";
export default {
  name: "ChatMain",
  setup() {
    //   常开受控
    const visible = ref(false);
    const store = useStore();
    // const msgList = [];
    onActivated(() => {
      visible.value = !visible.value;
    });
    onDeactivated(() => {
      visible.value = !visible.value;
    });
    const msgList = computed(() => {
      return store.state.ChatStore.chatMessageList;
    });
    // 获取AdminInfo头像
    let AdminInfo = toRaw(store.state.HomeStore.adminInfo);
    let Myavatar = encodeURI(`http://localhost:3001/img/${AdminInfo.avatar}`);
    let userInfo = computed(() => {
      return store.state.ChatStore.userInfo;
    });

    return { msgList, userInfo, visible, Myavatar, AdminInfo };
  },
};
</script>

<style></style>
