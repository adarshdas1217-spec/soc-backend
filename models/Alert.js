const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
   title: String,
   description: String,
   severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
   },
   sourceIP: String,
   status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "CLOSED"],
      default: "OPEN"
   },
   assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
   },
   notes: [
      {
         message: String,
         addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
         },
         timestamp: {
            type: Date,
            default: Date.now
         }
      }
   ]
}, { timestamps: true });

module.exports = mongoose.model("Alert", alertSchema);
