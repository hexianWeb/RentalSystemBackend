<template>
  <div class="manage">
    <div class="manage-header">
      <el-dialog title="更改订单状态" v-model="isShow" append-to-body>
        <SpectForm
          v-if="isShow"
          @closeForm="closeForm"
          @submitForm="confirm($event, index)"
        />
      </el-dialog>
      <el-input
        placeholder="Please input"
        class="input-with-select"
        style="width: 400px"
      >
        <template #prepend> 搜索 </template>
        <template #append> 🔍 </template>
      </el-input>
    </div>
    <CommonTable
      :tableData="tableData"
      :tableLabel="tableLabel"
      :config="config"
      style="margin-top: 35px"
      @edit="editSpect"
    />
    <!-- @delete="delUser" @changePage="changePage" -->
    <!-- @handlerSizeChange="handlerSizeChange" -->
    -->
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from "element-plus";
import { ref, onMounted } from "vue";
import CommonTable from "@/components/CommonTable";
import SpectForm from "@/components/SpectForm";
import { reqSpectAll, reqconfigPage, reqChangeSpect } from "@/api";
export default {
  name: "spect",
  components: {
    CommonTable,
    SpectForm,
  },
  setup() {
    //   变量
    const tableData = ref([]);
    const operateSpect = ref();
    const input = ref();
    const isShow = ref(false);
    const config = ref({
      page: 1,
      pageSize: 5,
      total: 0,
    });
    //#region
    const tableLabel = [
      {
        prop: "spect_id",
        label: "订单号",
        sortable: true,
      },
      {
        prop: "house_id",
        label: "房屋编号",
      },
      {
        prop: "user_id",
        label: "用户编号",
      },
      {
        prop: "status",
        label: "订单状态",
        width: "180",
      },
      {
        prop: "seeTime",
        label: "看房时间",
        sortable: true,
      },
      {
        prop: "money",
        label: "订单金额",
        sortable: true,
      },
      {
        prop: "created",
        label: "创建时间",
        sortable: true,
      },
      {
        prop: "user_realName",
        label: "用户真实姓名",
      },
      {
        prop: "user_phone",
        label: "用户电话",
        width: "180",
      },
    ]; //#endregion
    onMounted(async () => {
      await getList();
    });
    async function confirm(flag) {
      // alert(flag);
      //#region
      switch (flag) {
        case 0:
          ElMessage({
            message: "您没有权限生成订单",
            type: "info",
          });
          break;
        case 1:
          ElMessage({
            message: "订单状态更新为占用",
            type: "warning",
          });
          break;
        case 2:
          ElMessage({
            message: "订单状态更新为成功",
            type: "success",
          });
          break;
        case 3:
          ElMessage({
            message: "订单状态更新为失败",
            type: "error",
          });
          break;
      }

      isShow.value = false;
      let res = await reqChangeSpect(flag, operateSpect.value);
      console.log(res);
      //#endregion
      getList();
    }
    function editSpect(index, data) {
      isShow.value = true;
      operateSpect.value = data.spect_id;
    }
    async function getList(limit = 10, offset = 0) {
      let res = await reqSpectAll(limit, offset);
      tableData.value = res.data;
      let page = await reqconfigPage();
      config.value.total = page.spect_page;
      return;
    }
    return {
      tableLabel,
      tableData,
      input,
      config,
      isShow,
      operateSpect,
      confirm,
      editSpect,
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
