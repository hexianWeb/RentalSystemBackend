<template>
  <div class="manage">
    <!-- 弹出属性菜单 -->
    <el-dialog
      :title="operateType === 'add' ? '新增地产' : '更新地产'"
      v-model="isShow"
      append-to-body
    >
      <EstateForm
        v-if="isShow"
        @closeForm="closeForm"
        @submitForm="confirm"
        :operateForm="operateForm"
        :operateType="operateType"
      />
    </el-dialog>
    <!-- 头部组件 -->
    <div class="manage-header">
      <el-button type="primary" @click="addEstate">✚ 新增</el-button>
      <el-input v-model="input" placeholder="Please input" style="width: 400px">
        <template #prepend> 🔍 </template
        ><template #append>
          <el-button type="primary" @click="searchEstate">搜索</el-button>
        </template>
      </el-input>
    </div>
    <CommonTable
      :tableData="tableData"
      :tableLabel="tableLabel"
      :config="config"
      @changePage="changePage"
      @edit="editEstate"
      @delete="delEstate"
      @handlerSizeChange="handlerSizeChange"
    />
  </div>
</template>

<script>
// component
import EstateForm from "@/components/EstateForm";
import CommonTable from "@/components/CommonTable";
// Element组件引入
import { ElMessage, ElMessageBox } from "element-plus";
// 转码中间件
import { TextToCode } from "element-china-area-data";
// 引入常用方法
import { ref, onMounted, reactive } from "vue";
// 数据接口
import {
  reqEstateAll,
  reqAddEstate,
  reqDeleteEstate,
  reqEstateEdit,
  reqSearchEstate,
  reqconfigPage,
} from "@/api";
export default {
  name: "estate",
  components: { EstateForm, CommonTable },

  setup() {
    const operateType = ref("add");
    const operateForm = ref({
      estate_title: "",
      province: "",
      city: "",
      area: "",
      selectedOptions: [],
      address: "",
      created: "",
      type: [],
      desc: "",
    });
    let isShow = ref(false);
    // 搜索框
    const input = ref("");
    // 表格数据
    const tableData = ref([]);
    // 初始化数据
    const InitList = async () => {
      const res_estate = await reqEstateAll();
      tableData.value = res_estate.data;
      let page = await reqconfigPage();
      config.value.total = page.estate_page;
    };
    InitList();
    // 表单项
    const tableLabel = [
      { prop: "estate_id", label: "地产编号", sortable: true },
      {
        prop: "estate_title",
        label: "地产名称",
      },
      {
        prop: "province",
        label: "省",
        sortable: true,
      },
      {
        prop: "city",
        label: "市",
      },
      {
        prop: "area",
        label: "区",
      },
      {
        prop: "address",
        label: "详细地址",
        width: "260",
      },
      {
        prop: "type",
        label: "标签",
        width: "200",
      },
      {
        prop: "desc",
        label: "描述",
        width: "200",
      },
    ];
    // 页面配置项
    const config = ref({
      page: 1,
      pageSize: 5,
      total: 7,
    });

    // 弹出form组件
    function addEstate() {
      isShow.value = true;
      operateType.value = "add";
    }
    //
    async function confirm(value) {
      // TODO: 编辑操作
      if (operateType.value == "edit") {
        isShow.value = false;
        await reqEstateEdit(value);
        ElMessage({
          type: "success",
          message: "编辑成功",
        });
      } else {
        // todo: 发送新增信息到新增接口
        isShow.value = false;
        await reqAddEstate(value);
        ElMessage({
          type: "success",
          message: "添加成功",
        });
      }
      getList();
    }
    // 关闭表单
    function closeForm() {
      isShow.value = false;
    }
    // 修改功能
    function editEstate(index, data) {
      console.log(data);
      operateType.value = "edit";
      isShow.value = true;
      operateForm.value = data;
      operateForm.value.selectedOptions =
        TextToCode[data.province][data.city][data.area].code;
      operateForm.value.estate_id = data.estate_id;
    }
    // 刪除
    function delEstate(index, data) {
      const estate_id = data.estate_id;
      ElMessageBox.confirm("删除操作或许是不可逆的，请谨慎操作", "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          reqDeleteEstate(estate_id);
          ElMessage({
            type: "success",
            message: "删除成功",
          });
          getList();
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
      // console.log(config.value.page);
      config.value.page = page;
      let offset =
        config.value.pageSize * config.value.page - config.value.pageSize;
      await getList(config.value.pageSize, offset);
    }
    // 分页
    async function handlerSizeChange(PageSize) {
      config.value.page = 1;
      config.value.pageSize = PageSize;
      await getList(PageSize, 0);
      return;
    }
    // 限制条数 limit 跳过条数offset
    async function getList(limit = 10, offset = 0) {
      let res_estate = await reqEstateAll(limit, offset);
      tableData.value = res_estate.data;

      let page = await reqconfigPage();
      config.value.total = page.estate_page;
      return;
    }

    async function searchEstate() {
      if (input.value == "") {
        getList();
        return;
      }
      let res_estate = await reqSearchEstate(input.value);
      tableData.value = res_estate.data;
      return;
    }
    return {
      operateType,
      isShow,
      // 表单数据部分
      tableData,
      tableLabel,
      input,
      config,
      operateForm,
      addEstate,
      confirm,
      editEstate,
      delEstate,
      getList,
      closeForm,
      changePage,
      handlerSizeChange,
      searchEstate,
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
}
</style>
