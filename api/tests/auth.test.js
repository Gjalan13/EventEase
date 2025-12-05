const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User");

jest.setTimeout(30000);

beforeAll(async () => {
  await mongoose.connect(
    "mongodb+srv://gunjanjalan13_db_user:EveManage@eventmanagement.njmhqjd.mongodb.net/eventease_test_auth?retryWrites=true&w=majority"
  );
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("AUTH ROUTES TESTING", () => {
  const validUser = {
    name: "Test User",
    email: "valid@test.com",
    password: "12345",
    role: "user",
  };

  // VALID REGISTER
  it("POST /register → should register user", async () => {
    console.log("SENDING PAYLOAD (REGISTER):", validUser);
    const res = await request(app).post("/register").send(validUser);

    console.log("REGISTER RESPONSE:");

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe(validUser.email);
  });

  // INVALID REGISTER
  it("POST /register → missing email should fail", async () => {
    const invalidPayload = {
      name: "A",
      password: "12345",
    };
    console.log("SENDING PAYLOAD (INVALID REGISTER):", invalidPayload);

    const res = await request(app).post("/register").send(invalidPayload);

    console.log("INVALID REGISTER RESPONSE:missing email ");

    expect(res.statusCode).toBe(400);
  });

  // VALID LOGIN
  it("POST /login → should login", async () => {
    const loginPayload = {
      email: validUser.email,
      password: "12345",
    };
    console.log("SENDING PAYLOAD (LOGIN):", loginPayload);

    const res = await request(app).post("/login").send(loginPayload);

    console.log("LOGIN RESPONSE: should login");

    expect(res.statusCode).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  // INVALID LOGIN
  it("POST /login → wrong password should fail", async () => {
    const invalidLoginPayload = {
      email: validUser.email,
      password: "wrongpass",
    };
    console.log("SENDING PAYLOAD (INVALID LOGIN):", invalidLoginPayload);

    const res = await request(app).post("/login").send(invalidLoginPayload);

    console.log("INVALID LOGIN RESPONSE: wrong password");

    expect(res.statusCode).toBe(401);
  });

  // GET PROFILE (VALID)
  it("GET /profile → should return user when logged in", async () => {
    const loginPayload = {
      email: validUser.email,
      password: "12345",
    };
    console.log("SENDING PAYLOAD (LOGIN FOR PROFILE):", loginPayload);

    const loginRes = await request(app).post("/login").send(loginPayload);
    const cookie = loginRes.headers["set-cookie"];

    const profileRes = await request(app).get("/profile").set("Cookie", cookie);

    console.log("PROFILE DATA:  return user");

    expect(profileRes.statusCode).toBe(200);
  });

  // GET PROFILE (NO COOKIE)
  it("GET /profile → should fail without cookie", async () => {
    console.log("SENDING REQUEST (PROFILE WITHOUT COOKIE)");

    const res = await request(app).get("/profile");

    console.log("PROFILE WITHOUT COOKIE RESPONSE:");

    expect(res.statusCode).toBe(401);
  });

  // LOGOUT
  it("POST /logout → should clear cookie", async () => {
    console.log("SENDING REQUEST (LOGOUT)");

    const res = await request(app).post("/logout");

    console.log("LOGOUT RESPONSE: clear cookie");

    expect(res.statusCode).toBe(200);
  });
});
