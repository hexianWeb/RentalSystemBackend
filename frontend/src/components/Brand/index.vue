<template>
  <header>
    <el-row>
      <el-col :span="10" justify="space-around">
        <div class="l-content">
          <el-button @click="handleMenu">
            <el-icon style="vertical-align: middle color:#fff">
              <i class="iconfont icon-menu"></i>
            </el-icon>
          </el-button>
          <!-- 面包屑 -->
          <el-breadcrumb separator="/">
            <el-breadcrumb-item
              class="myColor"
              v-for="item in tablist"
              :key="item.path"
              :to="{ path: item.path }"
              >{{ item.label }}</el-breadcrumb-item
            >
          </el-breadcrumb>
        </div>
      </el-col>
      <el-col :offset="8" :span="4">
        <div class="r-content">
          <FullScreen />
          <el-dropdown trigger="click" size="middle">
            <span class="el-dropdown-link">
              <el-avatar :size="50" :src="circleUrl" />
              <span style="color: #fff">个人中心</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人信息</el-dropdown-item>
                <el-dropdown-item>邮件信息</el-dropdown-item>
                <el-dropdown-item divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>
  </header>
</template>

<script>
import { mapState } from "vuex";
import { useStore } from "vuex";
import FullScreen from "@/components/SrceenFull";
export default {
  name: "brand",
  components: { FullScreen },
  setup() {
    const store = useStore();
  },
  computed: {
    ...mapState("BrandStore", ["tablist"]),
  },
  data() {
    return {
      circleUrl:
        "https://img.wxcha.com/m00/7c/be/9ddde1a370bca73daa50a01aeabdfb10.jpg",
    };
  },
  methods: {
    handleMenu() {
      this.$store.commit("BrandStore/collapseMenu");
    },
  },
};
</script>

<style lang="less" scoped>
.myColor /deep/ .el-breadcrumb__inner {
  color: #fff;
}
.l-content {
  display: flex;
  // margin-top: 10px;
  height: 100%;
  align-items: center;
  justify-content: center;
  .el-breadcrumb {
    text-align: center;
    color: #fff;
  }
}
.r-content {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
</style>
