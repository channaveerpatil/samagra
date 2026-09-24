import * as customerRepository from '../repositories/customerRepository';
import * as auditLogService from './auditLogService';
import type { Customer, CustomerInput } from '../models/Customer';
import { AppError } from '../utils/AppError';

export async function listCustomers(): Promise<Customer[]> {
  return customerRepository.findAll();
}

export async function getCustomer(id: string): Promise<Customer> {
  const customer = await customerRepository.findById(id);
  if (!customer) {
    throw new AppError(`Customer "${id}" was not found`, 404);
  }
  return customer;
}

export async function createCustomer(input: CustomerInput, actorId?: string): Promise<Customer> {
  const customer = await customerRepository.create(input);
  auditLogService.record(
    {
      action: 'CUSTOMER_CREATED',
      module: 'CUSTOMERS',
      target: customer.company,
      description: 'Created a new customer record.',
      newValue: `status: ${customer.status}`,
    },
    actorId,
  );
  return customer;
}

export async function updateCustomer(id: string, input: CustomerInput): Promise<Customer> {
  const updated = await customerRepository.update(id, input);
  if (!updated) {
    throw new AppError(`Customer "${id}" was not found`, 404);
  }
  return updated;
}

export async function removeCustomer(id: string): Promise<void> {
  const removed = await customerRepository.remove(id);
  if (!removed) {
    throw new AppError(`Customer "${id}" was not found`, 404);
  }
}
