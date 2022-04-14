"use strict";

import admin from "./admin.js";

import user from "./user.js";

import estate from "./estate.js";

import house from "./house.js";

import email from "./email.js";
// import Check from "../middlewares/check.js";

import spect from "./spect.js";

export default (app) => {
  app.use("/admin", admin);

  app.use("/user", user);

  app.use("/estate", estate);

  app.use("/house", house);

  app.use("/spect", spect);

  app.use("/email", email);
};
