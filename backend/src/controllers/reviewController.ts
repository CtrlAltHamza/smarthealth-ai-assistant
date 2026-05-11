import { Request, Response } from 'express';
import sequelize from '../db';
import { DoctorReview } from '../models/DoctorReview';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import { Appointment } from '../models/Appointment';
import { AuthRequest } from '../middleware/auth';
import { fail, ok } from '../utils/http';
import { asPositiveInt } from '../utils/validators';

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'Patient') {
      return fail(res, 403, 'Only patients can submit doctor reviews.');
    }
    const doctorId = asPositiveInt(req.body?.doctorId);
    const rating = Number(req.body?.rating);
    const comment = typeof req.body?.comment === 'string' ? req.body.comment.trim() : '';
    const appointmentId = req.body?.appointmentId != null ? asPositiveInt(req.body.appointmentId) : null;

    if (!doctorId || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return fail(res, 400, 'doctorId and rating (1–5) are required.');
    }
    if (doctorId === req.user.id) {
      return fail(res, 400, 'You cannot review yourself.');
    }

    const doctor = await User.findOne({ where: { id: doctorId, role: 'Doctor' } });
    if (!doctor) {
      return fail(res, 404, 'Doctor not found.');
    }

    if (appointmentId) {
      const appt = await Appointment.findByPk(appointmentId);
      if (!appt || appt.patientId !== req.user.id || appt.doctorId !== doctorId) {
        return fail(res, 400, 'Invalid appointment for this doctor.');
      }
    }

    const review = await DoctorReview.create({
      doctorId,
      patientId: req.user.id,
      appointmentId: appointmentId ?? null,
      rating,
      comment: comment || null,
    });

    const io = req.app.get('io');
    io?.emit('notification', {
      type: 'review_submitted',
      doctorId,
      message: 'A new patient review was submitted.',
    });

    return ok(res, { message: 'Thank you for your feedback.', review }, 201);
  } catch (error) {
    console.error('Create Review Error:', error);
    return fail(res, 500, 'Server error saving review.');
  }
};

export const getDoctorReviews = async (req: Request, res: Response) => {
  try {
    const doctorId = asPositiveInt(req.params.doctorId);
    if (!doctorId) return fail(res, 400, 'Invalid doctorId.');

    const reviews = await DoctorReview.findAll({
      where: { doctorId },
      include: [
        {
          model: User,
          as: 'Patient',
          attributes: ['id', 'email'],
          include: [{ model: Profile, attributes: ['firstName', 'lastName'] }],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: 100,
    });

    const summaryRow = await DoctorReview.findOne({
      where: { doctorId },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      raw: true,
    }) as { avgRating: string | null; count: string } | null;

    return ok(res, {
      reviews,
      summary: {
        avgRating: summaryRow?.avgRating != null ? Math.round(Number(summaryRow.avgRating) * 10) / 10 : 0,
        count: summaryRow?.count != null ? Number(summaryRow.count) : 0,
      },
    });
  } catch (error) {
    console.error('Get Reviews Error:', error);
    return fail(res, 500, 'Server error fetching reviews.');
  }
};
