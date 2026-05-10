import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import sequelize from '../db';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import { Appointment } from '../models/Appointment';
import { HealthRecord } from '../models/HealthRecord';

dotenv.config();

async function upsertUser(
  email: string,
  role: 'Patient' | 'Doctor' | 'Admin',
  firstName: string,
  lastName: string,
  password = 'Password123!'
) {
  const hashed = await bcrypt.hash(password, 10);
  const [user] = await User.findOrCreate({
    where: { email },
    defaults: { email, password: hashed, role },
  });

  if (user.role !== role || user.password !== hashed) {
    user.role = role;
    user.password = hashed;
    await user.save();
  }

  await Profile.findOrCreate({
    where: { userId: user.id },
    defaults: { userId: user.id, firstName, lastName, contactNumber: '03000000000' },
  });
  return user;
}

async function seed() {
  await sequelize.authenticate();
  await sequelize.sync();

  const patient = await upsertUser('patient@smarthealth.local', 'Patient', 'Demo', 'Patient');
  const doctor = await upsertUser('doctor@smarthealth.local', 'Doctor', 'Demo', 'Doctor');
  await upsertUser('admin@smarthealth.local', 'Admin', 'Demo', 'Admin');

  await Appointment.findOrCreate({
    where: {
      patientId: patient.id,
      doctorId: doctor.id,
      appointmentDate: new Date(Date.now() + 86400000),
    },
    defaults: {
      patientId: patient.id,
      doctorId: doctor.id,
      appointmentDate: new Date(Date.now() + 86400000),
      status: 'Scheduled',
      notes: 'Seeded follow-up visit',
    },
  });

  await HealthRecord.findOrCreate({
    where: {
      patientId: patient.id,
      reportedSymptoms: 'Fever and cough for two days',
    },
    defaults: {
      patientId: patient.id,
      reportedSymptoms: 'Fever and cough for two days',
      aiAnalysis: ['fever', 'cough'],
      severity: 'medium',
    },
  });

  console.log('Seed complete.');
  console.log('Demo logins:');
  console.log('patient@smarthealth.local / Password123!');
  console.log('doctor@smarthealth.local / Password123!');
  console.log('admin@smarthealth.local / Password123!');
  await sequelize.close();
}

seed().catch(async (err) => {
  console.error('Seed failed:', err);
  await sequelize.close();
  process.exit(1);
});
