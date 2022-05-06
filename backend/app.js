// 引入express框架
import express from "express";
// 引入配置文件 端口 session的设置
import { port, config_session, db_url } from "./config/default.js";

// 引入数据库连接中间件
import db from "./mongodb/db.js";
// import socket from "./util/socket/index.js";
// 引入持久层中间件
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
// 引入日志记录中间件
import winston from "winston";
import expressWinston from "express-winston";
import chalk from "chalk";

// // ES6无法使用__dirname等
// import { fileURLToPath } from "url";
// import { dirname } from "path";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// 引入IO组件
import { Server } from "socket.io";
// 引入http模块
import { createServer } from "http";
// 路由主文件
import router from "./routes/index.js";

// 引入JOI验证中间件
import joi from "@hapi/joi";

const app = express();
// 创建服务器
const httpServer = createServer();

// TODO: socket.io
const io = new Server(httpServer, {
  //配置cors，解决同源策略问题
  allowEIO3: true,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

const userList = [
  {
    id: "1",
    name: "默认群聊",
    img: "http://localhost:3001/img/house_chat.jpg",
  },
];
io.on("connection", (socket) => {
  // 管理员进入聊天模块
  socket.on("addAdmin", (data, callback) => {
    // 重新赋值图片
    data.img = encodeURI(`http://localhost:3001/img/${data.img}`);
    var islogin = true;
    // 是否以及在用户列表中
    console.log("-----------------------------------");
    io.sockets.sockets.forEach((iss) => {
      console.log(iss.nme);
      if (iss.name == data.name) {
        islogin = false;
      }
      if (islogin) {
        userList.push(data);
        socket.name = data.name;
        callback({
          status: 1,
          message: "您已成功登录聊天室",
        });
        // socket.name应该唯一
        // io发送广播 socket是连接实例
        io.emit("login", userList);
      } else {
        callback({
          status: 0,
          message: "false",
        });
      }
    });
  });
  // 群聊事件
  socket.on("groupChat", (data) => {
    data.type = "user";
    console.log(data);
    // socket.broadcast.emit("updateMessage", data);
    io.emit("updateMessage", data);
  });
  // 私聊
  socket.on("privateChat", (data) => {
    console.log(data);
    io.sockets.sockets.forEach((iss) => {
      if (iss.name == data.receiver) {
        console.log(iss.name);
        data.type = "user";
        console.log(iss.id);
        io.to(iss.id).emit("updateMessage", data);
      }
    });
  });
  // 管理掉线
  socket.on("disconnect", () => {
    console.log("用户离开");
    let index = userList.findIndex((i) => i.name == socket.name);
    if (index != -1) {
      userList.splice(index, 1);
    }
  });
});
// 设置响应头 允许跨域 当然可以使用其余如cors 和jsonp 代理服务器等
app.all("*", (req, res, next) => {
  const { origin, Origin, referer, Referer } = req.headers;
  const allowOrigin = origin || Origin || referer || Referer || "*";
  res.header("Access-Control-Allow-Origin", allowOrigin); //允许跨域的源
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Allow-Private-Network"
  );
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", true); //可以带cookies
  res.header("X-Powered-By", "Express");
  if (req.method == "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// 会话存储
// const MongoStore = connectMongo(session);
app.use(cookieParser());
app.use(
  session({
    name: config_session.name,
    secret: config_session.secret,
    // 开启允许客户端并发
    resave: true,
    // 无论有没有 每次都设置一个session 不选择
    saveUninitialized: false,
    cookie: config_session.cookie,
    store: MongoStore.create({
      mongoUrl: db_url,
      ttl: 24 * 60 * 60,
      autoRemove: "native",
    }),
  })
);
// 使用解析表单数据的中间件 x-www 进而获取req.body
app.use(express.urlencoded({ extended: false }));
// 封住错误输出函数 res.cc
app.use((req, res, next) => {
  // status 默认状态为1  // 表示失败情况
  // err可能是一个错误对象 也可能是一个字符串 利用三木运算符判断
  res.cc = function (err, status = 1) {
    let msg = err instanceof Error ? err.msg : err;
    console.log(chalk.red("出现一个错误！！" + msg));
    res.send({
      status,
      msg,
    });
  };
  next();
});

// // 正确输出记录
// app.use(
//   expressWinston.logger({
//     transports: [
//       new winston.transports.Console({
//         json: true,
//         colorize: true,
//       }),
//       new winston.transports.File({
//         filename: "logs/success.log",
//       }),
//     ],
//   })
// );

// 挂载路由
router(app);
// app.use("/test", router_test);
app.use(express.static("public"));
// 错误输出记录
app.use(
  expressWinston.errorLogger({
    transports: [
      new winston.transports.Console({
        json: true,
        colorize: true,
      }),
      new winston.transports.File({
        filename: "logs/error.log",
      }),
    ],
  })
);

// 挂载全局错误中间件
app.use((err, req, res, next) => {
  // TODO: token错误认证未完成
  // TODO: JOI数据认证错误信息未完成
  if (err instanceof joi.ValidationError) {
    return res.cc("数据验证失败" + err.message);
  }
  return;
});
// 开启端口 port=3001
//  DONE: 弃用
app.listen(port, () => {
  console.log(chalk.blue(`基础API使用:http://localhost:${port}`));
});
httpServer.listen(8082, () => {
  console.log(chalk.blue(`websocket使用:http://localhost:8082`));
});
