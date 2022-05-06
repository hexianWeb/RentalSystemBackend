"use strict";

import admin from "./admin.js";

import user from "./user.js";

import estate from "./estate.js";

import house from "./house.js";

import email from "./email.js";
// import Check from "../middlewares/check.js";

import ids from "./ids.js";
import spect from "./spect.js";

export default (app) => {
  app.use("/api/admin", admin);

  app.use("/api/user", user);

  app.use("/api/estate", estate);

  app.use("/api/house", house);

  app.use("/api/spect", spect);

  app.use("/email", email);

  app.use("/api/ids", ids);
};
