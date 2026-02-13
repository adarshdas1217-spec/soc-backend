const Log = require("../models/Log");
const detectThreat = require("../services/detectionEngine");

exports.createLog = async (req, res) => {
   try {
      req.body.statusCode = Number(req.body.statusCode);

      const log = await Log.create(req.body);

      const newAlert = await detectThreat(log);

      if (newAlert) {
         const io = req.app.get("io");
         io.emit("newAlert", newAlert);
         console.log("🚨 Real-time alert emitted");
      }

      res.status(201).json({ message: "Log stored successfully" });

   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};
