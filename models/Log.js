const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
   source: {
      type: String,
      required: true
   },
   ip: {
      type: String,
      required: true
   },
   method: String,
   endpoint: String,
   statusCode: Number,
   userAgent: String,
   timestamp: {
      type: Date,
      default: Date.now
   }
}, { timestamps: true });

module.exports = mongoose.model("Log", logSchema);
