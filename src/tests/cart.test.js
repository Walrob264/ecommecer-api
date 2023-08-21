const request = require("supertest");
const app = require("../app");
const Product = require("../models/Product");
require("../models");
const URL_LOGIN = "/api/v1/users/login";
const URL_CART = "/api/v1/cart";
let TOKEN;
let productBody;
let product;
let userId;
let cartId;

beforeAll(async () => {
  const user = {
    email: "walrob@gmail.com",
    password: "1234",
  };
  const res = await request(app).post(URL_LOGIN).send(user);

  TOKEN = res.body.token;
  userId = res.body.user.id;

  productBody = {
    title: "productTest",
    description: "lorem20",
    price: 23,
  };

  product = await Product.create(productBody);
});

test("POST -> 'URL_CART', should return status code 201 and res.body.quantity === bodyCart.quantity", async () => {
  const bodyCart = {
    quantity: 1,
    productId: product.id,
  };

  const res = await request(app)
    .post(URL_CART)
    .send(bodyCart)
    .set("Authorization", `Bearer ${TOKEN}`);

  cartId = res.body.id;

  expect(res.status).toBe(201);
  expect(res.body).toBeDefined();
  expect(res.body.quantity).toBe(bodyCart.quantity);
  expect(res.body.id).toBe(userId);
});

test("GET -> 'URL_CART', should return status code 200 and res.body.length === 1", async () => {
  const res = await request(app)
    .get(URL_CART)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body).toHaveLength(1);
  expect(res.body[0].userId).toBe(userId);
  expect(res.body[0].product).toBeDefined();
  expect(res.body[0].productId).toBe(product.id);
  expect(res.body[0].product.id).toBe(product.id);
});
test("PUT -> 'URL_CART/:id',should return status code 200 and res.body.quantity === bodyUpdate.quantity", async () => {
  const bodyUpdate = {
    quantity: 2,
  };

  const res = await request(app)
    .put(`${URL_CART}/${cartId}`)
    .send(bodyUpdate)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.quantity).toBe(bodyUpdate.quantity);
});

test("DELETE -> 'URL_CART/:id',should return status code 204", async () => {
  const res = await request(app)
    .delete(`${URL_CART}/${cartId}`)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(204);

  await product.destroy();
});
