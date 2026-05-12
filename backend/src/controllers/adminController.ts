import { Request, Response } from 'express';
import { Appointment } from '../models/Appointment';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import { HealthRecord } from '../models/HealthRecord';
import { AuthRequest } from '../middleware/auth';
import { fail, ok } from '../utils/http';
import { asPositiveInt } from '../utils/validators';

// Doctor: Get all their appointments
export const getDoctorAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const doctorId = asPositiveInt(req.params.doctorId);
    if (!doctorId) return fail(res, 400, 'Invalid doctorId.');
    if (req.user?.role === 'Doctor' && req.user.id !== doctorId) {
      return fail(res, 403, 'Doctors can only view their own appointments.');
    }
    const appointments = await Appointment.findAll({
      where: { doctorId },
      include: [
        {
          model: User,
          as: 'Patient',
          attributes: ['id', 'email'],
          include: [{ model: Profile, as: 'Profile', attributes: ['firstName', 'lastName', 'contactNumber'] }],
        },
      ],
      order: [['appointmentDate', 'ASC']],
    });
    return ok(res, appointments);
  } catch (error) {
    return fail(res, 500, 'Error fetching doctor appointments.');
  }
};

// Doctor: Update appointment status
export const updateAppointmentStatus = async (req: AuthRequest, res: Response) => {
  try {
    const appointmentId = asPositiveInt(req.params.appointmentId);
    const { status } = req.body;
    if (!appointmentId) return fail(res, 400, 'Invalid appointmentId.');
    if (!['Scheduled', 'Completed', 'Cancelled'].includes(status)) {
      return fail(res, 400, 'Invalid status.');
    }
    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) return fail(res, 404, 'Appointment not found.');
    if (req.user?.role === 'Doctor' && appointment.doctorId !== req.user.id) {
      return fail(res, 403, 'Doctors can only update their own appointments.');
    }
    appointment.status = status;
    await appointment.save();
    return ok(res, { message: 'Status updated.', appointment });
  } catch (error) {
    return fail(res, 500, 'Error updating status.');
  }
};

// Admin: Get all users
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'role', 'createdAt'],
      include: [{ model: Profile, as: 'Profile', attributes: ['firstName', 'lastName'] }],
      order: [['createdAt', 'DESC']],
    });
    return ok(res, users);
  } catch (error) {
    return fail(res, 500, 'Error fetching users.');
  }
};

// Admin: Delete a user
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = asPositiveInt(req.params.userId);
    if (!userId) return fail(res, 400, 'Invalid userId.');
    if (req.user?.id === userId) return fail(res, 400, 'Admin cannot delete themselves.');
    await User.destroy({ where: { id: userId } });
    return ok(res, { message: 'User deleted.' });
  } catch (error) {
    return fail(res, 500, 'Error deleting user.');
  }
};

// Patient: Get their health records
export const getHealthRecords = async (req: AuthRequest, res: Response) => {
  try {
    const patientId = asPositiveInt(req.params.patientId);
    if (!patientId) return fail(res, 400, 'Invalid patientId.');
    if (req.user?.role === 'Patient' && req.user.id !== patientId) {
      return fail(res, 403, 'Patients can only view their own health records.');
    }
    const records = await HealthRecord.findAll({
      where: { patientId },
      order: [['createdAt', 'DESC']],
    });
    return ok(res, records);
  } catch (error) {
    console.error('Error fetching health records:', error);
    return fail(res, 500, 'Error fetching health records.');
  }
};
