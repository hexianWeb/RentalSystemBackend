<template>
  <div class="manage">
    <!-- 弹出属性菜单 -->
    <!-- <el-dialog
      :title="operateType === 'add' ? '新增用户' : '编辑用户'"
      v-model="isShow"
      append-to-body
    > -->
    <!-- <UserForm
        @closeForm="closeForm"
        @submitForm="confirm"
        :operateForm="operateForm"
      /> -->
    <!-- </el-dialog> -->
    <!-- 头部组件 -->
    <div class="manage-header">
      <!-- <el-button type="primary" @click="addEstate">✚ 新增</el-button> -->
      <el-input
        v-model="input"
        placeholder="请输入用户名或者编号进行查找哦"
        style="width: 400px"
      >
        <template #prepend> 🔍 </template
        ><template #append>
          <el-button type="primary">搜索</el-button>
        </template>
      </el-input>
    </div>
    <CommonTable
      :tableData="tableData"
      :tableLabel="tableLabel"
      :config="config"
      @edit="editUser"
      @delete="delUser"
      @changePage="changePage"
      @handlerSizeChange="handlerSizeChange"
    />
  </div>
</template>

<script>
// 引入公共表单组件
import UserForm from "@/components/UserForm";
import CommonTable from "@/components/CommonTable";
// 引入Element组件
import { ElMessage, ElMessageBox } from "element-plus";
// 引入vue常用方法
import { ref, onMounted, reactive } from "vue";
// 数据接口
import { reqUserAll, reqconfigPage } from "@/api";

export default {
  name: "user",
  components: { CommonTable, UserForm },
  setup() {
    // 变量
    const isShow = ref(false);
    const input = ref();
    const tableData = ref([]);

    // 方法

    // 初始化数据
    const InitList = async () => {
      const res_user = await reqUserAll();
      tableData.value = res_user.data;
      let page = await reqconfigPage();
      config.value.total = page.user_Page;
    };
    InitList();
    // 表单项规划
    const tableLabel = [
      { prop: "user_id", label: "用户编号", sortable: true },
      { prop: "user_name", label: "用户名称" },
      { prop: "sex", label: "性别" },
      { prop: "user_phone", label: "电话" },
      { prop: "user_email", label: "邮箱", width: "180" },
      { prop: "authStatus", label: "是否实名" },
      { prop: "add_time", label: "创建时间" },
      { prop: "avatar", label: "头像" },
    ];
    const config = ref({
      page: 1,
      pageSize: 5,
      total: 7,
    });
    // 对用户的操作
    function delUser() {
      ElMessageBox.confirm("删除操作或许是不可逆的，请谨慎操作", "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          ElMessage({
            type: "error",
            message: "您没有删除权限",
          });
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "已取消删除",
          });
        });
    }
    function editUser() {
      ElMessageBox.confirm("您正在对用户进行编辑权限", "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          ElMessage({
            type: "error",
            message: "您没有编辑权限",
          });
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "已取消删除",
          });
        });
    }

    // 分页管理方法
    // 改页
    async function changePage(page) {
      config.value.page = page;
      let offset =
        config.value.pageSize * config.value.page - config.value.pageSize;
      await getList(config.value.pageSize, offset);
    }
    async function handlerSizeChange(PageSize) {
      config.value.page = 1;
      config.value.pageSize = PageSize;
      await getList(PageSize, 0);
    }
    async function getList(limit = 10, offset = 0) {
      let res_user = await reqUserAll(limit, offset);
      tableData.value = res_user.data;
      return;
    }
    return {
      isShow,
      tableData,
      tableLabel,
      config,
      input,
      delUser,
      editUser,
      changePage,
      handlerSizeChange,
    };
  },
};
</script>

<style lang="less" scoped>
.manage {
  height: 100%;
  .manage-header {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
