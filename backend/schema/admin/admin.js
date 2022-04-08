// 引入 joi验证组件 提供验证功能

import joi from "@hapi/joi";

// 登录账号
const user_name = joi.string().alphanum().min(3).max(10).required();

// 登录密码
const user_password = joi
  .string()
  .alphanum()
  .pattern(/^[\S]{6,12}$/)
  .required();

// 定义email的检测规则
const email = joi.string().email().required();
//   暴露登录验证规则
export const admin_login_shcema = {
  body: {
    user_name,
    user_password,
  },
};
export const admin_register_schema = {
  body: {
    user_name,
    user_password,
    // email,
  },
};
