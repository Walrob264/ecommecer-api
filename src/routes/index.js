const express = require("express");
const { verifyJwt } = require("../utils/verifyJWT");

const routerUser = require("./user.router");
const routerCategory = require("./category.router");
const routerProduct = require("./product.router");
const routerCart = require("./cart.route");
const routerPurchase = require("./purchase.router");
const routerProductImage = require("./productImg.router");
const router = express.Router();

// colocar las rutas aquí
router.use("/users", routerUser);
router.use("/categories", routerCategory);
router.use("/products", routerProduct);
router.use("/cart", verifyJwt, routerCart);
router.use("/purchase", verifyJwt, routerPurchase);
router.use("/product_images", verifyJwt, routerProductImage);
module.exports = router;
