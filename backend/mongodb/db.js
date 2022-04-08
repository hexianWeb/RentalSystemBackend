// 封装数据库连接工具类
import mongoose from "mongoose";
// 引入服务器数据库地址
import { db_url } from "../config/default.js";

// 引入chalk组件
import chalk from "chalk";
// 连接数据库
mongoose.connect(db_url);

// 获取连接状况
const db = mongoose.connection;

db.once("open", () => {
  console.log(chalk.green("连接数据库成功"));
});

db.once("close", function () {
  console.log(chalk.red("数据库已断开，尝试重新连接"));
  mongoose.connect(db_url);
});

export default db;
