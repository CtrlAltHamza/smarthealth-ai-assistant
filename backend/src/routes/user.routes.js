// user.routes.js
const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth.middleware");
const { User } = require("../models");

router.get("/", authenticate, authorize("admin"), async (req, res) => {
  const users = await User.findAll({ attributes: { exclude: ["password", "refreshToken"] } });
  res.json({ success: true, data: users });
});

router.get("/:id", authenticate, async (req, res) => {
  const user = await User.findByPk(req.params.id, { attributes: { exclude: ["password", "refreshToken"] } });
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, data: user });
});

router.patch("/:id", authenticate, async (req, res) => {
  if (req.user.id !== req.params.id && req.user.role !== "admin")
    return res.status(403).json({ success: false, message: "Forbidden" });
  const { name, phone, avatar } = req.body;
  await req.user.update({ name, phone, avatar });
  res.json({ success: true, message: "Profile updated", data: req.user });
});

module.exports = router;
