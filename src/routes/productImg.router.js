const { getAll } = require("../controllers/productImg.controller");
const {
  create,
  remove,
} = require("../controllers/productImgCloudinary.controller");
const express = require("express");
const upload = require("../utils/multer");

const routerProductImage = express.Router();

routerProductImage.route("/").get(getAll).post(upload.single("image"), create);
routerProductImage.route("/:id").delete(remove);
module.exports = routerProductImage;
