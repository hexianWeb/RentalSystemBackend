import axios from "axios";
axios.defaults.withCredentials = true;

// 引入进度条
import nprogress from "nprogress";
// 引入进度条样式
// import "nprogress/nprogress.css";
import "nprogress/nprogress.css";
//1、对axios二次封装
const requests = axios.create({
  //基础路径，requests发出的请求在端口号后面会跟改baseURl
  baseURL: "/api",
  timeout: 5000,
  headers: {
    "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
  },
});
//2、配置请求拦截器
requests.interceptors.request.use((config) => {
  //config内主要是对请求头Header配置
  //比如添加token
  nprogress.start();
  // Npro 进度条开始动
  return config;
});
//3、配置相应拦截器 返回的数据进一步简化 更好调用
requests.interceptors.response.use(
  (res) => {
    nprogress.done();
    //成功的回调函数
    return res.data;
  },
  (error) => {
    //失败的回调函数
    console.log("响应失败" + error);
    return Promise.reject(new Error("fail"));
  }
);
//4、对外暴露
export default requests;
