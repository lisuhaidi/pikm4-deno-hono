// src/utils/userUtils.ts
import bcrypt from 'bcryptjs';
import { User } from '../models/user.ts';

export const validateInput = ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) => {
  if (!oldPassword || !newPassword || newPassword.length < 6) {
    throw new Error('Invalid input. Password must be at least 6 characters long.');
  }
};

export const findUserById = async (id: string, excludePassword = false) => {
  const query = excludePassword ? User.findById(id).select('-password') : User.findById(id);
  return query;
};

export const hashPassword = async (password: string) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (inputPassword: string, storedPassword: string) => {
  return bcrypt.compare(inputPassword, storedPassword);
};
