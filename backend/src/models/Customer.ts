export type CustomerStatus = 'active' | 'inactive' | 'lead';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: CustomerStatus;
  createdAt: string;
}

export type CustomerInput = Omit<Customer, 'id' | 'createdAt'>;
