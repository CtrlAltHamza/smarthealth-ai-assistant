require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const { Server } = require("socket.io");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const logger = require("./utils/logger");
const { sequelize } = require("./models");

const app = express();
const server = http.createServer(app);

// ─── Socket.io ────────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || "http://localhost:3000", credentials: true },
});
app.set("io", io);
io.on("connection", (socket) => {
  logger.info(`Socket connected: ${socket.id}`);
  socket.on("join_room", (userId) => socket.join(`user_${userId}`));
  socket.on("disconnect", () => logger.info(`Socket disconnected: ${socket.id}`));
});

// ─── Security & Core Middleware ───────────────────────────────────────────────
app.use(helmet());
app.use(compression());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined", { stream: { write: (msg) => logger.info(msg.trim()) } }));

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: "Too many auth attempts" });
app.use("/api", globalLimiter);
app.use("/api/auth", authLimiter);

// ─── Swagger Docs ─────────────────────────────────────────────────────────────
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth",         require("./routes/auth.routes"));
app.use("/api/email",        require("./routes/email.routes"));
app.use("/api/users",        require("./routes/user.routes"));
app.use("/api/patients",     require("./routes/patient.routes"));
app.use("/api/doctors",      require("./routes/doctor.routes"));
app.use("/api/appointments", require("./routes/appointment.routes"));
app.use("/api/symptoms",     require("./routes/symptom.routes"));
app.use("/api/predictions",  require("./routes/prediction.routes"));
app.use("/api/notifications",require("./routes/notification.routes"));
app.use("/api/admin",        require("./routes/admin.routes"));
app.use("/api/dashboard",    require("./routes/dashboard.routes"));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => res.json({ status: "OK", timestamp: new Date().toISOString() }));

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ─── Database + Server Start ──────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
sequelize
  .authenticate()
  .then(() => {
    logger.info("Database connected successfully");
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    logger.info("Database synced successfully");
    server.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    logger.error("Database connection failed:", err);
    process.exit(1);
  });

module.exports = { app, server };
