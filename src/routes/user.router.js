const {
  getAll,
  create,
  remove,
  update,
  login,
  logged,
} = require("../controllers/user.controller");
const express = require("express");
const { verifyJwt } = require("../utils/verifyJWT.js");
const routerUser = express.Router();

routerUser.route("/").get(verifyJwt, getAll).post(create);
routerUser.route("/login").post(login);

routerUser.route("/:id").delete(verifyJwt, remove).put(verifyJwt, update);

module.exports = routerUser;
