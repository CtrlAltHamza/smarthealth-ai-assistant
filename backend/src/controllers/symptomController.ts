import { Request, Response } from 'express';
import { HealthRecord } from '../models/HealthRecord';
import { AuthRequest } from '../middleware/auth';
import { fail, ok } from '../utils/http';
import { asNonEmptyString, asPositiveInt } from '../utils/validators';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

export const analyzeSymptoms = async (req: AuthRequest, res: Response) => {
  try {
    const patientId = asPositiveInt(req.body?.patientId);
    const text = asNonEmptyString(req.body?.text);
    if (!patientId || !text) {
      return fail(res, 400, 'patientId and text are required.');
    }
    if (req.user?.role === 'Patient' && req.user.id !== patientId) {
      return fail(res, 403, 'Patients can only analyze symptoms for themselves.');
    }

    // Send the symptom text to the Python FastAPI microservice
    console.log(`Sending request to AI service at ${AI_SERVICE_URL}/analyze-symptoms...`);
    const aiResponse = await fetch(`${AI_SERVICE_URL}/analyze-symptoms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Service Error Response:', errorText);
      throw new Error(`AI service failed with status ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log('AI Service Response:', aiData);

    // Save the record in the database
    const newRecord = await HealthRecord.create({
      patientId,
      reportedSymptoms: aiData.original_text,
      aiAnalysis: aiData.extracted_symptoms,
      severity: aiData.severity
    });

    return ok(res, {
      message: 'Analysis complete',
      record: newRecord
    });
  } catch (error: any) {
    console.error('Symptom Analysis Error Detail:', error.message || error);
    return fail(res, 500, 'Error analyzing symptoms', error.message);
  }
};
