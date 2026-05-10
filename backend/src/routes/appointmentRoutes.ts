import { Router } from 'express';
import {
  bookAppointment,
  getPatientAppointments,
  cancelAppointment,
  getDoctors,
} from '../controllers/appointmentController';
import { protect, requireRole, requireSelfOrRole } from '../middleware/auth';

const router = Router();

// Get all doctors
router.get('/doctors', protect as any, getDoctors as any);

// Book a new appointment
router.post('/book', protect as any, requireRole('Patient', 'Admin') as any, bookAppointment as any);

// Get appointments for a specific patient
router.get('/patient/:patientId', protect as any, requireSelfOrRole('patientId', 'Doctor', 'Admin') as any, getPatientAppointments as any);

// Cancel an appointment
router.patch('/cancel/:appointmentId', protect as any, requireRole('Patient', 'Admin') as any, cancelAppointment as any);

export default router;
