<template>
  <el-container>
    <el-aside width="200px">
      <TypeNav />
    </el-aside>
    <el-container>
      <el-header><Brand /> </el-header>
      <el-main>
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component
              :is="Component"
              :key="$route.name"
              v-if="$route.meta.keepAlive"
            ></component>
          </keep-alive>
          <component
            :is="Component"
            :key="$route.name"
            v-if="!$route.meta.keepAlive"
          ></component>
        </router-view>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Main",
  mounted() {
    // TODO: 消除此方法
    // 获取用户信息
    // this.$store.dispatch("HomeStore/getAdminInfo");
  },
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #31363b;
  width: 100%;
}
.el-main {
  padding-top: 0;
}
.el-aside {
  padding-top: 0;
  height: 100%;
  text-align: center;
}
</style>
