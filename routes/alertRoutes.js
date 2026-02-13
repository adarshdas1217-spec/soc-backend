const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const {
   getAllAlerts,
   updateAlertStatus,
   assignAlert,
   addNote,
   getDashboardStats,
   getAlertTrends
} = require("../controllers/alertController");

/* VIEW ALERTS */
router.get("/", auth, getAllAlerts);

/* UPDATE STATUS */
router.patch("/:id/status", auth, updateAlertStatus);

/* ASSIGN ALERT (Manager/Admin only) */
router.patch("/:id/assign", auth, role("MANAGER", "ADMIN"), assignAlert);

/* ADD NOTE */
router.patch("/:id/note", auth, addNote);

/* DASHBOARD STATS */
router.get("/dashboard", auth, getDashboardStats);

/* ALERT TRENDS */
router.get("/trends", auth, getAlertTrends);

module.exports = router;
