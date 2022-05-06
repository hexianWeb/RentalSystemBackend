<template>
  <el-icon @click="handleFullScreen">
    <i class="iconfont full">&#xeb99;</i>
  </el-icon>
</template>

<script>
import screenfull from "screenfull";
export default {
  name: "FullSrceen",
  setup() {
    const handleFullScreen = () => {
      if (screenfull.isEnabled) {
        screenfull.toggle();
      }
    };
    return {
      handleFullScreen,
    };
  },
};
</script>

<style lang="less" scoped>
.full {
  color: aliceblue;
  font-size: 49px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 0px;
  margin-right: 63px;
}
</style>
