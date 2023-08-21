const request = require("supertest");
const app = require("../app");
const Category = require("../models/Category");
require("../models");

const URL_PRODUCTS = "/api/v1/products";
const URL_LOGIN = "/api/v1/users/login";
let TOKEN;
let product;
let category;
let productId;

beforeAll(async () => {
  const user = {
    email: "walrob@gmail.com",
    password: "1234",
  };
  const res = await request(app).post(URL_LOGIN).send(user);
  TOKEN = res.body.token;

  const categoryBody = {
    name: "Camisas",
  };

  category = await Category.create(categoryBody);

  product = {
    title: "Camisa temporada 2010-2011",
    description: "Camisa deportiva de Boca de la temporada 2010 a 2011",
    price: 40.5,
    categoryId: category.id,
  };
});

test("'POST -> 'URL_PRODUCTS' shoul return status code 201 and res.body.title === product.title", async () => {
  const res = await request(app)
    .post(URL_PRODUCTS)
    .send(product)
    .set("Authorization", `Bearer ${TOKEN}`);

  productId = res.body.id;

  expect(res.status).toBe(201);
  expect(res.body).toBeDefined();
  expect(res.body.title).toBe(product.title);
});

test("Get -> 'URL_PRODUCTS' shoul return status code 200 and res.body.length === 1", async () => {
  const res = await request(app).get(URL_PRODUCTS);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body).toHaveLength(1);
  expect(res.body[0].category).toBeDefined();
  expect(res.body[0].category.id).toBe(category.id);
});

test("Get -> 'URL_PRODUCTS?category=id' shoul return status code 200 and res.body.length === 1, res.body[0].category to Be Defined res.body[0].category = category.id", async () => {
  const res = await request(app).get(`${URL_PRODUCTS}?category=${category.id}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body).toHaveLength(1);
  expect(res.body[0].category).toBeDefined();
  expect(res.body[0].category.id).toBe(category.id);
});

test("GET ONE -> 'URL_PRODUCTS/:id', should resturn status code 200 and res.body.title = product.title", async () => {
  const res = await request(app).get(`${URL_PRODUCTS}/${productId}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.title).toBe(product.title);
});

test("PUT -> 'URL_PRODUCTS' shoul return status code 201 and res.body.title === product.title", async () => {
  const productUpdate = {
    title: "Camisa de boca 2009-2010",
  };
  const res = await request(app)
    .put(`${URL_PRODUCTS}/${productId}`)
    .send(productUpdate)
    .set("Authorization", `Bearer ${TOKEN}`);
  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.title).toBe(productUpdate.title);
});

test("DElETE -> 'URL_PRODUCTS/:id', should resturn status code 204 ", async () => {
  const res = await request(app)
    .delete(`${URL_PRODUCTS}/${productId}`)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(204);
  await category.destroy();
});
