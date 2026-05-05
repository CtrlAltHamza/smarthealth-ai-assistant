const { Op } = require("sequelize");
const { Appointment, Doctor, Patient, User, Notification } = require("../models");
const logger = require("../utils/logger");

// GET /api/appointments  (filter by role)
exports.getAppointments = async (req, res) => {
  try {
    const { status, from, to, page = 1, limit = 20 } = req.query;
    const where = {};

    if (req.user.role === "patient") {
      const patient = await Patient.findOne({ where: { userId: req.user.id } });
      if (!patient) return res.status(404).json({ success: false, message: "Patient profile not found" });
      where.patientId = patient.id;
    } else if (req.user.role === "doctor") {
      const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
      if (!doctor) return res.status(404).json({ success: false, message: "Doctor profile not found" });
      where.doctorId = doctor.id;
    }

    if (status) where.status = status;
    if (from || to) where.scheduledAt = { ...(from && { [Op.gte]: new Date(from) }), ...(to && { [Op.lte]: new Date(to) }) };

    const { count, rows } = await Appointment.findAndCountAll({
      where,
      include: [
        { association: "patient", include: [{ association: "user", attributes: ["name", "email", "avatar"] }] },
        { association: "doctor", include: [{ association: "user", attributes: ["name", "email", "avatar"] }] },
      ],
      order: [["scheduledAt", "ASC"]],
      limit: +limit,
      offset: (+page - 1) * +limit,
    });

    res.json({ success: true, data: { appointments: rows, total: count, page: +page, pages: Math.ceil(count / limit) } });
  } catch (err) {
    logger.error("getAppointments error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch appointments" });
  }
};

// POST /api/appointments
exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, scheduledAt, duration = 30, type = "in-person", reason } = req.body;
    const patient = await Patient.findOne({ where: { userId: req.user.id } });
    if (!patient) return res.status(404).json({ success: false, message: "Patient profile not found" });

    const doctor = await Doctor.findByPk(doctorId, { include: [{ association: "user" }] });
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });

    // Check for conflicting appointments
    const conflict = await Appointment.findOne({
      where: {
        doctorId,
        status: { [Op.in]: ["pending", "confirmed"] },
        scheduledAt: { [Op.between]: [new Date(new Date(scheduledAt).getTime() - duration * 60000), new Date(new Date(scheduledAt).getTime() + duration * 60000)] },
      },
    });
    if (conflict) return res.status(409).json({ success: false, message: "Doctor is not available at this time" });

    const appointment = await Appointment.create({ patientId: patient.id, doctorId, scheduledAt, duration, type, reason });

    // Notify doctor
    const io = req.app.get("io");
    await Notification.create({
      userId: doctor.user.id,
      type: "appointment",
      title: "New Appointment Request",
      message: `${req.user.name} has booked an appointment on ${new Date(scheduledAt).toLocaleString()}`,
      data: { appointmentId: appointment.id },
    });
    io?.to(`user_${doctor.user.id}`).emit("notification", { type: "appointment", appointmentId: appointment.id });

    res.status(201).json({ success: true, message: "Appointment booked successfully", data: appointment });
  } catch (err) {
    logger.error("createAppointment error:", err);
    res.status(500).json({ success: false, message: "Failed to book appointment" });
  }
};

// PATCH /api/appointments/:id/status
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, cancelReason, notes } = req.body;
    const appointment = await Appointment.findByPk(id, {
      include: ["patient", "doctor"],
    });
    if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });

    await appointment.update({ status, ...(cancelReason && { cancelReason }), ...(notes && { notes }) });
    res.json({ success: true, message: "Appointment updated", data: appointment });
  } catch (err) {
    logger.error("updateStatus error:", err);
    res.status(500).json({ success: false, message: "Failed to update appointment" });
  }
};
