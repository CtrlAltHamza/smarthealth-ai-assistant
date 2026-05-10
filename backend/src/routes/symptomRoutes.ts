import { Router } from 'express';
import { analyzeSymptoms } from '../controllers/symptomController';
import { protect, requireRole } from '../middleware/auth';
import { fail } from '../utils/http';

const router = Router();
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

/**
 * @swagger
 * /api/symptoms/analyze:
 *   post:
 *     summary: Analyze patient symptoms using NLP
 *     tags: [Symptoms]
 */
router.post('/analyze', protect as any, requireRole('Patient', 'Doctor', 'Admin') as any, analyzeSymptoms as any);

/**
 * @swagger
 * /api/symptoms/predict:
 *   post:
 *     summary: Predict disease from symptom list using ML model
 *     tags: [Symptoms]
 */
router.post('/predict', async (req, res) => {
  try {
    const { symptoms } = req.body;
    if (!Array.isArray(symptoms) || symptoms.length === 0) {
      return fail(res, 400, 'symptoms must be a non-empty array.');
    }
    const aiRes = await fetch(`${AI_SERVICE_URL}/predict-disease`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symptoms }),
    });
    const data = await aiRes.json();
    return res.json({ success: true, data });
  } catch (error) {
    return fail(res, 500, 'Error calling prediction service.');
  }
});

/**
 * @swagger
 * /api/symptoms/list:
 *   get:
 *     summary: Get list of recognized symptom keys
 *     tags: [Symptoms]
 */
router.get('/list', async (_req, res) => {
  try {
    const aiRes = await fetch(`${AI_SERVICE_URL}/symptoms-list`);
    const data = await aiRes.json();
    return res.json({ success: true, data });
  } catch {
    return fail(res, 500, 'Error fetching symptoms list.');
  }
});

export default router;
