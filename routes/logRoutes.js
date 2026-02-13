const express = require("express");
const router = express.Router();
const { createLog } = require("../controllers/logController");


router.post("/", createLog);

module.exports = router;