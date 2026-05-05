const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/database");

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);

// ─── Model Definitions ────────────────────────────────────────────────────────

const User = sequelize.define("User", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM("patient", "doctor", "admin"), defaultValue: "patient" },
  phone: { type: DataTypes.STRING(20) },
  avatar: { type: DataTypes.TEXT },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  lastLogin: { type: DataTypes.DATE },
  refreshToken: { type: DataTypes.TEXT },
  verificationToken: { type: DataTypes.STRING },
  verificationTokenExpiry: { type: DataTypes.DATE },
  resetPasswordToken: { type: DataTypes.STRING },
  resetPasswordTokenExpiry: { type: DataTypes.DATE },
}, { tableName: "users", timestamps: true, paranoid: true });

const Patient = sequelize.define("Patient", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false, references: { model: "users", key: "id" } },
  dateOfBirth: { type: DataTypes.DATEONLY },
  gender: { type: DataTypes.ENUM("male", "female", "other") },
  bloodType: { type: DataTypes.ENUM("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-") },
  height: { type: DataTypes.FLOAT },
  weight: { type: DataTypes.FLOAT },
  allergies: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  chronicConditions: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  emergencyContact: { type: DataTypes.JSONB },
  address: { type: DataTypes.JSONB },
}, { tableName: "patients", timestamps: true });

const Doctor = sequelize.define("Doctor", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false, references: { model: "users", key: "id" } },
  specialization: { type: DataTypes.STRING(100), allowNull: false },
  qualifications: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  experience: { type: DataTypes.INTEGER, defaultValue: 0 },
  licenseNumber: { type: DataTypes.STRING(50), unique: true },
  consultationFee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  availability: { type: DataTypes.JSONB, defaultValue: {} },
  rating: { type: DataTypes.FLOAT, defaultValue: 0 },
  totalReviews: { type: DataTypes.INTEGER, defaultValue: 0 },
  bio: { type: DataTypes.TEXT },
  isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: "doctors", timestamps: true });

const Appointment = sequelize.define("Appointment", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  patientId: { type: DataTypes.UUID, allowNull: false },
  doctorId: { type: DataTypes.UUID, allowNull: false },
  scheduledAt: { type: DataTypes.DATE, allowNull: false },
  duration: { type: DataTypes.INTEGER, defaultValue: 30 },
  type: { type: DataTypes.ENUM("in-person", "video", "phone"), defaultValue: "in-person" },
  status: { type: DataTypes.ENUM("pending", "confirmed", "completed", "cancelled", "no-show"), defaultValue: "pending" },
  reason: { type: DataTypes.TEXT },
  notes: { type: DataTypes.TEXT },
  meetingLink: { type: DataTypes.TEXT },
  cancelReason: { type: DataTypes.TEXT },
}, { tableName: "appointments", timestamps: true, paranoid: true });

const Symptom = sequelize.define("Symptom", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  patientId: { type: DataTypes.UUID, allowNull: false },
  rawInput: { type: DataTypes.TEXT, allowNull: false },
  extractedSymptoms: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  severity: { type: DataTypes.ENUM("mild", "moderate", "severe"), defaultValue: "mild" },
  duration: { type: DataTypes.STRING(100) },
  sessionId: { type: DataTypes.UUID },
}, { tableName: "symptoms", timestamps: true });

const DiseasePrediction = sequelize.define("DiseasePrediction", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  patientId: { type: DataTypes.UUID, allowNull: false },
  symptomId: { type: DataTypes.UUID },
  predictedDiseases: { type: DataTypes.JSONB, defaultValue: [] },
  recommendedSpecialists: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  confidence: { type: DataTypes.FLOAT },
  modelVersion: { type: DataTypes.STRING(20) },
  actionTaken: { type: DataTypes.STRING(50) },
}, { tableName: "disease_predictions", timestamps: true });

const MedicalRecord = sequelize.define("MedicalRecord", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  patientId: { type: DataTypes.UUID, allowNull: false },
  appointmentId: { type: DataTypes.UUID },
  doctorId: { type: DataTypes.UUID },
  diagnosis: { type: DataTypes.TEXT },
  prescription: { type: DataTypes.JSONB },
  labResults: { type: DataTypes.JSONB },
  attachments: { type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: [] },
  notes: { type: DataTypes.TEXT },
  followUpDate: { type: DataTypes.DATEONLY },
}, { tableName: "medical_records", timestamps: true });

const Notification = sequelize.define("Notification", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  type: { type: DataTypes.ENUM("appointment", "reminder", "result", "system", "message"), defaultValue: "system" },
  title: { type: DataTypes.STRING(200), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  data: { type: DataTypes.JSONB, defaultValue: {} },
}, { tableName: "notifications", timestamps: true });

const Review = sequelize.define("Review", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  patientId: { type: DataTypes.UUID, allowNull: false },
  doctorId: { type: DataTypes.UUID, allowNull: false },
  appointmentId: { type: DataTypes.UUID },
  rating: { type: DataTypes.INTEGER, validate: { min: 1, max: 5 } },
  comment: { type: DataTypes.TEXT },
}, { tableName: "reviews", timestamps: true });

const AuditLog = sequelize.define("AuditLog", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID },
  action: { type: DataTypes.STRING(100), allowNull: false },
  entity: { type: DataTypes.STRING(50) },
  entityId: { type: DataTypes.UUID },
  oldValues: { type: DataTypes.JSONB },
  newValues: { type: DataTypes.JSONB },
  ipAddress: { type: DataTypes.STRING(45) },
  userAgent: { type: DataTypes.TEXT },
}, { tableName: "audit_logs", timestamps: true });

// ─── Associations ─────────────────────────────────────────────────────────────
User.hasOne(Patient, { foreignKey: "userId", as: "patientProfile" });
Patient.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasOne(Doctor, { foreignKey: "userId", as: "doctorProfile" });
Doctor.belongsTo(User, { foreignKey: "userId", as: "user" });

Patient.hasMany(Appointment, { foreignKey: "patientId", as: "appointments" });
Doctor.hasMany(Appointment, { foreignKey: "doctorId", as: "appointments" });
Appointment.belongsTo(Patient, { foreignKey: "patientId", as: "patient" });
Appointment.belongsTo(Doctor, { foreignKey: "doctorId", as: "doctor" });

Patient.hasMany(Symptom, { foreignKey: "patientId", as: "symptoms" });
Patient.hasMany(DiseasePrediction, { foreignKey: "patientId", as: "predictions" });
Patient.hasMany(MedicalRecord, { foreignKey: "patientId", as: "medicalRecords" });

User.hasMany(Notification, { foreignKey: "userId", as: "notifications" });

Doctor.hasMany(Review, { foreignKey: "doctorId", as: "reviews" });
Patient.hasMany(Review, { foreignKey: "patientId", as: "reviews" });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Patient,
  Doctor,
  Appointment,
  Symptom,
  DiseasePrediction,
  MedicalRecord,
  Notification,
  Review,
  AuditLog,
};
