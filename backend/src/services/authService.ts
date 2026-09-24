import * as userRepository from '../repositories/userRepository';
import * as sessionRepository from '../repositories/sessionRepository';
import { hashPassword, verifyPassword } from '../utils/password';
import { config } from '../config/env';
import { AppError } from '../utils/AppError';
import type { User } from '../models/User';
import type { Session } from '../models/Session';

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  company?: string;
}

export async function register(
  input: RegisterInput,
): Promise<{ user: User; session: Session }> {
  const existing = await userRepository.findByEmail(input.email);
  if (existing) {
    throw new AppError('An account with this email already exists', 409);
  }

  const passwordHash = await hashPassword(input.password);
  const user = await userRepository.create(
    {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      role: 'USER',
      company: input.company,
    },
    passwordHash,
  );

  const session = await sessionRepository.create(user.id, config.sessionTtlMs);
  return { user, session };
}

export async function resetPassword(email: string, newPassword: string): Promise<void> {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new AppError('No account found with this email', 404);
  }

  const passwordHash = await hashPassword(newPassword);
  await userRepository.updatePasswordHash(user.id, passwordHash);
}

export async function login(email: string, password: string): Promise<{ user: User; session: Session }> {
  const credential = await userRepository.findCredentialByEmail(email);
  if (!credential || !credential.passwordHash) {
    throw new AppError('Invalid email or password', 401);
  }

  const valid = await verifyPassword(password, credential.passwordHash);
  if (!valid) {
    throw new AppError('Invalid email or password', 401);
  }

  const session = await sessionRepository.create(credential.user.id, config.sessionTtlMs);
  return { user: credential.user, session };
}

export async function logout(sessionId: string): Promise<void> {
  await sessionRepository.remove(sessionId);
}

export async function getUserForSession(sessionId: string): Promise<User | undefined> {
  const session = await sessionRepository.findValidById(sessionId);
  if (!session) {
    return undefined;
  }
  return userRepository.findById(session.userId);
}
