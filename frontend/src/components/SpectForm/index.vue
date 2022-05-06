<template>
  <el-row>
    <!-- 订单占用 -->
    <el-col :sm="12" :lg="6" v-for="item in list" :key="item.value">
      <el-result
        :icon="item.icon"
        :title="item.title"
        :sub-title="item.sub_title"
      >
        <template #extra>
          <el-button type="primary" @click="onSubmitType(item.value)"
            >确认</el-button
          >
        </template>
      </el-result>
    </el-col>
  </el-row>
  <!-- <el-button>退出</el-button> -->
</template>

<script>
export default {
  setup(props, { emit }) {
    //#region
    const list = [
      {
        title: "订单生成",
        icon: "info",
        sub_title: "用户生成一个订单，等待确认",
        value: 0,
      },
      {
        title: "订单占用",
        icon: "warning",
        sub_title: "订单占用，房源下架，跟随用户一起前往看房",
        value: 1,
      },
      {
        title: "交易成功",
        icon: "success",
        sub_title: "订单生成成功,与用户交付房屋",
        value: 2,
      },
      {
        title: "交易失败",
        icon: "error",
        sub_title: "订单没有达成，房源重新上架",
        value: 3,
      },
    ];
    function onSubmitType(index) {
      // alert(index);
      emit("submitForm", index);
    }
    //#endregion
    return {
      list,
      onSubmitType,
    };
  },
};
</script>
