<template>
  <el-row :gutter="20">
    <el-col :span="8" style="margin-top: 20px">
      <el-card :body-style="{ padding: '20px' }" shadow="hover">
        <div style="padding: 14px">
          <el-avatar :size="150" :src="circleUrl" />
          <div class="userinfo">
            <p class="name" style="font-size: 40px">
              {{ adminInfo.user_name }}
            </p>
            <p
              class="access"
              style="color: #333"
              v-if="adminInfo.user_level == 1"
            >
              运维管理员
            </p>
          </div>
        </div>
        <div class="login-info">
          <p>
            此次登录时间: <span> {{ adminInfo.loginTime }}</span>
          </p>
          <p>
            此次登录地点: <span>{{ adminInfo.loginLocation }}</span>
          </p>
        </div>
      </el-card>
      <el-card style="margin-top: 20px; height: 460px">
        <el-table :data="tableData.info" stripe style="width: 100%">
          <el-table-column prop="user_name" label="姓名" width="180" />
          <el-table-column prop="user_phone" label="电话" />
          <el-table-column prop="user_level" label="等级" width="180" />
        </el-table>
      </el-card>
    </el-col>
    <!-- 日常订单信息显示 -->
    <el-col :span="16" style="margin-top: 20px">
      <div class="num">
        <el-row :gutter="12">
          <el-col
            :span="8"
            v-for="item in countData.info.countData"
            :key="item.name"
            style="margin-bottom: 20px"
          >
            <el-card :body-style="{ display: 'flex', padding: 0 }">
              <i
                class="iconfont"
                :class="item.icon"
                :style="{ background: item.color }"
                style="font-size: 90px"
              >
              </i>
              <div class="detail">
                <p class="num">{{ item.value }}</p>
                <p class="txt">
                  {{ item.name }}
                </p>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <!-- 图标部分 -->
      <el-card style="height: 460px">
        <div style="height: 460px" id="echartM"></div>
      </el-card>
      <el-divider />
      <p>努力工作每一天！</p>
    </el-col>
  </el-row>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { mapState } from "vuex";
import { reqAllAdmin, reqCountData, reqEchart } from "@/api";
// 引入echart
import * as echarts from "echarts";

export default {
  name: "HomeView",

  setup() {
    let circleUrl = "http://localhost:3001/img/default.jpg";
    const tableData = reactive({ info: [] });
    const countData = reactive({ info: [] });
    onMounted(async () => {
      // 这是管理员列表
      const res = await reqAllAdmin();
      tableData.info = res.data;
      // 这里是日常统计信息
      countData.info = await reqCountData();
      echartInit();
    });
    // 图标初始胡
    const echartInit = async () => {
      var myChart = echarts.init(document.getElementById("echartM"));
      const option = await reqEchart();
      myChart.setOption(option);
    };
    return {
      circleUrl,
      tableData,
      countData,
    };
  },

  computed: {
    ...mapState("HomeStore", ["adminInfo"]),
  },
};
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.time {
  font-size: 12px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  padding: 0;
  min-height: auto;
}

.image {
  width: 100%;
  display: block;
}
.userinfo {
  float: right;
}
.login-info {
  padding-left: 60px;
  border-top-style: solid;
  text-align: left;
}
.detail {
  margin: 0 auto;
  .num {
    font-size: 24px;
  }
  .txt {
    color: #999;
    font-size: 9px;
  }
}
</style>
