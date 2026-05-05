const jwt = require("jsonwebtoken");
const { User } = require("../models");

// ─── Verify JWT ───────────────────────────────────────────────────────────────
exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id, { attributes: { exclude: ["password"] } });
    if (!user || !user.isActive) return res.status(401).json({ success: false, message: "User not found or inactive" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

// ─── Role-Based Access Control ────────────────────────────────────────────────
exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: "Access denied: insufficient permissions" });
  }
  next();
};

// ─── Optional Auth (doesn't fail if no token) ────────────────────────────────
exports.optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return next();
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id, { attributes: { exclude: ["password"] } });
    if (user?.isActive) req.user = user;
  } catch (_) {}
  next();
};
