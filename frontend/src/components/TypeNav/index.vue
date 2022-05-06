<template>
  <el-menu
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    default-active="2"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
  >
    <h3>后台管理系统</h3>
    <!-- 单级目录菜单 -->
    <el-menu-item
      v-for="item in noChildren"
      :index="item.path"
      :key="item.path"
      @click="clickMenu(item)"
    >
      <template #title>
        <el-icon>
          <i class="iconfont" :class="item.icon"></i>
        </el-icon>
        {{ item.label }}
      </template>
    </el-menu-item>
    <!-- 多级目录菜单 -->
    <el-sub-menu
      v-for="item in hasChildren"
      :index="item.path"
      :key="item.path"
    >
      <template #title>
        <el-icon>
          <i class="iconfont" :class="item.icon"></i>
        </el-icon>
        {{ item.label }}
      </template>
      <el-menu-item-group
        v-for="(subItem, subIndex) in item.children"
        :index="subIndex"
        :key="subItem.path"
      >
        <el-menu-item :index="subItem.path"> {{ subItem.label }} </el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
  </el-menu>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  name: "TypeNav",
  setup() {
    const store = useStore();
    const router = useRouter();
    function clickMenu(item) {
      // console.log("1");
      router.push({
        name: item.name,
      });
      store.commit("BrandStore/selectMenu", item);
    }
    return {
      clickMenu,
    };
  },
  data() {
    return {
      code: "icon-bussiness-man",
      menu: [
        {
          path: "/",
          name: "home",
          label: "主页",
          icon: "icon-menu",
          url: "Home/Home",
        },
        {
          path: "/user",
          name: "user",
          label: "用户管理",
          icon: "icon-bussiness-man",
        },
        {
          path: "/estate",
          name: "estate",
          label: "地区管理",
          icon: "icon-company",
        },
        {
          path: "/house",
          name: "house",
          label: "房源管理",
          icon: "icon-warehouse",
          url: "Home/Home",
        },
        {
          path: "/spect",
          name: "spect",
          label: "订单管理",
          icon: "icon-wuliudingdan",
        },
        { path: "/chat", name: "chat", label: "管理聊天", icon: "icon-chat" },
        {
          path: "/ceshi",
          name: "",
          label: "测试二级",
          icon: "icon-warehouse",
          children: [
            {
              path: "/ces",
              name: "ceshi",
              label: "测试二级",
              icon: "icon-warehouse",
            },
            {
              path: "/cs2",
              name: "ceshi",
              label: "测试二级",
              icon: "icon-warehouse",
            },
          ],
        },
      ],
    };
  },
  computed: {
    noChildren() {
      return this.menu.filter((item) => !item.children);
    },
    hasChildren() {
      return this.menu.filter((item) => item.children);
    },
    isCollapse() {
      return this.$store.state.BrandStore.isCollapse;
    },
  },
};
</script>

<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-menu {
  height: 100%;
  border: none;
  h3 {
    margin: 0;
    color: #fff;
    text-align: center;
    line-height: 48px;
  }
}
</style>
