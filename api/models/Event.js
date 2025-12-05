const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  organizedBy: {
    type: String
  },
  eventDate: {
    type: Date,
    required: true
  },
  eventTime: {
    type: String // Can be string like "10:30"
  },
  location: {
    type: String
  },
  ticketPrice: {
    type: Number,
    default: 0
  },
  image: {
    type: String
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [
    {
      type: mongoose.Schema.Types.Mixed // or define a sub-schema for structured comments
    }
  ]
}   );

module.exports = mongoose.models.Event || mongoose.model("Event", EventSchema);
