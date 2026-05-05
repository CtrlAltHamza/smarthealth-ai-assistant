const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authController = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and authorization
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 */
router.post("/register", [
  body("name").trim().notEmpty().isLength({ min: 2, max: 100 }),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  body("role").optional().isIn(["patient", "doctor"]),
  body("phone").optional().isMobilePhone(),
], authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 */
router.post("/login", [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
], authController.login);

router.post("/refresh", authController.refreshToken);
router.post("/logout", authenticate, authController.logout);
router.get("/me", authenticate, authController.getMe);

module.exports = router;
