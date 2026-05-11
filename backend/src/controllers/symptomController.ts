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
    const fullUrl = `${AI_SERVICE_URL}/analyze-symptoms`;
    console.log(`Sending request to AI service at ${fullUrl}...`);
    const aiResponse = await fetch(fullUrl, {
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
      severity: aiData.severity,
      predictions: aiData.predictions,
      recommended_specialist: aiData.recommended_specialist,
      followUpQuestions: aiData.follow_up_questions,
      matchedKnownSymptoms: aiData.matched_known_symptoms,
    });

    return ok(res, {
      message: 'Analysis complete',
      record: newRecord
    });
  } catch (error: any) {
    console.error('Symptom Analysis Error Detail:', error);
    if (error.cause) console.error('Error Cause:', error.cause);
    return fail(res, 500, 'Error analyzing symptoms', error.message);
  }
};
