export const db_url = "mongodb://localhost:27017/rental";

// export const db_url = "mongodb://106.14.211.207:27017/rental";
export const port = 3001;

export const config_session = {
  name: "SID",
  secret: "SID",
  cookie: {
    httpOnly: false,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
  },
};

export const qqmail = {
  user: "2387213640@qq.com",
  password: "bbvcgcdoqgaadibc",
};

// 腾旭地图API
export const secretKey = "MO5BZ-ER464-2OQUE-DHT6M-KP6YJ-FZBKF";
