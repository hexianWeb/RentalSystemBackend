// 当前模块的API 统一管理
// import axios from "axios";
import requests from "./request";

// 引入解析函数
import Qs from "qs";
// DONE:首页展示接口

// 获取登录的管理员的信息
export const reqAdminInfo = () => {
  // 发请求 返回的是promise 对象 默认返回undefined
  return requests({ url: "/admin/getInfo", method: "get" });
};

// 获取同级别运维管理员的信息 仅限5条
export const reqAllAdmin = () => {
  return requests({ url: "/admin/getAllAdmin?limit=10", method: "get" });
};

// 登录接口
export const reqAdminLogin = (data) => {
  return requests({
    url: "/admin/login",
    method: "post",
    data,
  });
};

// 获取当日当月数据接口
export const reqCountData = async () => {
  let spectData = await requests({
    url: "/spect/newSpectNumber",
    method: "get",
  });
  let moneyData = await requests({ url: "/spect/newMoney", method: "get" });
  let userData = await requests({ url: "/user/newUserNumber", method: "get" });
  // console.log(moneyData);
  return {
    countData: [
      {
        name: "本日支付金额",
        value: moneyData.data.todayNumber,
        icon: "icon-rmb",
        color: "#2ec7c9",
      },

      {
        name: "本日新增订单",
        value: spectData.data.todayNumber,
        icon: "icon-data",
        color: "#ffb980",
      },
      {
        name: "本日新增用户",
        value: userData.data.todayNumber,
        icon: "icon-bussiness-man",
        color: "#2ec7c9",
      },
      {
        name: "本月支付金额",
        value: moneyData.data.mouthNumber,
        icon: "icon-rmb",
        color: "#2ec7c9",
      },
      {
        name: "本月新增订单",
        value: spectData.data.mouthNumber,
        icon: "icon-data",
        color: "#ffb980",
      },
      {
        name: "本月新增用户",
        value: userData.data.mouthNumber,
        icon: "icon-bussiness-man",
        color: "#2ec7c9",
      },
    ],
  };
};
// 图标数据
export const reqEchart = async () => {
  let data = await requests({
    url: "/spect/echartM",
    methods: "get",
  });
  // console.log(data);
  const xData = [];
  const yData = [];
  data.mouthData.forEach((element) => {
    xData.push(element._id);
    yData.push(element.money);
  });
  const option = {
    xAxis: {
      type: "category",
      data: xData,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: yData,
        type: "line",
        smooth: true,
      },
    ],
  };
  return option;
};

// TODO: 地产管理接口

// 获取地产信息
export const reqEstateAll = async (limit, offset) => {
  const api_url = encodeURI(`/estate/getAll?limit=${limit}&offset=${offset}`);
  let res = await requests({
    url: api_url,
    method: "get",
  });
  // console.log(res);
  return res;
};

// 提交地产信息 新增
export const reqAddEstate = async (res) => {
  const {
    address,
    area,
    city,
    created,
    desc,
    estate_title,
    province,
    selectedOptions,
    type,
  } = res;
  // console.log(type);
  let tmp = Qs.stringify({ type }, { arrayFormat: "indices" });
  var data = Qs.stringify({
    address: address,
    area: area,
    city: city,
    created: created,
    desc: desc,
    estate_title: estate_title,
    province: province,
    tmp,
  });
  let result = await requests({
    url: "/estate/add",
    method: "post",
    data,
  });
  // console.log(result);
  return result;
};

export const reqEstateEdit = async (res) => {
  const {
    estate_id,
    address,
    area,
    city,
    created,
    desc,
    estate_title,
    province,
    selectedOptions,
    type,
  } = res;
  let tmp = Qs.stringify({ type }, { arrayFormat: "indices" });
  var data = Qs.stringify({
    estate_id: estate_id,
    address: address,
    area: area,
    city: city,
    created: created,
    desc: desc,
    estate_title: estate_title,
    province: province,
    tmp,
  });
  let result = await requests({
    url: "/estate/update",
    method: "post",
    data,
  });
  return result;
};
// 删除地产信息 删除
export const reqDeleteEstate = async (id) => {
  let result = await requests({
    url: `/estate/deleteById/${id}`,
    method: "delete",
  });
  return result;
};
export const reqSearchEstate = async (value) => {
  let result = await requests({
    url: `http://localhost:3001/api/estate/search?searchV=${value}`,
    method: "get",
  });
  return result;
};
// 用户接口
export const reqUserAll = async (limit, offset) => {
  const api_url = encodeURI(`/user/getAllUser?limit=${limit}&offset=${offset}`);
  let result = await requests({
    url: api_url,
    method: "get",
  });
  return result;
};

// 房屋接口
export const reqHouseAll = async (limit, offset) => {
  const api_url = encodeURI(
    `/house/getAllHouse?limit=${limit}&offset=${offset}`
  );
  let result = await requests({
    url: api_url,
    method: "get",
  });
  return result;
};

// 获取房屋接口通过estate_id
export const reqHouseByEstate_id = async (limit, offset, estate_id) => {
  console.log(limit, offset, estate_id);
  if (estate_id == -1) {
    reqHouseAll();
  }
  const api_url = encodeURI(
    `/house/getAllInfoByEstate_id?estate_id=${estate_id}&limit=${limit}&offset=${offset}`
  );
  let result = await requests({
    url: api_url,
    method: "get",
  });
  return result;
};

// 添加房屋进指定小区
export const reqAddHouseByEstate_id = async (res) => {
  var { type } = res.data;
  var tmp = Qs.stringify({ type }, { arrayFormat: "indices" });
  var data = Qs.stringify({ ...res.data, tmp });
  // data = data + tmp;
  let result = await requests({
    url: `house/add?estate_id=${res.data.estate_id}`,
    method: "post",
    data,
  });
  return result;
};

export const reqDeleteHouse = async (house_id, estate_id) => {
  console.log(house_id, estate_id);
  const api_url = encodeURI(
    `/house/deleteById?house_id=${house_id}&estate_id=${estate_id}`
  );
  let res = await requests({
    url: api_url,
    method: "delete",
  });
  return res;
};
// 页数接口查询
export const reqconfigPage = async () => {
  let res = await requests({
    url: "/ids/configPage",
    method: "get",
  });
  return res;
};

// 订单接口
export const reqSpectAll = async (limit, offset) => {
  const api_url = encodeURI(`/spect/getAll?limit=${limit}&offset=${offset}`);
  let res = await requests({
    url: api_url,
    method: "get",
  });
  return res;
};

// 修改订单状态接口
// export const reqChangeSpect=async(index) =>{
//   const api_url="";
//   switch (index) {
//     case 1:

//       break;
//   case 2
//     default:
//       break;
//   }
// }
// 彩虹屁
// export const reqNothing = async () => {
//   let res = await axios({
//     method: "get",
//     url: "https://api.muxiaoguo.cn/api/caihongpi0",
//   });
//   console.log(res);
// };
