import { Request, Response } from 'express';
import { Op } from 'sequelize';
import sequelize from '../db';
import { Appointment } from '../models/Appointment';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import { DoctorReview } from '../models/DoctorReview';
import { AuthRequest } from '../middleware/auth';
import { fail, ok } from '../utils/http';
import { asDate, asPositiveInt } from '../utils/validators';

// Book a new appointment
export const bookAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const patientId = asPositiveInt(req.body?.patientId);
    const doctorId = asPositiveInt(req.body?.doctorId);
    const appointmentDate = asDate(req.body?.appointmentDate);
    const notes = typeof req.body?.notes === 'string' ? req.body.notes : '';

    if (!patientId || !doctorId || !appointmentDate) {
      return fail(res, 400, 'patientId, doctorId, and appointmentDate are required.');
    }
    if (req.user?.role === 'Patient' && req.user.id !== patientId) {
      return fail(res, 403, 'Patients can only book appointments for themselves.');
    }

    // Check if doctor exists and has Doctor role
    const doctor = await User.findOne({ where: { id: doctorId, role: 'Doctor' } });
    if (!doctor) {
      return fail(res, 404, 'Doctor not found.');
    }

    // Check for conflicting appointment on same slot (within 30 min)
    const reqDate = appointmentDate;
    const windowStart = new Date(reqDate.getTime() - 30 * 60 * 1000);
    const windowEnd = new Date(reqDate.getTime() + 30 * 60 * 1000);

    const conflict = await Appointment.findOne({
      where: {
        doctorId,
        status: 'Scheduled',
        appointmentDate: { [Op.between]: [windowStart, windowEnd] },
      },
    });

    if (conflict) {
      return fail(res, 409, 'Doctor is unavailable at this time. Please choose another slot.');
    }

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      appointmentDate: reqDate,
      notes: notes || '',
    });

    const io = req.app.get('io');
    io?.emit('appointment_booked', {
      patientId,
      doctorId,
      appointmentId: appointment.id,
      appointmentDate: appointment.appointmentDate,
    });
    io?.to(`user:${patientId}`).emit('notification', {
      type: 'appointment_booked',
      title: 'Appointment confirmed',
      message: 'Your visit has been scheduled. Check Appointments for details.',
    });
    io?.to(`user:${doctorId}`).emit('notification', {
      type: 'appointment_booked',
      title: 'New booking',
      message: 'A patient booked an appointment with you.',
    });

    return ok(res, { message: 'Appointment booked successfully!', appointment }, 201);
  } catch (error) {
    console.error('Book Appointment Error:', error);
    return fail(res, 500, 'Server error while booking appointment.');
  }
};

// Get all appointments for a patient
export const getPatientAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const patientId = asPositiveInt(req.params.patientId);
    if (!patientId) return fail(res, 400, 'Invalid patientId.');
    if (req.user?.role === 'Patient' && req.user.id !== patientId) {
      return fail(res, 403, 'Patients can only view their own appointments.');
    }
    const appointments = await Appointment.findAll({
      where: { patientId },
      include: [
        {
          model: User,
          as: 'Doctor',
          attributes: ['id', 'email'],
          include: [{ model: Profile, attributes: ['firstName', 'lastName'] }],
        },
      ],
      order: [['appointmentDate', 'ASC']],
    });
    return ok(res, appointments);
  } catch (error) {
    console.error('Get Patient Appointments Error:', error);
    return fail(res, 500, 'Server error fetching appointments.');
  }
};

// Cancel an appointment
export const cancelAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const appointmentId = asPositiveInt(req.params.appointmentId);
    if (!appointmentId) return fail(res, 400, 'Invalid appointmentId.');
    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) {
      return fail(res, 404, 'Appointment not found.');
    }
    if (req.user?.role === 'Patient' && appointment.patientId !== req.user.id) {
      return fail(res, 403, 'You can only cancel your own appointments.');
    }
    appointment.status = 'Cancelled';
    await appointment.save();

    const io = req.app.get('io');
    io?.emit('appointment_cancelled', { appointmentId, patientId: appointment.patientId, doctorId: appointment.doctorId });
    io?.to(`user:${appointment.patientId}`).emit('notification', {
      type: 'appointment_cancelled',
      title: 'Appointment cancelled',
      message: 'Your appointment has been cancelled.',
    });
    io?.to(`user:${appointment.doctorId}`).emit('notification', {
      type: 'appointment_cancelled',
      title: 'Appointment cancelled',
      message: 'A patient cancelled a scheduled visit.',
    });

    return ok(res, { message: 'Appointment cancelled successfully.', appointment });
  } catch (error) {
    console.error('Cancel Appointment Error:', error);
    return fail(res, 500, 'Server error cancelling appointment.');
  }
};

export const rescheduleAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const appointmentId = asPositiveInt(req.params.appointmentId);
    const appointmentDate = asDate(req.body?.appointmentDate);
    if (!appointmentId || !appointmentDate) {
      return fail(res, 400, 'appointmentId and appointmentDate are required.');
    }
    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) {
      return fail(res, 404, 'Appointment not found.');
    }
    if (req.user?.role === 'Patient' && appointment.patientId !== req.user.id) {
      return fail(res, 403, 'You can only reschedule your own appointments.');
    }
    if (appointment.status !== 'Scheduled') {
      return fail(res, 400, 'Only scheduled appointments can be rescheduled.');
    }

    const doctorId = appointment.doctorId;
    const reqDate = appointmentDate;
    const windowStart = new Date(reqDate.getTime() - 30 * 60 * 1000);
    const windowEnd = new Date(reqDate.getTime() + 30 * 60 * 1000);

    const conflict = await Appointment.findOne({
      where: {
        doctorId,
        status: 'Scheduled',
        id: { [Op.ne]: appointmentId },
        appointmentDate: { [Op.between]: [windowStart, windowEnd] },
      },
    });
    if (conflict) {
      return fail(res, 409, 'Doctor is unavailable at this time. Please choose another slot.');
    }

    appointment.appointmentDate = reqDate;
    await appointment.save();

    const io = req.app.get('io');
    io?.to(`user:${appointment.patientId}`).emit('notification', {
      type: 'appointment_rescheduled',
      title: 'Appointment updated',
      message: 'Your visit time has been changed.',
    });
    io?.to(`user:${appointment.doctorId}`).emit('notification', {
      type: 'appointment_rescheduled',
      title: 'Schedule change',
      message: 'A patient rescheduled an appointment.',
    });

    return ok(res, { message: 'Appointment rescheduled.', appointment });
  } catch (error) {
    console.error('Reschedule Error:', error);
    return fail(res, 500, 'Server error rescheduling appointment.');
  }
};

// Get all available doctors
export const getDoctors = async (_req: Request, res: Response) => {
  try {
    const doctors = await User.findAll({
      where: { role: 'Doctor' },
      attributes: ['id', 'email'],
      include: [{ model: Profile, attributes: ['firstName', 'lastName', 'contactNumber'] }],
    });
    const ids = doctors.map((d) => d.id);
    if (ids.length === 0) {
      return ok(res, []);
    }
    const stats = (await DoctorReview.findAll({
      attributes: [
        'doctorId',
        [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating'],
        [sequelize.fn('COUNT', sequelize.col('DoctorReview.id')), 'reviewCount'],
      ],
      where: { doctorId: { [Op.in]: ids } },
      group: ['doctorId'],
      raw: true,
    })) as unknown as { doctorId: number; avgRating: string; reviewCount: string }[];

    const statMap = new Map(
      stats.map((s) => [
        s.doctorId,
        {
          avgRating: Math.round(Number(s.avgRating) * 10) / 10,
          reviewCount: Number(s.reviewCount),
        },
      ])
    );

    const payload = doctors.map((d) => {
      const plain = d.toJSON() as unknown as Record<string, unknown>;
      const st = statMap.get(d.id);
      return {
        ...plain,
        avgRating: st?.avgRating ?? 0,
        reviewCount: st?.reviewCount ?? 0,
      };
    });
    return ok(res, payload);
  } catch (error) {
    console.error('Get Doctors Error:', error);
    return fail(res, 500, 'Server error fetching doctors.');
  }
};
