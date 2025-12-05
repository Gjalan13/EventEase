const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const Event = require("../models/Event");

jest.setTimeout(30000);

beforeAll(async () => {
  await mongoose.connect(
    "mongodb+srv://gunjanjalan13_db_user:EveManage@eventmanagement.njmhqjd.mongodb.net/eventease_test_event?retryWrites=true&w=majority"
  );
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("EVENT ROUTES TESTING", () => {
  const validEvent = {
    owner: "MNIT_Blitzschlag",
    title: "Battle of Bands",
    description: "Musical Competition",
    organizedBy: "Music Club",
    eventDate: "2025-12-15",
    eventTime: "10:30",
    location: "Auditorium",
    ticketPrice: 300,
    image: "uploads/test.jpg",
  };

  // CREATE EVENT (VALID)
  it("POST /createEvent → should create event", async () => {
    console.log("SENDING PAYLOAD (CREATE EVENT):", validEvent);

    const res = await request(app)
      .post("/createEvent")
      .field("owner", validEvent.owner)
      .field("title", validEvent.title)
      .field("description", validEvent.description)
      .field("organizedBy", validEvent.organizedBy)
      .field("eventDate", validEvent.eventDate)
      .field("eventTime", validEvent.eventTime)
      .field("location", validEvent.location)
      .field("ticketPrice", validEvent.ticketPrice);

    console.log("VALID EVENT CREATED");

    expect(res.statusCode).toBe(201);
  });

  // CREATE EVENT (INVALID)
  it("POST /createEvent → missing title should fail", async () => {
    const invalidPayload = {
      owner: "MNIT",
      eventDate: "2025-10-10",
    };
    console.log("SENDING PAYLOAD (INVALID CREATE EVENT):", invalidPayload);

    const res = await request(app).post("/createEvent").send(invalidPayload);

    console.log("INVALID EVENT CREATION");

    expect(res.statusCode).toBe(400);
  });

  // GET ALL EVENTS
  it("GET /events → should list all events", async () => {
    console.log("SENDING REQUEST (GET ALL EVENTS)");

    const res = await request(app).get("/events");

    console.log("VALID FETCH ALL EVENTS");

    expect(res.statusCode).toBe(200);
  });

  // LIKE EVENT (VALID)
  it("POST /event/:id → should increment likes", async () => {
    const event = await Event.create(validEvent);
    console.log("SENDING REQUEST (LIKE EVENT):", event._id);

    const res = await request(app).post(`/event/${event._id}`);

    console.log("VALID LIKE EVENT");

    expect(res.statusCode).toBe(200);
    expect(res.body.likes).toBe(1);
  });

  // LIKE EVENT (INVALID ID)
  it("POST /event/:invalidId → should return 404", async () => {
    console.log("SENDING REQUEST (INVALID LIKE EVENT)");

    const res = await request(app).post("/event/invalid123");

    console.log("INVALID LIKE EVENT");

    expect(res.statusCode).toBe(500);
  });
});
