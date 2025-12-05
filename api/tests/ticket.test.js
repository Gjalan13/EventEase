const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const Ticket = require("../models/Ticket");

jest.setTimeout(30000);

beforeAll(async () => {
  await mongoose.connect(
    "mongodb+srv://gunjanjalan13_db_user:EveManage@eventmanagement.njmhqjd.mongodb.net/eventease_test_ticket?retryWrites=true&w=majority"
  );
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("TICKET API TESTING", () => {
  let createdTicket = null;

  const validTicket = {
    userid: "6932fb4a6288454457801d5a",
    eventid: "6932fb0b1d5444d0e4cef6b3",
    ticketDetails: {
      name: "user1",
      email: "user1@mnit.ac.in",
      eventname: "PANACHE",
      eventdate: "2025-12-16T00:00:00.000+00:00",
      eventtime: "10:30",
    },
  };

  // ⭐ VALID: Create a ticket
  it("POST /tickets → should create a new ticket", async () => {
    console.log("SENDING PAYLOAD (CREATE TICKET):", validTicket);

    const res = await request(app).post("/tickets").send(validTicket);

    console.log("VALID TICKET CREATED");

    expect(res.statusCode).toBe(201);
    expect(res.body.ticket).toBeDefined();
    expect(res.body.ticket.userid).toBe(validTicket.userid);

    createdTicket = res.body.ticket; // store for later tests
  });

  // ❌ INVALID: Missing required fields
  it("POST /tickets → should fail when fields are missing", async () => {
    const invalidPayload = { eventid: "1234" };
    console.log("SENDING PAYLOAD (INVALID CREATE):", invalidPayload);

    const res = await request(app).post("/tickets").send(invalidPayload);

    console.log("INVALID TICKET CREATION");

    expect(res.statusCode).toBe(500);
  });

  // ⭐ VALID: Fetch all tickets
  it("GET /tickets → should return list of tickets", async () => {
    console.log("SENDING REQUEST (GET ALL TICKETS)");

    const res = await request(app).get("/tickets");

    console.log("VALID FETCH ALL TICKETS");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // ⭐ VALID: Fetch single ticket by ID
  it("GET /tickets/:id → should return a ticket", async () => {
    console.log("SENDING REQUEST (GET TICKET BY ID):", createdTicket._id);

    const res = await request(app).get(`/tickets/${createdTicket._id}`);

    console.log("VALID FETCH TICKET BY ID");

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(createdTicket._id);
  });

  // ❌ INVALID: Fetch ticket with invalid ID
  it("GET /tickets/:id → should fail for invalid ticket ID", async () => {
    console.log("SENDING REQUEST (INVALID TICKET ID)");

    const res = await request(app).get("/tickets/invalid123");

    console.log("INVALID FETCH TICKET BY ID");

    expect(res.statusCode).toBe(500);
  });

  // ⭐ VALID: Fetch tickets of a user
  it("GET /tickets/user/:userId → should return tickets of a user", async () => {
    console.log("SENDING REQUEST (GET USER TICKETS):", validTicket.userid);

    const res = await request(app).get(`/tickets/user/${validTicket.userid}`);

    console.log("VALID FETCH USER TICKETS");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // ❌ INVALID: User does not exist
  it("GET /tickets/user/:userId → should still return empty array for unknown user", async () => {
    console.log("SENDING REQUEST (UNKNOWN USER TICKETS)");

    const res = await request(app).get("/tickets/user/unknownUser123");

    console.log("INVALID FETCH UNKNOWN USER TICKETS");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // ⭐ VALID: Delete ticket
  it("DELETE /tickets/:id → should delete the ticket", async () => {
    console.log("SENDING REQUEST (DELETE TICKET):", createdTicket._id);

    const res = await request(app).delete(`/tickets/${createdTicket._id}`);

    console.log("VALID TICKET DELETED");

    expect(res.statusCode).toBe(204);
  });

  // ❌ INVALID: Delete ticket with invalid ID
  it("DELETE /tickets/:id → should fail for invalid ID", async () => {
    console.log("SENDING REQUEST (INVALID DELETE)");

    const res = await request(app).delete("/tickets/invalid123");

    console.log("INVALID DELETE TICKET");

    expect(res.statusCode).toBe(500);
  });
});
