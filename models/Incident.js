const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema({
   alert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Alert"
   },
   notes: [
      {
         message: String,
         addedBy: String,
         timestamp: {
            type: Date,
            default: Date.now
         }
      }
   ],
   resolution: String,
   status: {
      type: String,
      enum: ["OPEN", "INVESTIGATING", "RESOLVED"],
      default: "OPEN"
   }
}, { timestamps: true });

module.exports = mongoose.model("Incident", incidentSchema);
