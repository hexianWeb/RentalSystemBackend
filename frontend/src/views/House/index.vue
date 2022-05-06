<template>
  <div class="manage">
    <!-- 弹出属性菜单 -->
    <el-dialog
      :title="operateType === 'add' ? '新增房屋' : '更新房屋'"
      v-model="isShow"
      append-to-body
    >
      <HouseForm
        v-if="isShow"
        @closeForm="closeForm"
        @submitForm="confirm"
        :operateForm="operateForm"
        :estate_id="LockedEstate"
      />
    </el-dialog>
    <div class="manage-header">
      <el-button type="primary" @click="addHouse">✚ 新增</el-button>
      <el-input
        placeholder="Please input"
        class="input-with-select"
        style="width: 400px"
      >
        <template #prepend>
          <el-select v-model="select" placeholder="Select" style="width: 115px">
            <el-option label="Restaurant" value="1" />
            <el-option label="Order No." value="2" />
            <el-option label="Tel" value="3" />
          </el-select>
        </template>
        <template #append> 🔍 </template>
      </el-input>
    </div>
    <el-divider />
    <div class="manage-body">
      <!-- 左侧小区列表 -->
      <el-row>
        <el-col :span="3">
          <!-- 小区列表展示 -->
          <el-menu>
            <el-menu-item @click="clearEstate"> 全部 </el-menu-item>
            <el-menu-item
              v-for="item in ListData"
              :key="item.estate_id"
              :index="item.estate_id"
              @click="clickMenu(item.estate_id)"
              style="text-align: center"
            >
              {{ item.estate_title }}
            </el-menu-item>
          </el-menu>
        </el-col>
        <!-- 对应房屋展示 -->
        <el-col :span="21">
          <CommonTable
            :tableData="tableData"
            :tableLabel="tableLabel"
            :config="config"
            @changePage="changePage"
            @edit="editHouse"
            @delete="delHouse"
            @handlerSizeChange="handlerSizeChange"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import CommonTable from "@/components/CommonTable";
import HouseForm from "@/components/HouseForm";
import { ElMessage, ElMessageBox } from "element-plus";

import { ref, toRaw, reactive } from "vue";
// 数据接口
import {
  reqEstateAll,
  reqHouseAll,
  reqHouseByEstate_id,
  reqAddHouseByEstate_id,
  reqconfigPage,
  reqDeleteHouse,
} from "@/api";

export default {
  name: "house",
  components: { CommonTable, HouseForm },
  setup() {
    const operateType = ref("add");
    const operateForm = reactive({
      data: {
        title: "",
        rent: "",
        useArea: "",
        floor: 1,
        orientataion: "",
        rentMethod: "",
        paymentMethod: "",
        type: [],
        pic: "",
        estate_id: "",
      },
    });
    const isShow = ref(false);
    const input = ref("");
    // 当前选中的地产编号
    const LockedEstate = ref();
    const tableData = ref([]);
    const ListData = ref([]);
    //#region
    // 数据初始化
    const InitList = async () => {
      let res_house = await reqHouseAll();
      let res_estate = await reqEstateAll(100, 0);
      ListData.value = res_estate.data;
      tableData.value = res_house.data;
      // console.log(tableData);

      let page = await reqconfigPage();
      config.value.total = page.house_page;
    };
    InitList();
    // 表单项
    //#region
    const tableLabel = [
      {
        prop: "house_id",
        label: "房屋编号",
        sortable: true,
      },
      {
        prop: "title",
        label: "房屋名称",
      },
      {
        prop: "rent",
        label: "租金",
        sortable: true,
      },
      { prop: "rentMethod", label: "租赁方式" },
      { prop: "paymentMethod", label: "租房手段" },
      { prop: "housetype", label: "基础设施", width: "240" },
      { prop: "useArea", label: "房屋面积" },
      { prop: "floor", label: "所在楼层" },
      { prop: "orientataion", label: "朝向" },
      { prop: "pic", label: "详情图片" },
      { prop: "status", label: "占用情况" },
    ];
    //#endregion
    // 页面配置项
    const config = ref({
      page: 1,
      pageSize: 5,
      total: 13,
    });
    //#endregion
    // 新增房屋
    function addHouse() {
      isShow.value = true;
      operateType.value = "add";
    }
    function editHouse(index, data) {
      operateType.value = "edit";
      isShow.value = true;
      // TODO: 回显数据
      operateForm.data = data;
    }
    function delHouse(index, data) {
      const estate_id = LockedEstate.value;
      const house_id = data.house_id;
      ElMessageBox.confirm("删除操作不可逆，请注意操作", "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          reqDeleteHouse(house_id, estate_id);
          getList(config.value.pageSize, 0, LockedEstate.value);
          ElMessage({
            type: "success",
            message: "删除成功",
          });
        })
        .catch(() => {
          ElMessage({ type: "info", message: "已取消删除" });
        });
    }
    // 点击确认
    async function confirm(value) {
      if (operateType.value == "edit") {
        isShow.value = false;
        await reqHouseEdit(value);
        ElMessage({
          type: "success",
          message: "编辑成功",
        });
      } else {
        isShow.value = false;
        // console.log(value);
        await reqAddHouseByEstate_id(toRaw(value));
        ElMessage({
          type: "success",
          message: "添加成功",
        });
      }
      getList(config.value.pageSize, 0, LockedEstate.value);
    }
    function closeForm() {
      isShow.value = false;
    }
    // 根据estate_id 获取列表内容
    async function clickMenu(id) {
      LockedEstate.value = id;
      await getList(10, 0, id);
    }
    async function getList(limit = 10, offset = 0, estate_id = -1) {
      let res_house = await reqHouseByEstate_id(limit, offset, estate_id);
      tableData.value = res_house.data[0].house;
      // 设置标签页
      config.value.total = res_house.data[0].house.length;
      return;
    }
    async function clearEstate() {
      LockedEstate.value = -1;
      InitList();
    }
    return {
      isShow,
      operateType,
      operateForm,
      ListData,
      tableData,
      config,
      tableLabel,
      LockedEstate,
      addHouse,
      clickMenu,
      closeForm,
      confirm,
      editHouse,
      delHouse,
      clearEstate,
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
    justify-content: space-between;
    align-items: center;
  }
  .manage-body {
    margin-top: 20px;
    height: 100%;
  }
}
.el-row {
  height: 100%;
}
.el-menu {
  height: 90%;
}
</style>
