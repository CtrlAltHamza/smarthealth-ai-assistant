import { Router } from 'express';
import {
  getDoctorAppointments,
  updateAppointmentStatus,
  getAllUsers,
  deleteUser,
  getHealthRecords,
} from '../controllers/adminController';
import { protect, requireRole, requireSelfOrRole } from '../middleware/auth';

const router = Router();

// Doctor routes
router.get('/doctor-appointments/:doctorId', protect as any, requireSelfOrRole('doctorId', 'Admin') as any, getDoctorAppointments as any);
router.patch('/appointment-status/:appointmentId', protect as any, requireRole('Doctor', 'Admin') as any, updateAppointmentStatus as any);

// Admin routes
router.get('/users', protect as any, requireRole('Admin') as any, getAllUsers as any);
router.delete('/users/:userId', protect as any, requireRole('Admin') as any, deleteUser as any);

// Patient health records
router.get('/health-records/:patientId', protect as any, requireSelfOrRole('patientId', 'Doctor', 'Admin') as any, getHealthRecords as any);

export default router;
