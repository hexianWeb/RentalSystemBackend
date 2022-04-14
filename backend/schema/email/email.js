// 引入 joi验证组件 提供验证组件

import joi from "@hapi/joi";

const email = joi.string().email().required();

export const email_checker = {
  body: {
    email,
  },
};
