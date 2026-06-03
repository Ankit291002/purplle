const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  event_id: {
    type: String,
    unique: true,
    required: true
  },

  store_id: String,

  camera_id: String,

  visitor_id: String,

  event_type: String,

  timestamp: Date,

  zone_id: String,

  dwell_ms: Number,

  is_staff: Boolean,

  confidence: Number,

  metadata: Object
});

module.exports = mongoose.model("Event", EventSchema);