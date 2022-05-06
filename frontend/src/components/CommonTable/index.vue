<template>
  <div class="common-table">
    <el-table
      border
      v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tableData"
      height="90%"
      stripe
      table-layout="fixed"
      style="margin-left: 10px"
    >
      <!-- 超长不换行 -->
      <el-table-column
        align="center"
        show-overflow-tooltip
        header-align="center"
        v-for="item in tableLabel"
        :key="item.prop"
        :label="item.label"
        :width="item.width ? item.width : 125"
        :sortable="item.sortable ? item.sortable : false"
        :sort-by="item.sortable ? item.prop : ''"
      >
        <!-- TODO: vue3插槽 -->
        <template v-slot="scope">
          <span
            style="margin-left: 10px"
            v-if="
              item.prop != 'type' &&
              item.prop != 'avatar' &&
              item.prop != 'housetype' &&
              item.prop != 'pic' &&
              item.prop != 'status'
            "
          >
            {{ scope.row[item.prop] }}</span
          >
          <!-- 插槽 自定义内容 审核对应标签 渲染对应内容 -->

          <!-- 标签插槽判断 -->
          <div
            v-else-if="item.prop == 'type' || item.prop == 'housetype'"
            style="float: left"
            v-for="item in scope.row[item.prop]"
            :key="item.key"
          >
            <el-tag style="margin: 5px">{{ item }}</el-tag>
          </div>
          <div v-else-if="item.prop == 'status'">
            <el-tag class="ml-2" type="info" v-if="scope.row[item.prop] == 0"
              >空闲状态</el-tag
            >
            <el-tag class="ml-2" type="warning" v-if="scope.row[item.prop] == 1"
              >正在占用</el-tag
            >
            <el-tag class="ml-2" type="success" v-if="scope.row[item.prop] == 2"
              >交易成功</el-tag
            >
            <el-tag class="ml-2" type="danger" v-if="scope.row[item.prop] == 3"
              >交易失败</el-tag
            >
          </div>
          <!-- 图片插槽判断 -->
          <!-- 归类为头像插槽 -->
          <div v-else-if="item.prop == 'avatar'" style="margin-left: 30px">
            <!-- {{ scope.row[item.prop] }} -->
            <el-avatar
              :src="joinImg(scope.row[item.prop])"
              size="large"
              @click="previewPic(scope.row[item.prop])"
            />
          </div>
          <!-- 归类为图片插槽 -->
          <div class="demo-image__preview" v-else-if="item.prop == 'pic'">
            <el-image
              style="width: 100px; height: 100px"
              :src="joinImg(scope.row[item.prop])"
              :preview-src-list="joinImg2(scope.row[item.prop])"
              z-index:999
              fit="cover"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="操作"
        min-width="180px"
      >
        <template #default="scope">
          <el-button
            size="small"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:currentPage="config.page"
      v-model:page-size="config.pageSize"
      :page-sizes="[2, 5, 8, 10]"
      background
      layout="sizes, prev, pager, next,total,jumper"
      :total="config.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { ref, reactive, toRefs, toRaw, watchEffect } from "vue";
export default {
  props: {
    tableData: Object,
    tableLabel: Array,
    config: Object,
  },
  setup(props, context) {
    // 组件获取父组件的数据
    const { tableData, tableLabel, config } = toRefs(props);
    function handleEdit(index, data) {
      context.emit("edit", index, data);
    }
    // TODO: 删除 修改
    function handleDelete(index, data) {
      context.emit("delete", index, data);
    }
    function handleCurrentChange(page) {
      context.emit("changePage", page);
    }
    // 修改标签页
    function handleSizeChange(PageSize) {
      // console.log(PageSize);
      context.emit("handlerSizeChange", PageSize);
    }

    function joinImg(url) {
      let imgurl = encodeURI(`http://localhost:3001/img/${url}`);
      return imgurl;
    }

    function joinImg2(url) {
      let list = [];
      let imgurl = encodeURI(`http://localhost:3001/img/${url}`);
      list.push(imgurl);
      // console.log(list);
      return list;
    }
    return {
      tableData,
      tableLabel,
      config,
      handleEdit,
      handleDelete,
      handleCurrentChange,
      handleSizeChange,
      joinImg,
      joinImg2,
    };
  },
};
</script>

<style lang="less" scoped>
.common-table {
  margin-top: 40px;
  height: calc(100% - 62px);
  background-color: #fff;
  position: relative;
  .pager {
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
  :deep .el-pagination {
    // margin: auto;
    // text-align: center;
    padding-top: 16px;
    padding-left: 650px;
    box-sizing: border-box;
    text-align: right;
  }
}
.demo-image__error .image-slot {
  font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}
.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}
</style>
