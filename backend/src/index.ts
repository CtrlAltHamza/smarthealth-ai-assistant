import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import sequelize from './db';
import { User } from './models/User';
import { Profile } from './models/Profile';
import { Appointment } from './models/Appointment';
import { HealthRecord } from './models/HealthRecord';
import authRoutes from './routes/authRoutes';
import symptomRoutes from './routes/symptomRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import adminRoutes from './routes/adminRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';
const DB_SYNC_ALTER = process.env.DB_SYNC_ALTER === 'true';

app.use(cors());
app.use(express.json());

// ─── Swagger Setup ─────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SmartHealth AI Assistant API',
      version: '1.0.0',
      description: 'REST API for SmartHealth - AI-powered healthcare platform',
    },
    servers: [{ url: `http://localhost:${PORT}` }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── Routes ────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (_req, res) => {
  res.json({
    message: 'SmartHealth Backend API is running!',
    docs: `http://localhost:${PORT}/api-docs`,
    version: '1.0.0',
  });
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'SmartHealth API is running',
    aiServiceUrl: AI_SERVICE_URL,
    dbDialect: process.env.DB_DIALECT || 'postgres',
  });
});

// ─── Start Server ──────────────────────────────
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    await sequelize.sync({ alter: DB_SYNC_ALTER });
    console.log('Models synchronized.');
    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
