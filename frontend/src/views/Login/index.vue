<template>
  <div class="content">
    <div class="login-content">
      <a href="" class="banner-box"></a>
      <div class="login-box">
        <h1>后台管理系统</h1>
        <input type="text" v-model="loginForm.user_name" placeholder="账号" />
        <input
          type="password"
          v-model="loginForm.user_password"
          placeholder="密码"
        />
        <a @click="submitForm" href="#">
          <span>登录</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { useStore } from "vuex";
export default {
  name: "login",
  setup() {
    const store = useStore();
    // 推荐使用reactive 但是ref似乎用起来更简便
    const loginForm = reactive({
      user_name: "",
      user_password: "",
    });
    return {
      loginForm,
      submitForm,
    };
    function submitForm(ev) {
      store.dispatch("HomeStore/LoginByUsername", this.loginForm);
    }
  },
};
</script>

<style lang="less" scoped>
html,
body {
  margin: 0;
  padding: 0;
}
.content {
  width: 100%;
  height: 100vh;
  background: url("/public/img/bg_house.png");
  display: flex;
  justify-content: center;
  align-items: center;
  .login-content {
    position: relative;
    width: 800px;
    height: 360px;
    background-color: #fff;
    border-radius: 30px;
    padding: 30px;
    .banner-box {
      display: inline-block;
      float: left;
      width: 500px;
      height: 100%;
      //   background-color: rgb(0, 92, 92);
      background: url("/public/img/bg_house.png") no-repeat;
      background-size: cover;
      border-radius: 20px 0 0 20px;
    }
    .login-box {
      width: 330px;
      height: 100%;
      background-color: #d1eceb;
      position: absolute;
      top: 0;
      right: 0;
      border-radius: 0 30px 30px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      h1 {
        font-size: 36px;
        margin: 60px 0;
        // color: #fff;
      }
      input {
        margin-bottom: 20px;
        width: 200px;
        height: 36px;
        padding: 0 20px;
        border-radius: 36px;
        border: none;
        outline: none;
        font-size: 18px;
      }

      a {
        position: relative;
        display: inline-block;
        padding: 20px 60px;
        text-decoration: none;
        font-weight: 500;
        letter-spacing: 2px;
        color: #4c8dbb;
        font-size: 18px;
        border-radius: 60px;
        box-shadow: -2px -2px 8px rgba(255, 255, 255, 1),
          -2px -2px 12px rgba(255, 255, 255, 0.5),
          inset 2px 2px 4px rgba(255, 255, 255, 0.1),
          2px 2px 8px rgba(0, 0, 0, 0.15);
      }

      a:hover {
        box-shadow: inset -2px -2px 8px rgba(255, 255, 255, 1),
          inset -2px -2px 12px rgba(255, 255, 255, 0.5),
          inset 2px 2px 4px rgba(255, 255, 255, 0.1),
          inset 2px 2px 8px rgba(0, 0, 0, 0.15);
      }
    }
  }
}
</style>
