const Log = require("../models/Log");
const Alert = require("../models/Alert");

/* MAIN DETECTION FUNCTION */

async function detectThreat(log) {

   const brute = await detectBruteForce(log.ip);
   if (brute) return brute;

   const sqli = await detectSQLInjection(log);
   if (sqli) return sqli;

   const recon = await detectRecon(log.ip);
   if (recon) return recon;

   return null;
}

/* -------- RULE 1: Brute Force -------- */

async function detectBruteForce(ip) {
   const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

   const failedAttempts = await Log.countDocuments({
      ip,
      statusCode: 401,
      createdAt: { $gte: twoMinutesAgo }
   });

   console.log("Checking IP:", ip);
   console.log("Failed Attempts:", failedAttempts);

   if (failedAttempts >= 5) {

      const existingAlert = await Alert.findOne({
         title: "Brute Force Attempt",
         sourceIP: ip,
         status: "OPEN"
      });

      if (!existingAlert) {
         const created = await Alert.create({
            title: "Brute Force Attempt",
            description: `Multiple failed logins from ${ip}`,
            severity: "HIGH",
            sourceIP: ip
         });

         return created; // 🔥 Return alert for real-time emit
      }
   }

   return null;
}

/* -------- RULE 2: SQL Injection -------- */

async function detectSQLInjection(log) {
   const patterns = ["' OR 1=1", "UNION SELECT", "--", "DROP TABLE"];

   for (let pattern of patterns) {
      if (log.endpoint && log.endpoint.includes(pattern)) {

         const created = await Alert.create({
            title: "SQL Injection Attempt",
            description: `SQLi pattern detected from ${log.ip}`,
            severity: "CRITICAL",
            sourceIP: log.ip
         });

         return created;
      }
   }

   return null;
}

/* -------- RULE 3: Recon Activity -------- */

async function detectRecon(ip) {
   const oneMinuteAgo = new Date(Date.now() - 1 * 60 * 1000);

   const logs = await Log.find({
      ip,
      createdAt: { $gte: oneMinuteAgo }
   });

   const uniqueEndpoints = new Set(logs.map(l => l.endpoint));

   if (uniqueEndpoints.size >= 10) {

      const created = await Alert.create({
         title: "Recon Activity Detected",
         description: `Multiple endpoint probing from ${ip}`,
         severity: "MEDIUM",
         sourceIP: ip
      });

      return created;
   }

   return null;
}

module.exports = detectThreat;
