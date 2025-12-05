const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");

const Ticket = require("./models/Ticket");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

// Prevent DB connection during tests
if (process.env.NODE_ENV !== "test") {
  mongoose.connect(process.env.MONGO_URL);
}

// -------- Multer Config ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

const jwtSecret = "bsbsfbrnsftentwnnwnwn";

app.get("/test", (req, res) => {
  res.send("test ok");
});


// ========== AUTH ROUTES ==========

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields required" });

    if (name.length < 2)
      return res.status(400).json({ error: "Invalid name" });

    if (!email.includes("@"))
      return res.status(400).json({ error: "Invalid email" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already exists" });

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const userDoc = await User.findOne({ email });
  if (!userDoc) return res.status(404).json({ error: "User not found" });

  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (!passOk) return res.status(401).json({ error: "Invalid password" });

  jwt.sign(
    { id: userDoc._id, email: userDoc.email },
    jwtSecret,
    {},
    (err, token) => {
      if (err) return res.status(500).json({ error: "Token generation failed" });

      res.cookie("token", token).json({
        _id: userDoc._id,
        name: userDoc.name,
        email: userDoc.email,
        role: userDoc.role,
      });
    }
  );
});

// FIXED: Return 401 if no cookie or invalid token
app.get("/profile", async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ error: "User not found" });

    res.status(200).json(user);
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").status(200).json(true);
});

// ========== EVENT MODEL (FIXED) ==========
const eventSchema = new mongoose.Schema({
  owner: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  organizedBy: String,
  eventDate: Date,
  eventTime: String,
  location: String,
  ticketPrice: { type: Number, default: 0 },
  image: String,
  likes: { type: Number, default: 0 },
  comments: [String],
});

// Prevent OverwriteModelError during testing
const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

// ========== EVENT ROUTES ==========

app.post("/createEvent", upload.single("image"), async (req, res) => {
  try {
    const { owner, title, description, organizedBy, eventDate, eventTime } =
      req.body;

    if (!owner || !title || !description || !organizedBy || !eventDate || !eventTime)
      return res.status(400).json({ error: "Missing required fields" });

    const newEvent = await Event.create({
      ...req.body,
      image: req.file ? req.file.path : "",
    });

    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/createEvent", async (req, res) => {
  try {
    res.status(200).json(await Event.find());
  } catch {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

app.get("/event/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch {
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

app.post("/event/:eventId", async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.likes = (event.likes || 0) + 1;
    res.json(await event.save());
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/events", async (req, res) => {
  try {
    res.json(await Event.find());
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// ========== TICKET ROUTES ==========

app.post("/tickets", async (req, res) => {
  try {
    const newTicket = await Ticket.create(req.body);
    res.status(201).json({ ticket: newTicket });
  } catch {
    res.status(500).json({ error: "Failed to create ticket" });
  }
});

app.get("/tickets", async (req, res) => {
  try {
    res.json(await Ticket.find());
  } catch {
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

app.get("/tickets/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });
    res.json(ticket);
  } catch {
    res.status(500).json({ error: "Failed to fetch ticket" });
  }
});

app.get("/tickets/user/:userId", async (req, res) => {
  try {
    res.json(await Ticket.find({ userid: req.params.userId }));
  } catch {
    res.status(500).json({ error: "Failed to fetch user tickets" });
  }
});

app.delete("/tickets/:id", async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Failed to delete ticket" });
  }
});

module.exports = app;
