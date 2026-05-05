const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SmartHealth AI Assistant API",
      version: "1.0.0",
      description: "RESTful API for SmartHealth AI Assistant — Intelligent Healthcare Symptom Analysis & Appointment Management",
    },
    servers: [{ url: process.env.API_URL || "http://localhost:5000", description: "Development" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.js"],
};

module.exports = swaggerJsdoc(options);
