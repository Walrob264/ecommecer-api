const request = require("supertest");
const app = require("../app");

const URL_CATEGORY = "/api/v1/categories";
const URL_USERS = "/api/v1/users";
let TOKEN;
let categoryId;

beforeAll(async () => {
  const user = {
    email: "walrob@gmail.com",
    password: "1234",
  };

  const login = await request(app).post(`${URL_USERS}/login`).send(user);

  TOKEN = login.body.token;
});

test("POST -> 'URL_CATEGORY', should return status code 201 and res.body.name === body.name", async () => {
  const body = {
    name: "Balon de Futbol",
  };
  const res = await request(app)
    .post(URL_CATEGORY)
    .send(body)
    .set("Authorization", `Bearer ${TOKEN}`);

  categoryId = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body).toBeDefined();
  expect(res.body.name).toBe(body.name);
});

test("GET -> 'URL_CATEGORY', should return status code 200 and res.body.length === 1", async () => {
  const res = await request(app).get(URL_CATEGORY);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body).toHaveLength(1);
});

test("DELETE -> 'URL_CATEGORY', should return status code 204", async () => {
  const res = await request(app)
    .delete(`${URL_CATEGORY}/${categoryId}`)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(204);
});
