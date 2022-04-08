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

// 定义手机号的验证规则
const user_phone = joi
  .string()
  .length(11)
  .pattern(/^[0-9]+$/);
//   暴露登录验证规则
export const user_login_schema = {
  body: {
    user_name,
    user_password,
  },
};

//
// 暴露注册的验证过规则
export const user_register_shcema = {
  body: {
    user_name,
    user_password,
    email,
    user_phone,
  },
};
