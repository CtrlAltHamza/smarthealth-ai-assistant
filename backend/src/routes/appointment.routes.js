const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth.middleware");
const appointmentController = require("../controllers/appointment.controller");

router.get("/", authenticate, appointmentController.getAppointments);
router.post("/", authenticate, authorize("patient"), appointmentController.createAppointment);
router.patch("/:id/status", authenticate, appointmentController.updateStatus);

module.exports = router;
