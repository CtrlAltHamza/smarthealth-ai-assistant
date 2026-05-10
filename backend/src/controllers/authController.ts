import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import { fail, ok } from '../utils/http';
import { asNonEmptyString } from '../utils/validators';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey_smarthealth';
type UserRole = 'Patient' | 'Doctor' | 'Admin';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const email = asNonEmptyString(req.body?.email);
    const password = asNonEmptyString(req.body?.password);
    const firstName = asNonEmptyString(req.body?.firstName);
    const lastName = asNonEmptyString(req.body?.lastName);
    const role = (asNonEmptyString(req.body?.role) ?? 'Patient') as UserRole;
    const allowedRoles: UserRole[] = ['Patient', 'Doctor', 'Admin'];

    if (!email || !password || !firstName || !lastName) {
      return fail(res, 400, 'email, password, firstName and lastName are required.');
    }
    if (password.length < 6) {
      return fail(res, 400, 'Password must be at least 6 characters.');
    }
    if (!allowedRoles.includes(role)) {
      return fail(res, 400, 'Invalid role.');
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return fail(res, 400, 'User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: role || 'Patient',
    });

    await Profile.create({
      userId: newUser.id,
      firstName,
      lastName,
    });

    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '1d' });

    return ok(res, {
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        firstName,
        lastName
      }
    }, 201);
  } catch (error) {
    console.error('Registration Error:', error);
    return fail(res, 500, 'Server error during registration');
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const email = asNonEmptyString(req.body?.email);
    const password = asNonEmptyString(req.body?.password);
    if (!email || !password) {
      return fail(res, 400, 'email and password are required.');
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return fail(res, 400, 'Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return fail(res, 400, 'Invalid credentials');
    }

    const profile = await Profile.findOne({ where: { userId: user.id } });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    return ok(res, {
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: profile?.firstName,
        lastName: profile?.lastName
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return fail(res, 500, 'Server error during login');
  }
};
