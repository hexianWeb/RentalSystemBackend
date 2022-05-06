<template>
  <div>
    <el-row style="height: 60px" justify="start">
      <!-- 我的信息 -->
      <div class="myinfo">
        <el-avatar :src="Myavatar"></el-avatar>
        <span style="margin-left: 20px">{{ AdminInfo.user_name }}</span>
      </div>
    </el-row>
    <!-- 搜索好友 -->
    <el-row style="height: 50px">
      <div style="width: 100%">
        <el-input v-model="keyword" placeholder="搜索好友">
          <template #append>
            <el-button> 🔍 </el-button>
          </template>
        </el-input>
      </div>
    </el-row>
    <!-- 好友列表 -->
    <el-row style="height: 390px">
      <el-table
        stripe
        style="width: 100%"
        :show-header="false"
        :data="
          tableData.filter(
            (data) =>
              (!keyword ||
                data.name.toLowerCase().includes(keyword.toLowerCase())) &&
              !data.name
                .toLowerCase()
                .includes(AdminInfo.user_name.toLowerCase())
          )
        "
      >
        <el-table-column label="日期">
          <template v-slot="scope">
            <div
              class="userlist"
              @click="handleUserInfo(scope.$index, scope.row)"
            >
              <el-avatar :src="scope.row.img"></el-avatar>
              <span>姓名: {{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
import { computed, ref, toRaw } from "vue";
import { useStore } from "vuex";

export default {
  props: {
    AdminInfo: Object,
  },
  name: "chatAside",
  setup(props) {
    // input搜索过滤
    const keyword = ref("");
    const store = useStore();
    // 管理员信息
    const AdminInfo = computed(() => {
      return store.state.HomeStore.adminInfo;
    });
    let Myavatar = encodeURI(
      `http://localhost:3001/img/${AdminInfo.value.avatar}`
    );
    // console.log(AdminInfo);
    // 聊天用户相关信息
    const userInfo = ref("");
    //#region
    const tableData = computed(() => {
      return store.state.ChatStore.userList;
    });
    //#endregion
    function handleUserInfo(index, data) {
      if (index == 0) {
        store.commit("ChatStore/CHANGECHATTYPE", "group");
      } else {
        store.commit("ChatStore/CHANGECHATTYPE", "private");
      }
      store.commit("ChatStore/SETUSERINFO", { name: data.name, Img: data.img });
    }
    return {
      keyword,
      tableData,
      Myavatar,
      AdminInfo,
      handleUserInfo,
    };
  },
};
</script>

<style lang="less" scoped>
.el-row {
  line-height: 24px;
  p {
    // color: red;
    font-size: 24px;
  }
}
.myinfo {
  text-align: left;
  vertical-align: middle;
  margin-top: 10px;
  margin-left: 10px;
  span {
    text-align: left;
    vertical-align: middle;
    font-size: 24px;
  }
}
.userlist {
  vertical-align: middle;
  cursor: pointer;
}
.userlist span {
  vertical-align: middle;
  margin-left: 10px;
}
</style>
