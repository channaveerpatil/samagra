import type { NextFunction, Request, Response } from 'express';
import * as customerService from '../services/customerService';
import type { CustomerInput, CustomerStatus } from '../models/Customer';
import { AppError } from '../utils/AppError';

const VALID_STATUSES: CustomerStatus[] = ['active', 'inactive', 'lead'];

function parseCustomerInput(body: unknown): CustomerInput {
  const { name, email, phone, company, status } = (body ?? {}) as Partial<CustomerInput>;

  if (!name) {
    throw new AppError('"name" is required', 400);
  }
  if (!email) {
    throw new AppError('"email" is required', 400);
  }
  if (!phone) {
    throw new AppError('"phone" is required', 400);
  }
  if (!company) {
    throw new AppError('"company" is required', 400);
  }
  if (!status || !VALID_STATUSES.includes(status)) {
    throw new AppError('"status" must be one of: active, inactive, lead', 400);
  }

  return { name, email, phone, company, status };
}

export async function listCustomers(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    res.status(200).json(await customerService.listCustomers());
  } catch (err) {
    next(err);
  }
}

export async function getCustomer(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    res.status(200).json(await customerService.getCustomer(req.params.id));
  } catch (err) {
    next(err);
  }
}

export async function createCustomer(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = parseCustomerInput(req.body);
    res.status(201).json(await customerService.createCustomer(input, req.user?.id));
  } catch (err) {
    next(err);
  }
}

export async function updateCustomer(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = parseCustomerInput(req.body);
    res.status(200).json(await customerService.updateCustomer(req.params.id, input));
  } catch (err) {
    next(err);
  }
}

export async function removeCustomer(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await customerService.removeCustomer(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
