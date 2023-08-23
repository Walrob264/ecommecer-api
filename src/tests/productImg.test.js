const request = require("supertest");
const app = require("../app");
const path = require("path");
const URL_USERS = "/api/v1/users";
const URL_PRODUCT_IMAGES = "/api/v1/product_images";

let TOKEN;
let imageId;
beforeAll(async () => {
  const user = {
    email: "walrob@gmail.com",
    password: "1234",
  };
  const res = await request(app).post(`${URL_USERS}/login`).send(user);
  TOKEN = res.body.token;
});

test("POST -> 'URL_PRODUCT_IMAGES', should status code 201 and res.body.url to be defined and res.body.file to be defined", async () => {
  const localImage = path.join(__dirname, "..", "public", "test.jpg");

  const res = await request(app)
    .post(URL_PRODUCT_IMAGES)
    .attach("image", localImage)
    .set("Authorization", `Bearer ${TOKEN}`);
  imageId = res.body.id;

  expect(res.status).toBe(201);
  expect(res.body).toBeDefined();
  expect(res.body.url).toBeDefined();
  expect(res.body.filename).toBeDefined();
});

test("GET ALL -> 'URL_PRODUCT_IMAGES', should status code 200 and res.body.length === 1", async () => {
  const res = await request(app)
    .get(URL_PRODUCT_IMAGES)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body).toHaveLength(1);
});

test("DELETE -> 'URL_PRODUCT_IMAGES/:id', should status code 204", async () => {
  const res = await request(app)
    .delete(`${URL_PRODUCT_IMAGES}/${imageId}`)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(204);
});
