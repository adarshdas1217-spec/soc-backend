const express = require("express");
const router = express.Router();
const { createLog } = require("../controllers/logController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createLog);

module.exports = router;