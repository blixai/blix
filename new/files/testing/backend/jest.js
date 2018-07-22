const request = require("supertest");
const app = require("../../server/server");

describe("Test root path", () => {
  test("It should get a status 200 response", done => {
    request(app)
      .get("/")
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});
