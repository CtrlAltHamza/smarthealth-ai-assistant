import { Router } from 'express';
import {
  bookAppointment,
  getPatientAppointments,
  cancelAppointment,
  getDoctors,
  rescheduleAppointment,
} from '../controllers/appointmentController';
import { createReview, getDoctorReviews } from '../controllers/reviewController';
import { protect, requireRole, requireSelfOrRole } from '../middleware/auth';

const router = Router();

router.get('/reviews/doctor/:doctorId', getDoctorReviews as any);

// Get all doctors
router.get('/doctors', protect as any, getDoctors as any);

router.post('/reviews', protect as any, requireRole('Patient') as any, createReview as any);

// Book a new appointment
router.post('/book', protect as any, requireRole('Patient', 'Admin') as any, bookAppointment as any);

router.patch('/reschedule/:appointmentId', protect as any, requireRole('Patient', 'Admin') as any, rescheduleAppointment as any);

// Get appointments for a specific patient
router.get('/patient/:patientId', protect as any, requireSelfOrRole('patientId', 'Doctor', 'Admin') as any, getPatientAppointments as any);

// Cancel an appointment
router.patch('/cancel/:appointmentId', protect as any, requireRole('Patient', 'Admin') as any, cancelAppointment as any);

export default router;
