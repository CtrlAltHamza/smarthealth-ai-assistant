const express = require("express");
const router = express.Router();
const logger = require("../utils/logger");

// Mock storage
let mockAppointments = [];

// Get all appointments
router.get("/", (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: mockAppointments,
      message: "Appointments retrieved successfully",
    });
  } catch (error) {
    logger.error("Error fetching appointments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
    });
  }
});

// Book appointment
router.post("/book", (req, res) => {
  try {
    const { doctorId, scheduledAt, duration, type, reason } = req.body;

    if (!doctorId || !scheduledAt || !reason) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const appointment = {
      id: "apt-" + Date.now(),
      doctorId,
      patientId: "patient-1",
      scheduledAt,
      duration: duration || 30,
      type: type || "video",
      reason,
      status: "pending",
      createdAt: new Date(),
    };

    mockAppointments.push(appointment);
    logger.info(`Appointment booked: ${appointment.id}`);

    res.status(201).json({
      success: true,
      data: appointment,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    logger.error("Error booking appointment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to book appointment",
    });
  }
});

// Create appointment (old route)
router.post("/", (req, res) => {
  try {
    const { doctorId, scheduledAt, duration, type, reason } = req.body;

    if (!doctorId || !scheduledAt || !reason) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const appointment = {
      id: "apt-" + Date.now(),
      doctorId,
      patientId: "patient-1",
      scheduledAt,
      duration: duration || 30,
      type: type || "video",
      reason,
      status: "pending",
      createdAt: new Date(),
    };

    mockAppointments.push(appointment);
    logger.info(`Appointment created: ${appointment.id}`);

    res.status(201).json({
      success: true,
      data: appointment,
      message: "Appointment created successfully",
    });
  } catch (error) {
    logger.error("Error creating appointment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create appointment",
    });
  }
});

// Update appointment status
router.patch("/:id/status", (req, res) => {
  try {
    const { status } = req.body;
    const appointment = mockAppointments.find((a) => a.id === req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    appointment.status = status;
    logger.info(`Appointment ${req.params.id} status updated to ${status}`);

    res.status(200).json({
      success: true,
      data: appointment,
      message: "Appointment status updated successfully",
    });
  } catch (error) {
    logger.error("Error updating appointment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update appointment",
    });
  }
});

module.exports = router;
