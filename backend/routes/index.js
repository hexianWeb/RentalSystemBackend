"use strict";

import admin from "./admin.js";

import user from "./user.js";

import estate from "./estate.js";

import house from "./house.js";

import Check from "../middlewares/check.js";

export default (app) => {
  app.use("/admin", admin);

  app.use("/user", user);

  app.use("/estate", estate);

  app.use("/house", house);
};
