const request = require("supertest");
const app = require("../app");

describe("Basic Route Test", () => {
  it("GET /test should return test ok", async () => {
    const res = await request(app).get("/test");

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("test ok"); // FIXED
  });
});
