const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth.middleware");

// TODO: Implement prediction endpoints (Sprint 3+)
router.get("/", authenticate, (req, res) => res.json({ success: true, data: [], message: "prediction endpoint - coming in Sprint 3" }));

module.exports = router;
