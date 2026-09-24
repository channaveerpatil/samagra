import * as userRepository from '../repositories/userRepository';
import * as auditLogService from './auditLogService';
import type { User, UserInput, UserProfileUpdate } from '../models/User';
import { AppError } from '../utils/AppError';

export async function listUsers(): Promise<User[]> {
  return userRepository.findAll();
}

export async function createUser(input: UserInput, actorId?: string): Promise<User> {
  const existing = await userRepository.findByEmail(input.email);
  if (existing) {
    throw new AppError(`A user with email "${input.email}" already exists`, 409);
  }
  const user = await userRepository.create(input);
  auditLogService.record(
    {
      action: 'USER_CREATED',
      module: 'USERS',
      target: `${user.firstName} ${user.lastName} (${user.email})`,
      description: `Added a new user account with the ${user.role} role.`,
      newValue: `role: ${user.role}`,
    },
    actorId,
  );
  return user;
}

export async function updateUser(id: string, input: UserInput, actorId?: string): Promise<User> {
  const existingWithEmail = await userRepository.findByEmail(input.email);
  if (existingWithEmail && existingWithEmail.id !== id) {
    throw new AppError(`A user with email "${input.email}" already exists`, 409);
  }
  const before = await userRepository.findById(id);
  const updated = await userRepository.update(id, input);
  if (!updated) {
    throw new AppError(`User "${id}" was not found`, 404);
  }
  if (before && before.role !== updated.role) {
    auditLogService.record(
      {
        action: 'USER_ROLE_CHANGED',
        module: 'USERS',
        target: `${updated.firstName} ${updated.lastName} (${updated.email})`,
        description: `Changed ${updated.firstName} ${updated.lastName}'s role from ${before.role} to ${updated.role}.`,
        previousValue: `role: ${before.role}`,
        newValue: `role: ${updated.role}`,
      },
      actorId,
    );
  }
  return updated;
}

export async function updateOwnProfile(id: string, updates: UserProfileUpdate): Promise<User> {
  const updated = await userRepository.updateProfile(id, updates);
  if (!updated) {
    throw new AppError(`User "${id}" was not found`, 404);
  }
  return updated;
}
