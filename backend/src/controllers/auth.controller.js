const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { User, Patient, Doctor, AuditLog } = require("../models");
const logger = require("../utils/logger");

const generateTokens = (user) => {
  const payload = { id: user.id, role: user.role, email: user.email };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + "_refresh", { expiresIn: "30d" });
  return { accessToken, refreshToken };
};

// POST /api/auth/register
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

  const { name, email, password, role = "patient", phone } = req.body;
  try {
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ success: false, message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed, role, phone });

    // Auto-create profile based on role
    if (role === "patient") await Patient.create({ userId: user.id });
    if (role === "doctor") await Doctor.create({ userId: user.id, specialization: req.body.specialization || "General" });

    const { accessToken, refreshToken } = generateTokens(user);
    await user.update({ refreshToken });

    await AuditLog.create({ userId: user.id, action: "REGISTER", entity: "User", entityId: user.id, ipAddress: req.ip });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: { accessToken, refreshToken, user: { id: user.id, name: user.name, email: user.email, role: user.role } },
    });
  } catch (err) {
    logger.error("Register error:", err);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email, isActive: true } });
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const { accessToken, refreshToken } = generateTokens(user);
    await user.update({ refreshToken, lastLogin: new Date() });

    await AuditLog.create({ userId: user.id, action: "LOGIN", entity: "User", entityId: user.id, ipAddress: req.ip });

    res.json({
      success: true,
      message: "Login successful",
      data: { accessToken, refreshToken, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } },
    });
  } catch (err) {
    logger.error("Login error:", err);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};

// POST /api/auth/refresh
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ success: false, message: "Refresh token required" });
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + "_refresh");
    const user = await User.findByPk(decoded.id);
    if (!user || user.refreshToken !== refreshToken) return res.status(401).json({ success: false, message: "Invalid refresh token" });

    const tokens = generateTokens(user);
    await user.update({ refreshToken: tokens.refreshToken });
    res.json({ success: true, data: tokens });
  } catch (err) {
    res.status(401).json({ success: false, message: "Refresh token expired or invalid" });
  }
};

// POST /api/auth/logout
exports.logout = async (req, res) => {
  try {
    await req.user.update({ refreshToken: null });
    res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Logout failed" });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password", "refreshToken"] },
      include: [
        { association: "patientProfile" },
        { association: "doctorProfile" },
      ],
    });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
};
