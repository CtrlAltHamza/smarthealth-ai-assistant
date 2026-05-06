const express = require("express");
const router = express.Router();
const logger = require("../utils/logger");

// Mock doctors data
const mockDoctors = [
  {
    id: "doc-1",
    specialization: "Cardiologist",
    experience: 8,
    consultationFee: 500,
    rating: 4.8,
    bio: "Expert cardiologist with 8 years of experience",
    user: {
      id: "user-1",
      name: "Dr. Rajesh Kumar",
      avatar: "👨‍⚕️",
      phone: "+91-9876543210",
      email: "rajesh@smarthealth.com",
    },
  },
  {
    id: "doc-2",
    specialization: "Dermatologist",
    experience: 6,
    consultationFee: 400,
    rating: 4.6,
    bio: "Specialized in skin care and treatment",
    user: {
      id: "user-2",
      name: "Dr. Priya Sharma",
      avatar: "👩‍⚕️",
      phone: "+91-9876543211",
      email: "priya@smarthealth.com",
    },
  },
  {
    id: "doc-3",
    specialization: "Orthopedic Surgeon",
    experience: 10,
    consultationFee: 600,
    rating: 4.9,
    bio: "Experienced in joint and bone treatment",
    user: {
      id: "user-3",
      name: "Dr. Arun Singh",
      avatar: "👨‍⚕️",
      phone: "+91-9876543212",
      email: "arun@smarthealth.com",
    },
  },
  {
    id: "doc-4",
    specialization: "Pediatrician",
    experience: 7,
    consultationFee: 350,
    rating: 4.7,
    bio: "Specialized in child healthcare",
    user: {
      id: "user-4",
      name: "Dr. Neha Gupta",
      avatar: "👩‍⚕️",
      phone: "+91-9876543213",
      email: "neha@smarthealth.com",
    },
  },
];

// GET all available doctors
router.get("/", async (req, res) => {
  try {
    // Prefer DB-backed Doctor model if available
    try {
      const { Doctor, User } = require("../models");
      if (Doctor) {
        const doctors = await Doctor.findAll({ include: [{ association: "user" }] });
        return res.status(200).json({ success: true, data: doctors, message: "Doctors retrieved successfully" });
      }
    } catch (e) {
      logger.info("Doctor model not available or DB error, falling back to mock doctors");
    }

    res.status(200).json({
      success: true,
      data: mockDoctors,
      message: "Doctors retrieved successfully",
    });
  } catch (error) {
    logger.error("Error fetching doctors:", error);
    res.status(500).json({ success: false, message: "Failed to fetch doctors" });
  }
});

// GET specific doctor by ID
router.get("/:id", async (req, res) => {
  try {
    // Try DB first
    try {
      const { Doctor } = require("../models");
      if (Doctor) {
        const doctor = await Doctor.findByPk(req.params.id, { include: [{ association: "user" }] });
        if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
        return res.status(200).json({ success: true, data: doctor, message: "Doctor retrieved successfully" });
      }
    } catch (e) {
      logger.info("Doctor model not available or DB error, falling back to mock doctor lookup");
    }

    const doctor = mockDoctors.find((d) => d.id === req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
    res.status(200).json({ success: true, data: doctor, message: "Doctor retrieved successfully" });
  } catch (error) {
    logger.error("Error fetching doctor:", error);
    res.status(500).json({ success: false, message: "Failed to fetch doctor" });
  }
});

module.exports = router;
