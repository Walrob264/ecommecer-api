const request = require("supertest");
const app = require("../app");

const URL_USERS = "/api/v1/users";
let TOKEN;
let userId;

beforeAll(async () => {
  const user = {
    email: "walrob@gmail.com",
    password: "1234",
  };

  const login = await request(app).post(`${URL_USERS}/login`).send(user);

  TOKEN = login.body.token;
});

test("GET -> 'URL_USERS', should return status code 200, and res.body.length === 1", async () => {
  const res = await request(app)
    .get(URL_USERS)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body).toHaveLength(1);
});

test("POST -> 'URL_USERS', should return status code 201, and res.body.firstName === user.Name", async () => {
  const user = {
    firstName: "Robert",
    lastName: "Medina",
    email: "berrios@gmail.com",
    password: "1234",
    phone: "902751240",
  };
  const res = await request(app).post(URL_USERS).send(user);
  userId = res.body.id;

  expect(res.status).toBe(201);
  expect(res.body).toBeDefined();
  expect(res.body.firstName).toBe(user.firstName);
});

test("PUT -> 'URL_USERS/:id', should return status code 200, and res.body.firstName === userUpdate.firstName", async () => {
  const user = {
    firstName: "Walter",
  };

  const res = await request(app)
    .put(`${URL_USERS}/${userId}`)
    .send(user)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.firstName).toBe(user.firstName);
});

test("POST -> 'URL_USERS/login', should return status code 200, and res.body.email === user.email, and res.body.token  to be defined", async () => {
  const user = {
    email: "berrios@gmail.com",
    password: "1234",
  };
  const res = await request(app).post(`${URL_USERS}/login`).send(user);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.user.email).toBe(user.email);
  expect(res.body.token).toBeDefined();
});

test("POST -> 'URL_USERS/login', should return status code 401", async () => {
  const user = {
    email: "berrios@gmail.com",
    password: "invalid password",
  };
  const res = await request(app).post(`${URL_USERS}/login`).send(user);

  expect(res.status).toBe(401);
});

test("DELETE -> 'URL_USERS/login', should return status code 204", async () => {
  const res = await request(app)
    .delete(`${URL_USERS}/${userId}`)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(204);
});
